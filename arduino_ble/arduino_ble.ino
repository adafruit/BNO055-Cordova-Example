#include <Wire.h>
#include <SPI.h>
#include "Adafruit_Sensor.h"
#include "Adafruit_BNO055.h"
#include "Adafruit_BLE.h"
#include "Adafruit_BLE_SWUART.h"

#define RTS  11
#define RX    6
#define TX   10
#define CTS   9
#define MODE 12

#define BUFSIZE (128)

Adafruit_BLE_SWUART ble(RX, TX, CTS, RTS, MODE);
Adafruit_BNO055 bno = Adafruit_BNO055(55);

void setup() {
  
  Serial.begin(115200);
  Serial.println(F("Hand Saw Coach Starting"));
  
  delay(5000);

  if (! ble.begin()) {
    Serial.println( F("FAILED!") );
    while(1);
  }
  
  Serial.println( F("OK!") );

  Serial.print( F("Command mode: ") );
  if(! ble.setModePin(BLUEFRUIT_MODE_COMMAND)) {
    Serial.println(F("FAILED."));
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
  
  delay(1000);

  Serial.print(F("Set device name: "));
  ble.println("AT+GAPDEVNAME=BNOIOS");
  
  if(! ble.waitForOK()) {
    Serial.println(F("FAILED."));
    while(1);  
  }
  
  Serial.println( F("OK!") );
    
  Serial.print( F("Switching to data mode: ") );
  if(! ble.setModePin(BLUEFRUIT_MODE_DATA)) {
    while(1);
  }
  
  Serial.println(F("OK!"));
  
  Serial.print(F("BNO055 init: "));
  if(! bno.begin()) {
    Serial.println(F("FAILED."));
    while(1);
  }
   
  Serial.println(F("OK!"));

  bno.setExtCrystalUse(true);

}

void loop() {

  sensors_event_t event; 
  bno.getEvent(&event);
  
  ble.print(event.orientation.x, 4);
  ble.print(",");
  ble.println(event.orientation.z, 4);
  
  delay(200);

}
