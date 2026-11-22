#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

// Set these values for the local Wi-Fi network and the computer running FastAPI.
const char* WIFI_SSID = "KUSTIONO";
const char* WIFI_PASSWORD = "12051977";
const char* API_URL = "http://192.168.1.100:8000/api/v1/telemetry";
const char* DEVICE_ID = "GAS-001";

constexpr uint8_t MQ2_PIN = 15;
constexpr uint8_t BUZZER_PIN = 2;
constexpr uint8_t RED_LED_PIN = 4;
constexpr uint8_t OLED_SDA_PIN = 23;
constexpr uint8_t OLED_SCL_PIN = 22;

// MQ-2 digital output has been verified: LOW means gas detected.
#define GAS_DETECTED_STATE LOW

// Assumption: the buzzer module is active-HIGH. Change only if the existing
// buzzer hardware requires the opposite output level.
constexpr uint8_t BUZZER_ON_LEVEL = HIGH;
constexpr uint8_t BUZZER_OFF_LEVEL = LOW;

// Assumption based on a common 128x64 I2C OLED module.
constexpr uint8_t OLED_ADDRESS = 0x3C;
constexpr int SCREEN_WIDTH = 128;
constexpr int SCREEN_HEIGHT = 64;
constexpr int8_t OLED_RESET = -1;

constexpr unsigned long TELEMETRY_INTERVAL_MS = 2000;
constexpr unsigned long WIFI_RETRY_INTERVAL_MS = 10000;
constexpr uint16_t HTTP_TIMEOUT_MS = 750;

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);
bool oledReady = false;
bool hasPreviousGasState = false;
bool previousGasDetected = false;
bool wifiAttemptStarted = false;
volatile bool telemetryTaskRunning = false;
unsigned long lastTelemetryAt = 0;
unsigned long lastWifiAttemptAt = 0;

void updateLocalOutputs(bool gasDetected) {
  digitalWrite(RED_LED_PIN, gasDetected ? HIGH : LOW);
  digitalWrite(BUZZER_PIN, gasDetected ? BUZZER_ON_LEVEL : BUZZER_OFF_LEVEL);

  if (oledReady) {
    display.clearDisplay();
    display.setTextSize(2);
    display.setTextColor(SSD1306_WHITE);
    display.setCursor(0, 8);
    display.println("GAS MONITOR");
    display.setTextSize(3);
    display.setCursor(0, 36);
    display.println(gasDetected ? "BAHAYA" : "AMAN");
    display.display();
  }
}

void startWifiAttempt(unsigned long now) {
  Serial.println("Starting WiFi connection attempt");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  lastWifiAttemptAt = now;
  wifiAttemptStarted = true;
}

void maintainWifi(unsigned long now) {
  if (WiFi.status() == WL_CONNECTED) {
    if (wifiAttemptStarted) {
      Serial.print("WiFi connected, IP: ");
      Serial.println(WiFi.localIP());
      wifiAttemptStarted = false;
    }
    return;
  }

  if (!wifiAttemptStarted || now - lastWifiAttemptAt >= WIFI_RETRY_INTERVAL_MS) {
    startWifiAttempt(now);
  }
}

void postTelemetry(int gasStatus) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("Telemetry skipped: WiFi disconnected");
    return;
  }

  // AOUT/ADC is intentionally unused. `value` mirrors the digital state.
  const int sensorValue = gasStatus;
  char payload[128];
  snprintf(
      payload,
      sizeof(payload),
      "{\"device_id\":\"%s\",\"sensor\":\"MQ-2\",\"value\":%d,\"gas_status\":%d}",
      DEVICE_ID,
      sensorValue,
      gasStatus);

  Serial.println("POST telemetry");
  Serial.print("gas_status = ");
  Serial.println(gasStatus);

  HTTPClient http;
  http.setConnectTimeout(HTTP_TIMEOUT_MS);
  http.setTimeout(HTTP_TIMEOUT_MS);

  if (!http.begin(API_URL)) {
    Serial.println("HTTP POST FAILED: could not initialize HTTP client");
    return;
  }

  http.addHeader("Content-Type", "application/json");
  const int httpStatus = http.POST(reinterpret_cast<uint8_t*>(payload), strlen(payload));
  if (httpStatus > 0) {
    Serial.printf("HTTP %d\n", httpStatus);
    if (httpStatus < 200 || httpStatus >= 300) {
      Serial.println("HTTP POST FAILED: backend returned a non-success status");
    }
  } else {
    Serial.println("HTTP POST FAILED");
    Serial.println(http.errorToString(httpStatus));
  }

  http.end();
}

void telemetryTask(void* parameter) {
  const int gasStatus = static_cast<int>(reinterpret_cast<uintptr_t>(parameter));
  postTelemetry(gasStatus);
  telemetryTaskRunning = false;
  vTaskDelete(nullptr);
}

void scheduleTelemetry(int gasStatus) {
  if (telemetryTaskRunning) {
    Serial.println("Previous HTTP request still running; telemetry skipped");
    return;
  }

  telemetryTaskRunning = true;
  const BaseType_t result = xTaskCreate(
      telemetryTask,
      "gasTelemetry",
      8192,
      reinterpret_cast<void*>(static_cast<uintptr_t>(gasStatus)),
      1,
      nullptr);
  if (result != pdPASS) {
    telemetryTaskRunning = false;
    Serial.println("HTTP POST FAILED: could not start telemetry task");
  }
}

void setup() {
  Serial.begin(115200);

  pinMode(MQ2_PIN, INPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(RED_LED_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, BUZZER_OFF_LEVEL);
  digitalWrite(RED_LED_PIN, LOW);

  Wire.begin(OLED_SDA_PIN, OLED_SCL_PIN);
  oledReady = display.begin(SSD1306_SWITCHCAPVCC, OLED_ADDRESS);
  if (!oledReady) {
    Serial.println("OLED not found; local sensor and alarm will continue");
  }

  WiFi.mode(WIFI_STA);
  WiFi.setAutoReconnect(true);
  startWifiAttempt(millis());
}

void loop() {
  const unsigned long now = millis();
  const int d0State = digitalRead(MQ2_PIN);
  const bool gasDetected = (d0State == GAS_DETECTED_STATE);

  if (!hasPreviousGasState || gasDetected != previousGasDetected) {
    Serial.print("MQ2 D0 = ");
    Serial.print(d0State);
    Serial.println(gasDetected ? " -> GAS TERDETEKSI" : " -> AMAN");

    updateLocalOutputs(gasDetected);
    previousGasDetected = gasDetected;
    hasPreviousGasState = true;
  }

  maintainWifi(now);

  if (now - lastTelemetryAt >= TELEMETRY_INTERVAL_MS) {
    lastTelemetryAt = now;
    scheduleTelemetry(gasDetected ? 1 : 0);
  }
}
