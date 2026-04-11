#include <esp32cam.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include "esp_camera.h"
#include "time.h"

// WiFi Credentials
const char* WIFI_SSID = "Abhi";
const char* WIFI_PASS = "abhi1100";

// Plate Recognizer Token (You wrote it in Gemini place)
const char* PLATE_API_KEY = "1f79c6b96b7c6b9907a0396288f7ce0970e2b1fa";

// Firebase URL
const char* FIREBASE_URL = "";

// NTP Server for Date and Time
const char* ntpServer = "pool.ntp.org";
const long gmtOffset_sec = 0;
const int daylightOffset_sec = 0;

WiFiClientSecure client;

// Base64 Encoding Function
const char base64_table[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
String base64_encode(const uint8_t* data, size_t length) {
    String encoded = "";
    int i = 0;
    uint8_t array_3[3], array_4[4];

    while (length--) {
        array_3[i++] = *(data++);
        if (i == 3) {
            array_4[0] = (array_3[0] & 0xfc) >> 2;
            array_4[1] = ((array_3[0] & 0x03) << 4) + ((array_3[1] & 0xf0) >> 4);
            array_4[2] = ((array_3[1] & 0x0f) << 2) + ((array_3[2] & 0xc0) >> 6);
            array_4[3] = array_3[2] & 0x3f;

            for (i = 0; i < 4; i++)
                encoded += base64_table[array_4[i]];
            i = 0;
        }
    }
    return encoded;
}

// Get Current Date and Time
String getCurrentTime() {
    struct tm timeinfo;
    if (!getLocalTime(&timeinfo)) {
        return "Time Error";
    }
    char buffer[30];
    strftime(buffer, sizeof(buffer), "%Y-%m-%d %H:%M:%S", &timeinfo);
    return String(buffer);
}

// Function to Send Data to Firebase
void sendDataToFirebase(String numberPlate, String dateTime, String imageBase64) {
    HTTPClient http;
    http.begin(FIREBASE_URL);
    http.addHeader("Content-Type", "application/json");

    String payload = "{";
    payload += "\"number_plate\": \"" + numberPlate + "\",";
    payload += "\"date_time\": \"" + dateTime + "\",";
    payload += "\"image\": \"" + imageBase64 + "\"";
    payload += "}";

    int httpCode = http.POST(payload);
    if (httpCode > 0) {
        Serial.println("[+] Firebase Response: " + http.getString());
    } else {
        Serial.println("[-] Firebase HTTP Request Failed: " + String(httpCode));
    }
    http.end();
}

// Function to Detect Vehicle Number Plate
void detectNumberPlate() {

    Serial.println("\n[+] Capturing Image...");
    auto frame = esp32cam::capture();
    if (frame == nullptr) {
        Serial.println("[-] Capture failed");
        return;
    }

    // Convert Image to Base64
    String base64Image = base64_encode(frame->data(), frame->size());

    // ================================
    // ✅ Plate Recognizer API Request
    // ================================

    client.setInsecure();

    String server = "api.platerecognizer.com";
    String path = "/v1/plate-reader/";

    if (!client.connect(server.c_str(), 443)) {
        Serial.println("[-] Plate Recognizer Connection Failed");
        return;
    }

    String boundary = "----ESP32Boundary";

    String head =
        "--" + boundary + "\r\n"
        "Content-Disposition: form-data; name=\"upload\"; filename=\"plate.jpg\"\r\n"
        "Content-Type: image/jpeg\r\n\r\n";

    String tail =
        "\r\n--" + boundary + "--\r\n";

    int contentLength = head.length() + frame->size() + tail.length();

    // Send HTTP Headers
    client.println("POST " + path + " HTTP/1.1");
    client.println("Host: " + server);
    client.println("Authorization: Token " + String(PLATE_API_KEY));
    client.println("Content-Type: multipart/form-data; boundary=" + boundary);
    client.println("Content-Length: " + String(contentLength));
    client.println();
    client.print(head);

    // Send Image Bytes
    client.write(frame->data(), frame->size());
    client.print(tail);

    Serial.println("[+] Image Sent to Plate Recognizer...");

    // Read Response
    String response = "";
    while (client.connected()) {
        while (client.available()) {
            response += char(client.read());
        }
    }
    client.stop();

    // Extract JSON Body
    int jsonStart = response.indexOf("{");
    if (jsonStart == -1) {
        Serial.println("[-] No JSON Found");
        return;
    }

    String jsonBody = response.substring(jsonStart);

    Serial.println("[+] Plate Recognizer Response:");
    Serial.println(jsonBody);

    DynamicJsonDocument doc(4096);
    DeserializationError error = deserializeJson(doc, jsonBody);

    if (error) {
        Serial.println("[-] JSON Parse Error: " + String(error.c_str()));
        return;
    }

    String plateNumber = doc["results"][0]["plate"].as<String>();
    plateNumber.toUpperCase();

    if (plateNumber.length() < 3) {
        Serial.println("[!] No valid plate detected");
        return;
    }

    // Print Plate
    String dateTime = getCurrentTime();

    Serial.println("\n======= Vehicle Number Plate =======");
    Serial.println("📅 Date & Time: " + dateTime);
    Serial.println("🔢 Number Plate: " + plateNumber);
    Serial.println("====================================");

    // Send to Firebase
    sendDataToFirebase(plateNumber, dateTime, base64Image);
}

// Setup Function
void setup() {

    Serial.begin(115200);
    Serial.println("\n[+] Starting ESP32-CAM...");

    WiFi.begin(WIFI_SSID, WIFI_PASS);
    if (WiFi.waitForConnectResult() != WL_CONNECTED) {
        Serial.println("[-] WiFi Failed!");
        delay(5000);
        ESP.restart();
    }

    Serial.println("[+] WiFi Connected: " + WiFi.localIP().toString());

    // Initialize Camera (UNCHANGED)
    using namespace esp32cam;
    Config cfg;
    cfg.setPins(pins::AiThinker);
    cfg.setResolution(Resolution::find(800, 600));
    cfg.setJpeg(80);

    if (!Camera.begin(cfg)) {
        Serial.println("[-] Camera Failed!");
        delay(5000);
        ESP.restart();
    }

    Serial.println("[+] Camera Started");

    // Initialize NTP Time
    configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);

    // Start Plate Detection Task
    xTaskCreate([](void*) {
        while (1) {
            detectNumberPlate();
            delay(3000);
        }
    }, "PlateTask", 8192, NULL, 1, NULL);
}

void loop() {
}
