/*
 * AquaTech · ESP32 Controller A: CoolDrop
 * Subsystem: AC Condensate Water Collection
 * 
 * Hardware Connections:
 * - Hydrostatic Level Sensor: Analog Pin GPIO 34 (0-3.3V ADC)
 * - Micro-Turbine Flow Pulse Counter: Digital Interrupt GPIO 25
 * - DS18B20 Waterproof Temp: OneWire GPIO 4
 * - Leak Detection Grid: Digital Pin GPIO 26
 * 
 * Protocol: MQTT over Wi-Fi (JSON Payload to "aquatech/cooldrop/sensors")
 */

#include <WiFi.h>
#include <PubSubClient.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <ArduinoJson.h>

// Wi-Fi & MQTT Configuration
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* mqtt_server = "broker.hivemq.com"; // Or your local broker IP
const int mqtt_port = 1883;
const char* mqtt_topic_telemetry = "aquatech/cooldrop/sensors";
const char* mqtt_topic_status = "aquatech/cooldrop/status";

WiFiClient espClient;
PubSubClient client(espClient);

// Sensor Pins
#define PIN_LEVEL_ADC 34
#define PIN_FLOW_PULSE 25
#define PIN_TEMP_BUS 4
#define PIN_LEAK_SENSOR 26

OneWire oneWire(PIN_TEMP_BUS);
DallasTemperature tempSensors(&oneWire);

// Pulse counting variables
volatile unsigned long pulseCount = 0;
unsigned long lastSendTime = 0;
const float FLOW_CALIBRATION_FACTOR = 7.5; // pulses per second per L/min

void IRAM_ATTR pulseCounterISR() {
  pulseCount++;
}

void setup_wifi() {
  delay(10);
  Serial.print("Connecting to Wi-Fi: ");
  Serial.println(ssid);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected. IP address: ");
  Serial.println(WiFi.localIP());
}

void reconnect_mqtt() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection to ");
    Serial.println(mqtt_server);
    if (client.connect("ESP32-CoolDrop-Hub", mqtt_topic_status, 1, true, "offline")) {
      Serial.println("MQTT connected!");
      client.publish(mqtt_topic_status, "online", true);
    } else {
      Serial.print("Failed, rc=");
      Serial.print(client.state());
      Serial.println(" Retrying in 5 seconds...");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(PIN_FLOW_PULSE, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(PIN_FLOW_PULSE), pulseCounterISR, FALLING);
  pinMode(PIN_LEAK_SENSOR, INPUT);
  
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
  if (now - lastSendTime > 2500) { // Every 2.5 seconds
    // 1. Read Flow Rate
    noInterrupts();
    unsigned long currentPulses = pulseCount;
    pulseCount = 0;
    interrupts();

    float flowRateLPerMin = (currentPulses / ((now - lastSendTime) / 1000.0)) / FLOW_CALIBRATION_FACTOR;
    float flowRateLPerHr = flowRateLPerMin * 60.0;

    // 2. Read Hydrostatic Tank Level (0-4095 ADC)
    int adcLevel = analogRead(PIN_LEVEL_ADC);
    float tankFillPercentage = (adcLevel / 4095.0) * 100.0;
    float currentVolumeLiters = (tankFillPercentage / 100.0) * 250.0; // 250L tank

    // 3. Read Temperature
    tempSensors.requestTemperatures();
    float waterTempC = tempSensors.getTempCByIndex(0);

    // 4. Leak sensor check
    bool leakDetected = digitalRead(PIN_LEAK_SENSOR) == LOW;

    // 5. Serialize JSON Payload
    StaticJsonDocument<256> doc;
    doc["device_id"] = "ESP32-CD-01";
    doc["tank_level"] = round(tankFillPercentage * 10) / 10.0;
    doc["volume_liters"] = round(currentVolumeLiters * 10) / 10.0;
    doc["flow_rate"] = round(flowRateLPerHr * 10) / 10.0;
    doc["temperature"] = round(waterTempC * 10) / 10.0;
    doc["leak"] = leakDetected;

    char buffer[256];
    serializeJson(doc, buffer);
    client.publish(mqtt_topic_telemetry, buffer);

    Serial.print("Telemetry Transmitted: ");
    Serial.println(buffer);

    lastSendTime = now;
  }
}
