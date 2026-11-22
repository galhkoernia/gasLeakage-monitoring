# ESP32 GasMonitor firmware

Open `gas_monitor/gas_monitor.ino` in Arduino IDE and select an ESP32 DevKit
board. Install the **Adafruit GFX Library** and **Adafruit SSD1306** libraries;
`WiFi`, `HTTPClient`, and `Wire` are provided by the ESP32 Arduino core.

Before uploading, edit `WIFI_SSID`, `WIFI_PASSWORD`, and `API_URL` in the sketch.
Set `API_URL` to the backend computer's LAN IPv4 address, for example
`http://192.168.1.100:8000/api/v1/telemetry`; do not use `localhost` or
`127.0.0.1` on the ESP32. Run FastAPI on the computer with:

```bash
# From the backend/ directory
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

The sketch retains the specified wiring: MQ-2 D0 GPIO15, buzzer GPIO2, red LED
GPIO4, and OLED SDA/SCL GPIO23/GPIO22. D0 LOW maps to `gas_status: 1` and D0 HIGH
maps to `gas_status: 0`. Since AOUT is not connected, `value` mirrors that
digital state (0 or 1); it is not ADC or ppm. The sketch assumes an I2C OLED at
`0x3C` and an active-HIGH buzzer; adjust those hardware constants if the
existing modules differ.

Telemetry is posted every 2 seconds when Wi-Fi is connected. Local sensor,
LED, buzzer, and OLED logic continues while Wi-Fi or the backend is unavailable.
