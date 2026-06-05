#include "esp_camera.h"
#include <WiFi.h>
#include <map>
#include <string>
#include <WiFiServer.h>
#include <WebServer.h>
#include "Adafruit_NeoPixel.h"




// ===================
// Select camera model
// ===================
//#define CAMERA_MODEL_WROVER_KIT // Has PSRAM
//#define CAMERA_MODEL_ESP_EYE // Has PSRAM
#define CAMERA_MODEL_ESP32S3_EYE  // Has PSRAM
//#define CAMERA_MODEL_M5STACK_PSRAM // Has PSRAM
//#define CAMERA_MODEL_M5STACK_V2_PSRAM // M5Camera version B Has PSRAM
//#define CAMERA_MODEL_M5STACK_WIDE // Has PSRAM
//#define CAMERA_MODEL_M5STACK_ESP32CAM // No PSRAM
//#define CAMERA_MODEL_M5STACK_UNITCAM // No PSRAM
//#define CAMERA_MODEL_AI_THINKER // Has PSRAM
//#define CAMERA_MODEL_TTGO_T_JOURNAL // No PSRAM
// ** Espressif Internal Boards **
//#define CAMERA_MODEL_ESP32_CAM_BOARD
//#define CAMERA_MODEL_ESP32S2_CAM_BOARD
//#define CAMERA_MODEL_ESP32S3_CAM_LCD
#include <WebSocketsClient.h>

#include "camera_pins.h"

#define MOTOR_IN1 2
#define MOTOR_IN2 45
#define MOTOR_IN3 47
#define MOTOR_IN4 48
#define STBY 14

#define TRIG_PIN 42
#define ECHO_PIN_L 41
#define ECHO_PIN_C 39
#define ECHO_PIN_R 40

const char *ssid = "Nika";
const char *password = "09102004";
const char *serverIp = "192.168.3.5";
const int port = 8880;
bool autonomousMode = true;

int MAX_SPEED = 90;
WebSocketsClient webSocket;
typedef void (*CommandHandler)();
std::map<std::string, CommandHandler> commandMap;

unsigned long lastAutonomousTime = 0;
const int AUTONOMOUS_INTERVAL = 150;

Adafruit_NeoPixel strip(16, 1, NEO_GRB + NEO_KHZ800);

// ===================
// Logging
// ===================
void log(String msg) {
  Serial.println(msg);
  webSocket.sendTXT(msg);
}

WebServer textServer(8080);
float sensorLeft = 0.0;
float sensorCenter = 0.0;
float sensorRight = 0.0;

// ===================
// Sensor Data Sendi
// ===================


void handleTextData() {
  String json = "{\"sensor_left\": " + String(sensorLeft) + ", \"sensor_center\": " + String(sensorCenter) + ", \"sensor_right\": " + String(sensorRight) + "}";

  textServer.send(200, "application/json", json);
}

// ===================
// Motor Logic
// ===================
void stop() {
  analogWrite(MOTOR_IN1, 0);
  analogWrite(MOTOR_IN2, 0);
  analogWrite(MOTOR_IN3, 0);
  analogWrite(MOTOR_IN4, 0);
  digitalWrite(STBY, LOW);
  log("stop");
}

void goForward() {
  analogWrite(MOTOR_IN1, 0);
  analogWrite(MOTOR_IN2, MAX_SPEED);
  analogWrite(MOTOR_IN3, 0);
  analogWrite(MOTOR_IN4, MAX_SPEED);
  digitalWrite(STBY, HIGH);
  log("go");
}

void goBackwards() {
  analogWrite(MOTOR_IN1, MAX_SPEED);
  analogWrite(MOTOR_IN2, 0);
  analogWrite(MOTOR_IN3, MAX_SPEED);
  analogWrite(MOTOR_IN4, 0);
  digitalWrite(STBY, HIGH);
  log("backwards");
}

