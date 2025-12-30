#include <LiquidCrystal.h>

#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <ArduinoJson.h>
#include <SPI.h>
#include <MFRC522.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

// RFID Setup
#define RST_PIN D3
#define SS_PIN D8
MFRC522 rfid(SS_PIN, RST_PIN);

// LCD Setup
int lcdColumns = 16;
int lcdRows = 2;
LiquidCrystal_I2C lcd(0x27, lcdColumns, lcdRows);

// WiFi Setup
const char* ssid = "Pasarean";
const char* password = "31oktober";
const String url = "http://192.168.0.175";
const String serverRfidScanUrl = url + ":5000/api/rfid-scan";

#define BUZZER_PIN D0

String messageStatic = "Scan RFID Card";
String messageToScroll = "Welcome user! Data sent.";

void scrollText(int row, String message, int delayTime, int lcdColumns) {
  message = "                " + message + "                "; 
  for (int pos = 0; pos < message.length() - lcdColumns + 1; pos++) {
    lcd.setCursor(0, row);
    lcd.print(message.substring(pos, pos + lcdColumns));
    delay(delayTime);
  }
}

// Bunyi sekali pendek → sukses/registered
void buzzerSuccess() {
  tone(BUZZER_PIN, 1000); 
  delay(200);
  noTone(BUZZER_PIN);
}

// Bunyi dua kali pendek → check-in
void buzzerCheckIn() {
  for (int i = 0; i < 2; i++) {
    tone(BUZZER_PIN, 1200);
    delay(150);
    noTone(BUZZER_PIN);
    delay(150);
  }
}

// Bunyi panjang → check-out
void buzzerCheckOut() {
  tone(BUZZER_PIN, 800);
  delay(500);
  noTone(BUZZER_PIN);
}

// Bunyi tiga kali cepat → error/gagal
void buzzerError() {
  for (int i = 0; i < 3; i++) {
    tone(BUZZER_PIN, 600);
    delay(100);
    noTone(BUZZER_PIN);
    delay(100);
  }
}


void setup() {
  Serial.begin(115200);
  SPI.begin();
  rfid.PCD_Init();
  Serial.println("Initializing RFID...");

  pinMode(BUZZER_PIN, OUTPUT);
  noTone(BUZZER_PIN); // pastikan awalnya diam

  Wire.begin(D2, D1); 
  lcd.init();
  lcd.backlight();
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Connecting Wifi");

  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("WiFi Connected");
  lcd.setCursor(0, 1);
  lcd.print(WiFi.localIP());
  delay(2000);

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print(messageStatic); // Scan RFID Card

  Serial.println("Testing buzzer...");
  tone(BUZZER_PIN, 1000);
  delay(300);
  noTone(BUZZER_PIN);
  delay(200);
  tone(BUZZER_PIN, 700);
  delay(300);
  noTone(BUZZER_PIN);
  Serial.println("Buzzer OK!");

}

void loop() {
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) return;

  // Baca UID RFID
  String uid = "";
  for (byte i = 0; i < rfid.uid.size; i++) {
    uid += String(rfid.uid.uidByte[i] < 0x10 ? "0" : "");
    uid += String(rfid.uid.uidByte[i], HEX);
  }
  uid.toUpperCase();
  Serial.print("UID: ");
  Serial.println(uid);

  // Tampilkan UID di LCD
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("UID: ");
  lcd.print(uid);

  delay(500);

  // Kirim UID ke server
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    WiFiClient client;

    String jsonBody = "{\"uid\":\"" + uid + "\"}";
    Serial.println("Sending: " + jsonBody);
    int httpCode;

    WiFiClient testClient;
    if (testClient.connect(url, 5000)) {
      Serial.println("Server reachable ✅");
      testClient.stop();
    } else {
      Serial.println("Server unreachable ❌ (Check firewall or bind IP)");
    }


    Serial.println("Preparing HTTP POST...");
    Serial.println("Target URL: " + serverRfidScanUrl);
    Serial.println("Payload: " + jsonBody);



    http.begin(client,serverRfidScanUrl);
    http.addHeader("Content-Type", "application/json");
    httpCode = http.POST(jsonBody);

   if (httpCode > 0) {
    Serial.printf("HTTP Response code: %d\n", httpCode);
    String response = http.getString();
    Serial.println("Response: " + response);

  StaticJsonDocument<512> doc;
  DeserializationError error = deserializeJson(doc, response);

  if (!error) {
    String msg = doc["message"] | "";
    String name = doc["attendance"]["name"] | "";
    
    Serial.println("Message: " + msg);

    if(msg.indexOf("Employee not found") >= 0){
      // kartu belum terdaftar
      buzzerError();
      scrollText(1,"not Registered", 150, 16);
    }else if(msg.indexOf("Attendance recorded successfully") >=0){
      // Check-in
      buzzerCheckIn();
      scrollText(1,"Check-in: " + name, 150,16);
    }
    else if(msg.indexOf("Check Out successfully") >= 0){
      // Check-out
      buzzerCheckOut();
      scrollText(1,"Check-out: " + name, 150, 16);
    }
    else if(msg.indexOf("You have already checked out") >= 0){
      buzzerError();
      scrollText(1, "Already checked out",150,16);
    }
    else{
      buzzerError();
      scrollText(1, msg,150,16);
    }
  }else {
    lcd.setCursor(0, 1);
    lcd.print("JSON Parse Error");
  }
} 
else {
  Serial.print("POST Failed. Code: ");
  Serial.println(httpCode);
  lcd.setCursor(0, 1);
  lcd.print("Server Error");
}
    http.end();
  } else {
    Serial.println("WiFi disconnected.");
    lcd.setCursor(0, 1);
    lcd.print("WiFi Lost");
    WiFi.begin(ssid, password);
  }

  // Akhiri komunikasi RFID
  rfid.PICC_HaltA();
  rfid.PCD_StopCrypto1();

  delay(1000); 
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print(messageStatic); 
}
  
