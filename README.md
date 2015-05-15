# BNO055 & BLE iOS Cordova Example

## General Setup

```
git clone https://github.com/adafruit/BNO055-Cordova-Example.git && cd BNO055-Cordova-Example
```

## Arduino Setup

1.  Attach a BNO055 & a Bluetooth LE UART Friend to an Arduino Uno, and [adjust the pins as needed](https://github.com/adafruit/BNO055-Cordova-Example/blob/master/arduino_ble/arduino_ble.ino#L10).
2.  Upload the [example sketch](https://github.com/adafruit/BNO055-Cordova-Example/blob/master/arduino_ble/arduino_ble.ino).
3.  Leave the Uno powered on with the sketch running.

## Cordova Setup

1. Install the latest [XCode](http://itunes.apple.com/us/app/xcode/id497799835?ls=1&mt=12).
2. Install the latest [node.js](http://nodejs.org/dist/v0.12.3/node-v0.12.3.pkg).
3. Run `./install.sh` from the `BNO055-Cordova-Example` directory.
4. Run `cordova build`.
5. Run `open platforms/ios/BNO055\ BLE\ Example.xcodeproj` to launch the XCode project.
6. Plug in your iOS device, and [follow this guide to build and upload to the device](https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/LaunchingYourApponDevices/LaunchingYourApponDevices.html).
7. The device should automatically find the Arduino, connect and launch the graph.
8. Use Bluefruit LE Connect to debug and make sure you are getting UART data from the Arduino.