void goLeft(int speed = MAX_SPEED) {
  analogWrite(MOTOR_IN1, MAX_SPEED);
  analogWrite(MOTOR_IN2, 0);
  analogWrite(MOTOR_IN3, 0);
  analogWrite(MOTOR_IN4, MAX_SPEED);
  digitalWrite(STBY, HIGH);
  log("left");
}

void goRight(int speed = MAX_SPEED) {
  analogWrite(MOTOR_IN1, 0);
  analogWrite(MOTOR_IN2, MAX_SPEED);
  analogWrite(MOTOR_IN3, MAX_SPEED);
  analogWrite(MOTOR_IN4, 0);
  digitalWrite(STBY, HIGH);
  log("right");
}

void restart() {
  ESP.restart();
}

void toggleSmartMode() {
  autonomousMode = true;
  Serial.println("Mode: AUTONOMOUS");
}
void toggleManualMode() {
  autonomousMode = false;
  stop();
  Serial.println("Mode: MANUAL");
}

// ===================
// WebSocket
// ===================
void assignCommands() {
  commandMap["GO_FORWARD"] = goForward;
  commandMap["STOP"] = stop;
  commandMap["GO_LEFT"] = []() {
    goLeft();
  };
  commandMap["GO_RIGHT"] = []() {
    goRight();
  };
  commandMap["GO_BACKWARDS"] = goBackwards;
  commandMap["RESTART"] = restart;
  commandMap["SMART_MODE"] = toggleSmartMode;
  commandMap["MANUAL_MODE"] = toggleManualMode;
}

void callEachCommand(std::string command) {
  auto it = commandMap.find(command);
  if (it != commandMap.end()) {
    it->second();
  } else {
    log("Error: Command not found: " + String(command.c_str()));
  }
}

void webSocketEvent(WStype_t type, uint8_t *payload, size_t length) {
  switch (type) {
    case WStype_DISCONNECTED:
      Serial.println("[WSc] Disconnected!");
      break;
    case WStype_CONNECTED:
      Serial.printf("[WSc] Connected to url: %s\n", payload);
      break;
    case WStype_TEXT:
      {
        std::string command(reinterpret_cast<const char *>(payload), length);
        Serial.print("Command: ");
        Serial.println(command.c_str());
        callEachCommand(command);
      }
      break;
    case WStype_PING:
      Serial.println("[WSc] ping");
      break;
    case WStype_PONG:
      Serial.println("[WSc] pong");
      break;
    default:
      break;
  }
}

void startCameraServer();


// ===================
// Sensors Distance
// ===================


long readDistance(int echoPin) {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long echo = pulseIn(echoPin, HIGH, 15000);
  delay(30);

  if (echo == 0) return 250;
  return echo * 0.034 / 2;
}

