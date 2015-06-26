#!/usr/bin/env bash

npm install -g cordova
rm -rf plugins
rm -rf platforms
cordova plugin add cordova-plugin-whitelist@1.0.0
cordova plugin add org.apache.cordova.dialogs
cordova plugin add https://github.com/toddtreece/BluetoothSerial
cordova plugin add https://github.com/apache/cordova-plugin-splashscreen.git
cordova plugin add https://github.com/EddyVerbruggen/Insomnia-PhoneGap-Plugin.git
cordova plugin add cordova-plugin-console
cordova platform add ios
