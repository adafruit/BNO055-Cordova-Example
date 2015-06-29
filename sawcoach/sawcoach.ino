#include <Wire.h>
#include <SPI.h>
#include <SoftwareSerial.h>

#include "Adafruit_Sensor.h"
#include "Adafruit_BNO055.h"
#include "Adafruit_BLE.h"
#include "Adafruit_BluefruitLE_UART.h"

#define RTS  11
#define RX    6
#define TX   10
#define CTS   9
#define MODE -1

#define BUFSIZE 128
#define VERBOSE_MODE true
Adafruit_BNO055 bno = Adafruit_BNO055(55);
SoftwareSerial bluefruitSS = SoftwareSerial(TX, RX);
Adafruit_BluefruitLE_UART ble(bluefruitSS, MODE, CTS, RTS);

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
  if(! ble.sendCommandCheckOK(F("AT+GAPDEVNAME=Hand Saw Coach"))) {
    Serial.println(F("FAILED."));
    while(1);
  }
  
  Serial.println( F("OK!") );
  
  ble.reset();
  
  Serial.print(F("BNO055 init: "));
  if(! bno.begin()) {
    Serial.println(F("FAILED."));
    while(1);
  }
   
  Serial.println(F("OK!"));

  bno.setExtCrystalUse(true);
  
  while (! ble.isConnected()) {
    delay(500);
  }
  
  Serial.println(F("Connected"));
  
  ble.println("+++");
  delay(100);
  ble.waitForOK();
  
}

void loop() {

  sensors_event_t event; 
  bno.getEvent(&event);
  
  ble.print(event.orientation.x, 1);
  ble.print(",");
  ble.println(event.orientation.z, 1);
  
  delay(200);

}