// ===================
// Autonomous
// ===================
void AUTONOMOUS() {
  Serial.println("SMARTMODE");
  long fwd = readDistance(ECHO_PIN_C);
  sensorCenter = fwd;
  delay(30);
  long sideLeft = readDistance(ECHO_PIN_L);
  sensorCenter = sideLeft;
  delay(30);
  long sideRight = readDistance(ECHO_PIN_R);
  sensorCenter = sideRight;
  delay(30);

  log("F:" + String(fwd) + " L:" + String(sideLeft) + " R:" + String(sideRight));

  if (fwd == 0) {
    stop();
    return;
  }

  if (fwd > 40 && sideLeft > 15 && sideRight > 15) {
    goForward();
    return;
  }

  stop();
  delay(500);
  goBackwards();
  delay(500);
  stop();
  goLeft(200);
  delay(600);
  stop();
  delay(500);
  long fwdScan1;
  for (int i = 0; i < 2; i++) {
    fwdScan1 = readDistance(ECHO_PIN_C);
    delay(30);
  }
  long sideLeftScan1;
  for (int i = 0; i < 2; i++) {
    sideLeftScan1 = readDistance(ECHO_PIN_L);
    delay(30);
  }

  long sideRightScan1;
  for (int i = 0; i < 2; i++) {
    sideRightScan1 = readDistance(ECHO_PIN_R);
    delay(30);
  }

  Serial.println("Left side scan L:" + String(sideLeftScan1));
  Serial.println("Left side scan C:" + String(fwdScan1));
  Serial.println("Right side scan R:" + String(sideRightScan1));


  // After left scan:
  goRight(200);
  delay(600);  // ← match the left delay to return to 0°
  stop();
  delay(1000);

  goRight(200);
  delay(600);
  stop();
  delay(200);
  // take scan2 here
  long fwdScan2;
  for (int i = 0; i < 2; i++) {
    fwdScan2 = readDistance(ECHO_PIN_C);
    delay(30);
  }
  long sideLeftScan2;
  for (int i = 0; i < 2; i++) {
    sideLeftScan2 = readDistance(ECHO_PIN_L);
    delay(30);
  }

  long sideRightScan2;
  for (int i = 0; i < 2; i++) {
    sideRightScan2 = readDistance(ECHO_PIN_R);
    delay(30);
  }

  Serial.println("Left scan:" + String(sideLeftScan2));
  Serial.println("Center scan:" + String(fwdScan2));
  Serial.println("Right scan:" + String(sideRightScan2));

  // Then return to center:
  goLeft(200);
  delay(600);
  stop();

  long distanceSum1 = (fwdScan1 + sideLeftScan1 + sideRightScan1);
  long distanceSum2 = (fwdScan2 + sideLeftScan2 + sideRightScan2);

  if (fwd >= fwdScan1 && fwd >= fwdScan2 && fwd > 40) {
    goForward();
  } else if (distanceSum1 >= distanceSum2 && distanceSum1 > 60) {
    goLeft(200);  // left had more space → turn left
    delay(600);
    goForward();
  } else if (distanceSum2 > distanceSum1 && distanceSum2 > 60) {
    goRight(200);  // right had more space → turn right ← was missing!
    delay(600);
    goForward();
  } else {
    goBackwards();
    delay(700);
    stop();
  }
}

// ===================
// Rainbow LED
// ===================


