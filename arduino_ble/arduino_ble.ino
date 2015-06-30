#include <Wire.h>
#include <SPI.h>
#include <SoftwareSerial.h>

#include "Adafruit_Sensor.h"
#include "Adafruit_BNO055.h"
#include "Adafruit_BLE.h"
#include "Adafruit_BluefruitLE_UART.h"

#define RTS  10
#define RXI  11
#define TXO  12
#define CTS  13
#define MODE -1

#define BUFSIZE 128
#define VERBOSE_MODE false
Adafruit_BNO055 bno = Adafruit_BNO055(55);
SoftwareSerial bluefruitSS = SoftwareSerial(TXO, RXI);
Adafruit_BluefruitLE_UART ble(bluefruitSS, MODE, CTS, RTS);

int battery = 0;
int count = 0;

void setup() {

  Serial.begin(115200);
  Serial.println(F("BLE Starting"));

  delay(5000);

  if (! ble.begin(VERBOSE_MODE)) {
    Serial.println( F("FAILED!") );
    while(1);
  }

  Serial.println( F("OK!") );

  Serial.print(F("Factory reset: "));
  if(! ble.factoryReset()) {
    Serial.println(F("FAILED."));
    while(1);
  }

  Serial.println( F("OK!") );

  ble.echo(false);

  Serial.print(F("Set device name: "));
  if(! ble.sendCommandCheckOK(F("AT+GAPDEVNAME=BNOIOS"))) {
    Serial.println(F("FAILED."));
    while(1);
  }

  Serial.println(F("OK!"));

  ble.reset();

  Serial.print(F("BNO055 init: "));
  if(! bno.begin()) {
    Serial.println(F("FAILED."));
    while(1);
  }

  Serial.println(F("OK!"));

  bno.setExtCrystalUse(true);

  while (! ble.isConnected())
    delay(500);

  Serial.println(F("Connected"));

  batteryLevel();

}

void loop() {

  sensors_event_t event;
  bno.getEvent(&event);

  ble.print("AT+BLEUARTTX=");
  ble.print(event.orientation.x, 1);
  ble.print(",");
  ble.print(event.orientation.y, 1);
  ble.print(",");
  ble.print(event.orientation.z, 1);
  ble.print(",");
  ble.print(battery, DEC);
  ble.println("|");
  ble.readline(200);

  if(count == 5000) {
    batteryLevel();
    count = 0;
  } else {
    delay(200);
    count++;
  }

}

void batteryLevel() {

  ble.println("AT+HWVBAT");
  ble.readline(1000);

  if(strcmp(ble.buffer, "OK") == 0) {
    battery = 0;
  } else {
    battery = atoi(ble.buffer);
    ble.waitForOK();
  }

}
