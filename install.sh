#!/usr/bin/env bash

if [ -d "plugins" ]; then
  rm -rf plugins
fi

if [ -d "platforms" ]; then
  rm -rf platforms
fi

echo "----------------------------------------"
echo "INSTALLING THE LATEST VERSION OF CORDOVA"
echo "----------------------------------------"
npm install -g cordova ios-sim

echo "--------------------------"
echo "INSTALLING CORDOVA PLUGINS"
echo "--------------------------"
cordova plugin add cordova-plugin-whitelist@1.0.0
cordova plugin add org.apache.cordova.dialogs
cordova plugin add https://github.com/toddtreece/BluetoothSerial
cordova plugin add https://github.com/apache/cordova-plugin-splashscreen.git
cordova plugin add https://github.com/EddyVerbruggen/Insomnia-PhoneGap-Plugin.git
cordova plugin add cordova-plugin-console

echo "-------------------"
echo "ADDING iOS PLATFORM"
echo "-------------------"
cordova platform add ios

if [ ! -f "/Applications/Arduino.app/Contents/MacOS/Arduino" ]; then

  echo "-------------------------------------------------------------"
  echo "ERROR: ARE YOU SURE YOU INSTALLED v1.6.4+ OF THE ARDUINO IDE?"
  echo "-------------------------------------------------------------"

  exit 1

fi

export PATH="/Applications/Arduino.app/Contents/MacOS:$PATH"

echo "------------------------------------"
echo "ADDING ARDUINO BOARD MANAGER PACKAGE"
echo "------------------------------------"
URLS=`Arduino --get-pref boardsmanager.additional.urls`
Arduino --pref "boardsmanager.additional.urls=https://adafruit.github.io/arduino-board-index/package_adafruit_index.json,${URLS}" --save-prefs
echo -e "Added package_adafruit_index.json!\n"

echo "---------------------------------------"
echo "INSTALLING ARDUINO LIBRARY DEPENDENCIES"
echo "---------------------------------------"
Arduino --install-library "Adafruit BNO055,Adafruit Unified Sensor"

echo "-------------------------------------"
echo "INSTALLING ARDUINO BOARD DEPENDENCIES"
echo "-------------------------------------"
Arduino --install-boards adafruit:avr

