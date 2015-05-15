#!/usr/bin/env bash

npm install -g cordova
cordova plugin add cordova-plugin-whitelist@1
cordova plugin add com.megster.cordova.bluetoothserial
cordova plugin add https://github.com/apache/cordova-plugin-splashscreen.git
cordova plugin add https://github.com/EddyVerbruggen/Insomnia-PhoneGap-Plugin.git
cordova plugin add cordova-plugin-console
cordova platform add ios