void rainbowLED() {
  strip.setPixelColor(0, strip.Color(255, 0, 0));
  strip.show();
  delay(200);

  strip.setPixelColor(8, strip.Color(255, 0, 0));
  strip.show();
  delay(200);

  strip.setPixelColor(1, strip.Color(0, 255, 0));
  strip.show();
  delay(200);

  strip.setPixelColor(9, strip.Color(0, 255, 0));
  strip.show();
  delay(200);

  strip.setPixelColor(2, strip.Color(0, 0, 255));
  strip.show();
  delay(200);

  strip.setPixelColor(10, strip.Color(0, 0, 255));
  strip.show();
  delay(200);


  strip.setPixelColor(3, strip.Color(255, 255, 0));
  strip.show();
  delay(200);

  strip.setPixelColor(11, strip.Color(255, 255, 0));
  strip.show();
  delay(200);


  strip.setPixelColor(4, strip.Color(0, 255, 255));
  strip.show();
  delay(200);

  strip.setPixelColor(12, strip.Color(0, 255, 255));
  strip.show();
  delay(200);

  strip.setPixelColor(5, strip.Color(255, 0, 255));
  strip.show();
  delay(200);

  strip.setPixelColor(13, strip.Color(255, 0, 255));
  strip.show();
  delay(200);

  strip.setPixelColor(6, strip.Color(255, 128, 0));
  strip.show();
  delay(200);

  strip.setPixelColor(14, strip.Color(255, 128, 0));
  strip.show();
  delay(200);

  strip.setPixelColor(7, strip.Color(255, 255, 255));
  strip.show();
  delay(200);


  strip.setPixelColor(15, strip.Color(255, 255, 255));
  strip.show();
  delay(200);

  strip.setPixelColor(7, strip.Color(0, 0, 0));
  strip.show();
  delay(200);


  strip.setPixelColor(15, strip.Color(0, 0, 0));
  strip.show();
  delay(200);

  strip.setPixelColor(6, strip.Color(0, 0, 0));
  strip.show();
  delay(200);

  strip.setPixelColor(14, strip.Color(0, 0, 0));
  strip.show();
  delay(200);

  strip.setPixelColor(13, strip.Color(0, 0, 0));
  strip.show();
  delay(200);

  strip.setPixelColor(5, strip.Color(0, 0, 0));
  strip.show();
  delay(200);

  strip.setPixelColor(12, strip.Color(0, 0, 0));
  strip.show();
  delay(200);

  strip.setPixelColor(4, strip.Color(0, 0, 0));
  strip.show();
  delay(200);

  strip.setPixelColor(11, strip.Color(0, 0, 0));
  strip.show();
  delay(200);

  strip.setPixelColor(3, strip.Color(0, 0, 0));
  strip.show();
  delay(200);

  strip.setPixelColor(10, strip.Color(0, 0, 0));
  strip.show();
  delay(200);

  strip.setPixelColor(2, strip.Color(0, 0, 0));
  strip.show();
  delay(200);


  strip.setPixelColor(9, strip.Color(0, 0, 0));
  strip.show();
  delay(200);

  strip.setPixelColor(1, strip.Color(0, 0, 0));
  strip.show();
  delay(200);

  strip.setPixelColor(8, strip.Color(0, 0, 0));
  strip.show();
  delay(200);

  strip.setPixelColor(0, strip.Color(0, 0, 0));
  strip.show();
  delay(200);
}
// ===================
// Setup
// ===================
void setup() {
  Serial.begin(115200);
  Serial.setDebugOutput(true);

  pinMode(MOTOR_IN1, OUTPUT);
  pinMode(MOTOR_IN2, OUTPUT);
  pinMode(MOTOR_IN3, OUTPUT);
  pinMode(MOTOR_IN4, OUTPUT);
  pinMode(STBY, OUTPUT);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN_L, INPUT);
  pinMode(ECHO_PIN_C, INPUT);
  pinMode(ECHO_PIN_R, INPUT);

  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sccb_sda = SIOD_GPIO_NUM;
  config.pin_sccb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 10000000;
  config.frame_size = FRAMESIZE_SVGA;
  config.pixel_format = PIXFORMAT_JPEG;
  config.grab_mode = CAMERA_GRAB_WHEN_EMPTY;
  config.fb_location = CAMERA_FB_IN_PSRAM;
  config.jpeg_quality = 12;
  config.fb_count = 1;

  if (psramFound()) {
    config.jpeg_quality = 10;
    config.fb_count = 2;
    config.grab_mode = CAMERA_GRAB_LATEST;
  } else {
    config.frame_size = FRAMESIZE_HVGA;
    config.fb_location = CAMERA_FB_IN_DRAM;
  }

  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("Camera init failed: 0x%x\n", err);
    return;
  }

  sensor_t *s = esp_camera_sensor_get();
  s->set_vflip(s, 1);
  s->set_brightness(s, 1);
  s->set_saturation(s, -1);

  WiFi.begin(ssid, password);
  WiFi.setSleep(false);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected: " + WiFi.localIP().toString());

  startCameraServer();

  textServer.on("/data", handleTextData);
  textServer.begin();

  Serial.println("Text Server started on port 8080");

  webSocket.begin(serverIp, port, "/esp-32");
  webSocket.onEvent(webSocketEvent);
  webSocket.setReconnectInterval(5000);
  webSocket.enableHeartbeat(15000, 3000, 2);

  assignCommands();
  Serial.println("Ready!");

  strip.begin();
  strip.show();
  delay(200);
  strip.setBrightness(50);
}

// ===================
// Loop
// ===================
void loop() {
  webSocket.loop();
  if (autonomousMode) {
    if (millis() - lastAutonomousTime >= AUTONOMOUS_INTERVAL) {
      lastAutonomousTime = millis();
      AUTONOMOUS();
    }
  }
  //rainbowLED();
  textServer.handleClient();
}