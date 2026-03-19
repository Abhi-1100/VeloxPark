# Hardware Integration Guide

Complete guide for integrating ESP32 microcontroller with ANPR (Automatic Number Plate Recognition) camera for VeloxPark.

---

## Table of Contents
1. [Hardware Requirements](#hardware-requirements)
2. [System Overview](#system-overview)
3. [Wiring Diagram](#wiring-diagram)
4. [ESP32 Setup](#esp32-setup)
5. [ANPR Camera Setup](#anpr-camera-setup)
6. [Firebase Integration](#firebase-integration)
7. [Testing & Calibration](#testing--calibration)
8. [Troubleshooting](#troubleshooting)

---

## Hardware Requirements

### Required Components
| Component | Specification | Quantity | Purpose |
|-----------|--------------|----------|---------|
| **ESP32 DevKit** | ESP32-WROOM-32 | 1 | Main microcontroller |
| **ANPR Camera** | OpenALPR compatible | 1 | License plate recognition |
| **Power Supply** | 5V 2A USB adapter | 1 | Power for ESP32 |
| **MicroUSB Cable** | Data + Power | 1 | Programming & power |
| **Jumper Wires** | Male-to-Male / Male-to-Female | 10 | Connections |
| **Breadboard** | 830 points (optional) | 1 | Prototyping |
| **Status LED** | 5mm, any color | 1 | Visual feedback |
| **Resistor** | 220Ω | 1 | LED current limiting |

### Optional Components
- **PIR Motion Sensor** - Trigger camera only when vehicle approaches
- **Ultrasonic Sensor (HC-SR04)** - Detect vehicle presence
- **SD Card Module** - Local logging for offline operation
- **Buzzer** - Audio feedback

### Recommended Camera Models
1. **Raspberry Pi Camera V2** + **OpenALPR** software (Budget-friendly)
2. **Hikvision DS-2CD4A26FWD-IZS** (Professional ANPR camera)
3. **Dahua ITC237-PU1B-IR** (Parking-specific ANPR)
4. **Custom Mobile ANPR** (Android app via HTTP)

---

## System Overview

### Architecture

```
┌──────────────────┐
│  ANPR Camera     │  Captures vehicle image
│  (IP Camera or   │  Performs OCR on plate
│   Raspberry Pi)  │  Sends plate number
└────────┬─────────┘
         │ HTTP/Serial/UART
         │
┌────────▼─────────┐
│    ESP32         │  Receives plate data
│  (WiFi Module)   │  Formats data
│                  │  Sends to Firebase
└────────┬─────────┘
         │ WiFi/HTTPS
         │
┌────────▼─────────┐
│   Firebase       │  Realtime Database
│   Realtime DB    │  numberplate/ node
└──────────────────┘
         │
┌────────▼─────────┐
│   VeloxPark      │  React App
│   Web App        │  Shows real-time data
└──────────────────┘
```

### Data Flow
1. **Vehicle Enters** → PIR sensor detects (optional)
2. **Camera Triggers** → Captures image
3. **ANPR Processing** → Extracts license plate text
4. **ESP32 Receives** → Gets plate data via serial/HTTP
5. **WiFi Transmission** → ESP32 sends to Firebase
6. **Database Update** → New entry in `numberplate` node
7. **Web App Refresh** → User sees vehicle in dashboard

---

## Wiring Diagram

### Basic ESP32 + LED Setup

```
ESP32 Pin Layout:
┌─────────────────┐
│  ESP32-WROOM-32 │
├─────────────────┤
│ 3V3      ●    ● │ GND
│ EN       ●    ● │ GPIO23
│ SVP(36)  ●    ● │ GPIO22
│ SVN(39)  ●    ● │ TXD0(1)
│ GPIO34   ●    ● │ RXD0(3)
│ GPIO35   ●    ● │ GPIO21
│ GPIO32   ●    ● │ GND
│ GPIO33   ●    ● │ GPIO19
│ GPIO25   ●    ● │ GPIO18
│ GPIO26   ●    ● │ GPIO5
│ GPIO27   ●    ● │ GPIO17
│ GPIO14   ●    ● │ GPIO16
│ GPIO12   ●    ● │ GPIO4
│ GND      ●    ● │ GPIO0
│ GPIO13   ●    ● │ GPIO2
│ GPIO9    ●    ● │ GPIO15
│ GPIO10   ●    ● │ GND
│ GPIO11   ●    ● │ 5V
└─────────────────┘
```

### Connection Table

| ESP32 Pin | Connects To | Purpose |
|-----------|-------------|---------|
| **GPIO2** (Built-in LED) | - | Status indicator |
| **GPIO16 (RX)** | Camera TX | Serial data from camera |
| **GPIO17 (TX)** | Camera RX | Serial data to camera |
| **GND** | Camera/LED GND | Common ground |
| **5V** | External LED (+) via 220Ω | Status LED |
| **3V3** | Camera VCC (if 3.3V) | Camera power |

### LED Status Indicator Wiring

```
ESP32 GPIO2 ──┬── 220Ω Resistor ──┬── LED Anode (+)
              │                    │
              │                    └── LED Cathode (-) ──── GND
```

---

## ESP32 Setup

### 1. Install Arduino IDE

```bash
# Download from: https://www.arduino.cc/en/software
# Version: 2.0 or higher
```

### 2. Install ESP32 Board Support

1. Open Arduino IDE
2. Go to **File → Preferences**
3. Add to **Additional Board Manager URLs**:
   ```
   https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
   ```
4. Go to **Tools → Board → Board Manager**
5. Search "ESP32" and install "**esp32 by Espressif Systems**"

### 3. Install Required Libraries

**Via Library Manager (Tools → Manage Libraries):**
- **WiFi** (Built-in)
- **HTTPClient** (Built-in)
- **ArduinoJson** by Benoit Blanchon (v6.x)
- **Firebase Arduino Client Library for ESP32** by Mobizt

### 4. ESP32 Firmware Code

Create a new sketch in Arduino IDE and paste this code:

```cpp
#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include <ArduinoJson.h>

// ========== Configuration ==========
// WiFi credentials
const char* WIFI_SSID = "YourWiFiSSID";
const char* WIFI_PASSWORD = "YourWiFiPassword";

// Firebase configuration
const char* FIREBASE_HOST = "parking-system-939dd-default-rtdb.firebaseio.com";
const char* FIREBASE_AUTH = ""; // Leave empty for no auth (or use database secret)

// Built-in LED for status
#define LED_PIN 2

// Firebase objects
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// ========== Functions ==========

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);

  // Connect to WiFi
  Serial.println("Connecting to WiFi...");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
    digitalWrite(LED_PIN, !digitalRead(LED_PIN)); // Blink while connecting
  }

  digitalWrite(LED_PIN, HIGH); // Solid ON when connected
  Serial.println("\\nWiFi Connected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  // Configure Firebase
  config.host = FIREBASE_HOST;
  config.signer.tokens.legacy_token = FIREBASE_AUTH;

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  Serial.println("Firebase initialized. Waiting for license plates...");
}

void loop() {
  // Check if data available on Serial (from ANPR camera)
  if (Serial.available() > 0) {
    String licensePlate = Serial.readStringUntil('\\n');
    licensePlate.trim();
    licensePlate.toUpperCase();

    // Validate plate (basic check)
    if (licensePlate.length() >= 4 && licensePlate.length() <= 12) {
      Serial.print("Received plate: ");
      Serial.println(licensePlate);

      // Send to Firebase
      sendToFirebase(licensePlate);
    } else {
      Serial.println("Invalid plate format, ignoring.");
    }
  }

  delay(100); // Small delay to prevent overwhelming
}

void sendToFirebase(String plate) {
  // Blink LED to indicate activity
  digitalWrite(LED_PIN, LOW);
  delay(50);
  digitalWrite(LED_PIN, HIGH);

  // Create timestamp (DD/MM/YY HH:MM format)
  String timestamp = getCurrentTimestamp();

  // Create JSON payload
  FirebaseJson json;
  json.set("number_plate", plate);
  json.set("date_time", timestamp);

  // Push to Firebase
  String path = "/numberplate";

  if (Firebase.RTDB.pushJSON(&fbdo, path.c_str(), &json)) {
    Serial.println("✓ Sent to Firebase successfully!");
    Serial.print("  Path: ");
    Serial.println(fbdo.dataPath());
  } else {
    Serial.println("✗ Firebase send failed:");
    Serial.println(fbdo.errorReason());
  }
}

String getCurrentTimestamp() {
  // Simple timestamp (DD/MM/YY HH:MM)
  // For production, use NTP time sync for accuracy

  // This is a placeholder - implement NTP time sync for real deployment
  // Example: "29/1/26 14:00"

  unsigned long currentMillis = millis();
  unsigned long seconds = currentMillis / 1000;
  unsigned long minutes = seconds / 60;
  unsigned long hours = minutes / 60;

  int h = (hours % 24);
  int m = (minutes % 60);

  // Placeholder date (should use NTP)
  String timestamp = "19/3/26 " + String(h) + ":" + (m < 10 ? "0" : "") + String(m);

  return timestamp;
}
```

### 5. Upload Code to ESP32

1. Connect ESP32 to computer via USB
2. Select **Tools → Board → ESP32 Dev Module**
3. Select **Tools → Port** (e.g., COM3 or /dev/ttyUSB0)
4. Update WiFi credentials in code
5. Click **Upload** button
6. Open **Serial Monitor** (115200 baud) to see logs

---

## ANPR Camera Setup

### Option 1: Raspberry Pi + OpenALPR (Recommended for DIY)

#### Hardware
- Raspberry Pi 4 (2GB+ RAM)
- Raspberry Pi Camera Module V2
- MicroSD Card (16GB+)
- 5V 3A Power Supply

#### Installation Steps

```bash
# 1. Install Raspberry Pi OS
# Download and flash Raspberry Pi OS Lite to SD card

# 2. Enable Camera
sudo raspi-config
# Navigate to: Interface Options → Camera → Enable

# 3. Install OpenALPR
sudo apt-get update
sudo apt-get install -y openalpr openalpr-daemon openalpr-utils

# 4. Install Python dependencies
sudo apt-get install -y python3-pip
pip3 install opencv-python pyserial

# 5. Create ANPR script
nano anpr_to_esp32.py
```

**anpr_to_esp32.py:**
```python
import cv2
import subprocess
import serial
import time

# ESP32 Serial connection
esp32 = serial.Serial('/dev/ttyUSB0', 115200, timeout=1)

# Camera setup
cap = cv2.VideoCapture(0)

print("ANPR System Started. Press Ctrl+C to exit.")

while True:
    ret, frame = cap.read()
    if not ret:
        continue

    # Save frame temporarily
    cv2.imwrite('/tmp/frame.jpg', frame)

    # Run OpenALPR
    result = subprocess.run(
        ['alpr', '-c', 'in', '/tmp/frame.jpg'],  # 'in' for India
        capture_output=True,
        text=True
    )

    # Parse result
    for line in result.stdout.split('\\n'):
        if 'plate' in line.lower():
            plate = line.split(':')[-1].strip()
            if len(plate) >= 4:
                print(f"Detected: {plate}")
                esp32.write(f"{plate}\\n".encode())
                time.sleep(2)  # Debounce (avoid duplicates)

    time.sleep(0.5)  # Check every 0.5 seconds

cap.release()
```

**Run the script:**
```bash
python3 anpr_to_esp32.py
```

### Option 2: IP Camera with Built-in ANPR

For professional cameras with built-in ANPR:

```cpp
// ESP32 code to receive HTTP POST from IP camera
#include <WebServer.h>

WebServer server(80);

void setup() {
  // ... WiFi setup ...

  server.on("/plate", HTTP_POST, []() {
    if (server.hasArg("plate")) {
      String plate = server.arg("plate");
      sendToFirebase(plate);
      server.send(200, "text/plain", "OK");
    } else {
      server.send(400, "text/plain", "Missing plate parameter");
    }
  });

  server.begin();
  Serial.println("HTTP server started on port 80");
}

void loop() {
  server.handleClient();
}
```

**Camera Configuration:**
- Set camera to send HTTP POST to: `http://<ESP32_IP>/plate?plate=XXXXX`

---

## Firebase Integration

### Firebase Database Rules

Ensure your Firebase Realtime Database rules allow writes from ESP32:

```json
{
  "rules": {
    "numberplate": {
      ".read": true,
      ".write": true,
      ".indexOn": ["number_plate", "date_time"]
    }
  }
}
```

**⚠️ Security Note:** For production, use Firebase authentication and restrict write access.

### Test Firebase Connection

Use Firebase Console to verify data is being written:
1. Go to: https://console.firebase.google.com
2. Select your project: `parking-system-939dd`
3. Navigate to **Realtime Database**
4. Check `/numberplate` node for new entries

---

## Testing & Calibration

### 1. LED Status Indicators

| LED Behavior | Meaning |
|--------------|---------|
| **Fast Blinking** | Connecting to WiFi |
| **Solid ON** | Connected to WiFi + Firebase ready |
| **Brief OFF then ON** | Sending data to Firebase |
| **Solid OFF** | Power issue or not running |

### 2. Serial Monitor Testing

Send test data manually via Serial Monitor:
```
TS15EL5671
MH12AB1234
```

Expected output:
```
Received plate: TS15EL5671
✓ Sent to Firebase successfully!
  Path: /numberplate/-N8xK4LmP3qR5tU9wX2z
```

### 3. ANPR Accuracy Calibration

**Camera Positioning:**
- **Height**: 2-3 meters above ground
- **Angle**: 15-30° downward tilt
- **Distance**: 3-5 meters from vehicle
- **Lighting**: Ensure good illumination (IR LEDs for night)

**OpenALPR Configuration:**
```bash
# Edit /etc/openalpr/openalpr.conf
sudo nano /etc/openalpr/openalpr.conf
```

Key settings:
```ini
country = in                  # India
min_plate_width_percent = 5   # Minimum plate size
max_plate_width_percent = 90  # Maximum plate size
detection_iteration_increase = 1.05
```

### 4. End-to-End Test

1. **Power on** ESP32 + ANPR system
2. **Check Serial Monitor** for "WiFi Connected" and "Firebase initialized"
3. **Position a vehicle** with visible license plate in camera view
4. **Verify** plate appears in Serial Monitor
5. **Check Firebase Console** for new entry in `numberplate` node
6. **Open VeloxPark Web App** and search for the plate
7. **Confirm** vehicle details appear correctly

---

## Troubleshooting

### Issue: ESP32 not connecting to WiFi

**Solutions:**
- Verify WiFi credentials are correct
- Check WiFi band (ESP32 supports 2.4GHz only, not 5GHz)
- Move ESP32 closer to router
- Check router firewall settings

### Issue: Firebase write fails

**Symptoms:**
```
✗ Firebase send failed:
Permission denied
```

**Solutions:**
- Check Firebase database rules (must allow writing to `/numberplate`)
- Verify `FIREBASE_HOST` is correct in code
- Ensure ESP32 has internet access
- Check Firebase project is active (not on free plan quota limit)

### Issue: ANPR not detecting plates

**Solutions:**
- Improve camera angle and distance
- Add better lighting (especially for night)
- Clean camera lens
- Adjust OpenALPR configuration for your region
- Test with high-contrast license plates first

### Issue: Duplicate entries in database

**Solutions:**
- Add debounce delay after each successful detection (2-3 seconds)
- Implement motion sensor to trigger camera only when vehicle approaches
- Track last detected plate and ignore if same within 10 seconds

### Issue: Serial communication errors

**Symptoms:**
```
Serial.available() returns 0
```

**Solutions:**
- Check wiring: Camera TX → ESP32 RX (GPIO16)
- Verify baud rate matches on both devices (115200)
- Check ground connection between ESP32 and camera
- Test with USB-to-Serial adapter first

### Issue: Power problems

**Symptoms:** ESP32 reboots randomly, WiFi drops

**Solutions:**
- Use quality 5V 2A power supply
- Avoid powering from computer USB (insufficient current)
- Add 100µF capacitor between 5V and GND for stability
- Check all connections are secure

---

## Advanced Features

### 1. Add Motion Sensor Trigger

```cpp
#define PIR_PIN 13

void setup() {
  pinMode(PIR_PIN, INPUT);
  // ... rest of setup
}

void loop() {
  if (digitalRead(PIR_PIN) == HIGH) {
    // Motion detected - trigger camera
    Serial.println("TRIGGER"); // Send to camera
    delay(5000); // Wait for camera to process
  }
}
```

### 2. Local Data Logging (SD Card)

```cpp
#include <SD.h>
#include <SPI.h>

#define SD_CS 5

void setup() {
  if (!SD.begin(SD_CS)) {
    Serial.println("SD Card initialization failed!");
  }
  // ... rest of setup
}

void sendToFirebase(String plate) {
  // ... existing Firebase code ...

  // Also log locally
  File logFile = SD.open("/log.txt", FILE_APPEND);
  if (logFile) {
    logFile.println(plate + "," + getCurrentTimestamp());
    logFile.close();
  }
}
```

### 3. NTP Time Synchronization

```cpp
#include <time.h>

void setup() {
  // ... WiFi connection ...

  // Configure NTP
  configTime(19800, 0, "pool.ntp.org");  // IST (UTC+5:30 = 19800 seconds)

  Serial.println("Waiting for NTP time sync...");
  time_t now = time(nullptr);
  while (now < 8 * 3600 * 2) {
    delay(500);
    now = time(nullptr);
  }
  Serial.println("Time synchronized!");
}

String getCurrentTimestamp() {
  time_t now;
  struct tm timeinfo;
  time(&now);
  localtime_r(&now, &timeinfo);

  char buffer[20];
  strftime(buffer, sizeof(buffer), "%d/%m/%y %H:%M", &timeinfo);

  return String(buffer);
}
```

---

## Maintenance

### Regular Tasks
- **Clean camera lens** weekly
- **Check WiFi signal strength** monthly
- **Update ESP32 firmware** quarterly
- **Review Firebase usage** monthly (avoid quota limits)
- **Test ANPR accuracy** monthly with sample plates
- **Backup local logs** (if using SD card) weekly

### Monitoring
- Check ESP32 Serial Monitor logs daily
- Monitor Firebase Console for unusual activity
- Track detection accuracy rate
- Review false positive/negative rates

---

## Bill of Materials (BOM)

| Item | Quantity | Estimated Cost (USD) |
|------|----------|----------------------|
| ESP32 Dev Board | 1 | $10 |
| Raspberry Pi 4 (2GB) | 1 | $45 |
| Pi Camera V2 | 1 | $25 |
| MicroSD Card 16GB | 1 | $8 |
| Power Supplies (5V 2A, 5V 3A) | 2 | $15 |
| Jumper Wires | 1 pack | $5 |
| LED + Resistor | 1 set | $2 |
| Enclosure/Case | 2 | $20 |
| **Total** | | **~$130** |

*Professional ANPR cameras cost $300-$2000+ depending on features.*

---

## Resources

- **ESP32 Documentation**: https://docs.espressif.com/projects/esp-idf/
- **Arduino ESP32 GitHub**: https://github.com/espressif/arduino-esp32
- **OpenALPR**: https://github.com/openalpr/openalpr
- **Firebase ESP32 Client**: https://github.com/mobizt/Firebase-ESP-Client
- **VeloxPark GitHub**: [Your repository URL]

---

**Hardware Integration Complete!** 🎉

Next steps:
- Deploy the system at parking entry/exit points
- Monitor performance and accuracy
- Fine-tune ANPR settings for your environment
- Refer to [Troubleshooting Guide](./troubleshooting.md) for issues
