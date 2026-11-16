-- AquaTech PostgreSQL Database Schema (Version 1.0)
-- 12 Stored Tables as Defined in Specification Section 6

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    role VARCHAR(30) DEFAULT 'viewer', -- 'admin', 'operator', 'viewer'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS devices (
    id SERIAL PRIMARY KEY,
    device_id VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'ESP32-CD-01', 'ESP32-PUR-02'
    name VARCHAR(100) NOT NULL,
    subsystem_type VARCHAR(50) NOT NULL, -- 'cooldrop', 'purification'
    ip_address VARCHAR(45),
    mac_address VARCHAR(20),
    mqtt_topic VARCHAR(100) NOT NULL,
    firmware_version VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    last_heartbeat TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS sensors (
    id SERIAL PRIMARY KEY,
    sensor_id VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'SNS-PH-02'
    device_id VARCHAR(50) REFERENCES devices(device_id),
    name VARCHAR(100) NOT NULL,
    measurement_type VARCHAR(50) NOT NULL, -- 'level', 'flow', 'ph', 'turbidity', 'temp', 'conductivity', 'power'
    unit VARCHAR(20) NOT NULL,
    min_safe_threshold NUMERIC(10, 2),
    max_safe_threshold NUMERIC(10, 2),
    error_margin_pct NUMERIC(5, 2),
    last_calibrated_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS sensor_readings (
    id BIGSERIAL PRIMARY KEY,
    sensor_id VARCHAR(50) REFERENCES sensors(sensor_id),
    device_id VARCHAR(50) NOT NULL,
    raw_value NUMERIC(12, 4) NOT NULL,
    calibrated_value NUMERIC(12, 4) NOT NULL,
    is_simulated BOOLEAN DEFAULT FALSE,
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE TABLE IF NOT EXISTS water_batches (
    id SERIAL PRIMARY KEY,
    batch_code VARCHAR(50) UNIQUE NOT NULL,
    stream_type VARCHAR(50) NOT NULL, -- 'CoolDrop_Condensate', 'Treated_Effluent'
    volume_liters NUMERIC(10, 2) NOT NULL,
    initial_turbidity_ntu NUMERIC(6, 2),
    final_turbidity_ntu NUMERIC(6, 2),
    disinfection_status VARCHAR(50),
    cleared_for_reuse BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS treatment_stages (
    id SERIAL PRIMARY KEY,
    stage_key VARCHAR(50) UNIQUE NOT NULL, -- 'screening', 'sedimentation', 'filtration', 'adsorption', 'disinfection', 'verification'
    order_num INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    media_type VARCHAR(100),
    nominal_retention_minutes INT,
    differential_pressure_kpa NUMERIC(6, 2),
    status VARCHAR(30) DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS water_quality_tests (
    id SERIAL PRIMARY KEY,
    batch_id INT REFERENCES water_batches(id),
    ph_reading NUMERIC(4, 2),
    turbidity_ntu NUMERIC(6, 2),
    conductivity_us NUMERIC(8, 2),
    coliform_detected BOOLEAN DEFAULT FALSE,
    tester_id INT REFERENCES users(id),
    compliance_standard VARCHAR(100),
    tested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS alerts (
    id SERIAL PRIMARY KEY,
    alert_code VARCHAR(50) NOT NULL,
    subsystem VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL, -- 'low', 'medium', 'high', 'critical'
    description TEXT NOT NULL,
    is_acknowledged BOOLEAN DEFAULT FALSE,
    triggered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS maintenance (
    id SERIAL PRIMARY KEY,
    subsystem VARCHAR(50) NOT NULL,
    component_name VARCHAR(100) NOT NULL,
    action_performed TEXT NOT NULL,
    technician_name VARCHAR(100),
    status VARCHAR(30) NOT NULL, -- 'completed', 'scheduled', 'overdue'
    scheduled_for DATE,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS experiments (
    id SERIAL PRIMARY KEY,
    scenario_name VARCHAR(100) NOT NULL,
    ac_condensate_rate NUMERIC(6, 2),
    wastewater_inflow NUMERIC(6, 2),
    filter_configuration VARCHAR(100),
    simulated_recovery_pct NUMERIC(5, 2),
    simulated_energy_kwh NUMERIC(6, 2),
    simulated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS daily_statistics (
    id SERIAL PRIMARY KEY,
    stat_date DATE UNIQUE NOT NULL,
    cooldrop_total_liters NUMERIC(10, 2),
    purified_total_liters NUMERIC(10, 2),
    combined_recovered_liters NUMERIC(10, 2),
    total_reused_liters NUMERIC(10, 2),
    energy_consumed_kwh NUMERIC(8, 2),
    recovery_percentage NUMERIC(5, 2)
);

CREATE TABLE IF NOT EXISTS system_events (
    id BIGSERIAL PRIMARY KEY,
    level VARCHAR(20) NOT NULL, -- 'info', 'warning', 'alert', 'success'
    module VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
