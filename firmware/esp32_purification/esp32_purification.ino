/*
 * AquaTech · ESP32 Controller B: Sewage Water Purification
 * Subsystem: Multi-Stage Greywater Treatment & Quality Verification
 * 
 * Hardware Connections:
 * - Analog pH Sensor (BNC Probe): Analog Pin GPIO 35
 * - Optical Turbidity Sensor (Infrared Scattering): Analog Pin GPIO 32
 * - DS18B20 Temp Probe: OneWire GPIO 4
 * - Electromagnetic/Pulse Flow: Digital Interrupt GPIO 18
 * 
 * Protocol: MQTT over Wi-Fi (JSON Payload to "aquatech/purification/sensors")
 */

#include <WiFi.h>
#include <PubSubClient.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <ArduinoJson.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* mqtt_server = "broker.hivemq.com";
const int mqtt_port = 1883;
const char* mqtt_topic_telemetry = "aquatech/purification/sensors";
const char* mqtt_topic_status = "aquatech/purification/status";

WiFiClient espClient;
PubSubClient client(espClient);

#define PIN_PH_ADC 35
#define PIN_TURBIDITY_ADC 32
#define PIN_TEMP_BUS 4
#define PIN_FLOW_PULSE 18

OneWire oneWire(PIN_TEMP_BUS);
DallasTemperature tempSensors(&oneWire);

volatile unsigned long pulseCount = 0;
unsigned long lastSendTime = 0;

void IRAM_ATTR pulseCounterISR() {
  pulseCount++;
}

void setup_wifi() {
  delay(10);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected to Purification Hub.");
}

void reconnect_mqtt() {
  while (!client.connected()) {
    if (client.connect("ESP32-Purification-Unit", mqtt_topic_status, 1, true, "offline")) {
      client.publish(mqtt_topic_status, "online", true);
    } else {
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_FLOW_PULSE, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(PIN_FLOW_PULSE), pulseCounterISR, FALLING);
  
  tempSensors.begin();
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
}

void loop() {
  if (!client.connected()) {
    reconnect_mqtt();
  }
  client.loop();

  unsigned long now = millis();
  if (now - lastSendTime > 2500) {
    // 1. Analog pH Calculation (Nernst Linearization around 2.5V = pH 7.0)
    int adcPh = analogRead(PIN_PH_ADC);
    float voltagePh = (adcPh / 4095.0) * 3.3;
    float phValue = 7.0 + ((2.5 - voltagePh) / 0.18); // Sensitivity slope approx 0.18V/pH
    phValue = constrain(phValue, 0.0, 14.0);

    // 2. Optical Turbidity Calculation (Inverse voltage response)
    int adcTurb = analogRead(PIN_TURBIDITY_ADC);
    float voltageTurb = (adcTurb / 4095.0) * 3.3;
    // Typical industrial calibration curve: -1120.4*V^2 + 5742.3*V - 4352.9
    float ntu = -1120.4 * square(voltageTurb) + 5742.3 * voltageTurb - 4352.9;
    if (ntu < 0) ntu = 0.5;

    // 3. Water Temp
    tempSensors.requestTemperatures();
    float waterTempC = tempSensors.getTempCByIndex(0);

    // 4. Flow Calculation
    noInterrupts();
    unsigned long currentPulses = pulseCount;
    pulseCount = 0;
    interrupts();
    float flowLPerMin = (currentPulses / 2.5) / 7.5;

    // 5. JSON Publish
    StaticJsonDocument<256> doc;
    doc["device_id"] = "ESP32-PUR-02";
    doc["ph"] = round(phValue * 100) / 100.0;
    doc["turbidity_ntu"] = round(ntu * 100) / 100.0;
    doc["water_temp_c"] = round(waterTempC * 10) / 10.0;
    doc["flow_lpm"] = round(flowLPerMin * 10) / 10.0;
    doc["current_stage"] = "filtration";

    char buffer[256];
    serializeJson(doc, buffer);
    client.publish(mqtt_topic_telemetry, buffer);

    lastSendTime = now;
  }
}
