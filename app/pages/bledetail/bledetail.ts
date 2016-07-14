import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BLE } from 'ionic-native';

@Component({
  templateUrl: 'build/pages/bledetail/bledetail.html',
})

export class BledetailPage implements OnInit {
  ble;
  receivedData: string;
  color = {
    red: 0,
    green: 0,
    blue:0
  };
  
  // service and characteristic of device
  hm10 = {
    serviceUUID: '0000ffe0-0000-1000-8000-00805f9b34fb',
    txCharacteristic: '0000ffe1-0000-1000-8000-00805f9b34fb',
    rxCharacteristic: '0000ffe1-0000-1000-8000-00805f9b34fb'
  };
  
  constructor(private params: NavParams, private nav: NavController) {
    this.ble = params.data.ble; 
  }
  
  // connect to ble when this page loaded
  ngOnInit() {
    this.connect(this.ble.id);
  }
  
  // connect to selected device
  connect(deviceId) {
    BLE.connect(deviceId).subscribe(peripheralData => {
      BLE.startNotification(deviceId, this.hm10.serviceUUID, this.hm10.rxCharacteristic).subscribe(notificationData => { this.disconnect(); }, notificationData => {});
    }, peripheralData => {});
  }
  
  // disconnect
  disconnect() {
    BLE.disconnect(this.ble.id);
    this.nav.pop();
  }
  
  // send string to turn on led
  turnLed(state, pixel) {
    BLE.writeWithoutResponse(this.ble.id, this.hm10.serviceUUID, this.hm10.txCharacteristic, this.stringToBytes(pixel + '-' + state));  
  }
  
  // set rgb value
  colorLed(number, color) {
    switch (color){
      case 'r' : this.color.red = parseInt(number); break;
      case 'g' : this.color.green = parseInt(number); break;
      case 'b' : this.color.blue = parseInt(number); break;      
    }
  }
  
  // send rgb value to set color
  sendUpdate() {
    BLE.writeWithoutResponse(this.ble.id, this.hm10.serviceUUID, this.hm10.txCharacteristic, this.stringToBytes('c-' + this.color.red + ',' + this.color.green + ',' + this.color.blue));  
  }
  
  // TODO: find a better way to do below function
  
  // convert array buffer to string
  bytesToString(buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
  }
  
  // convert string to array buffder
  stringToBytes(string) {
    var array = new Uint8Array(string.length);
    for (var i = 0, l = string.length; i < l; i++) {
        array[i] = string.charCodeAt(i);
    }
    return array.buffer;
  }

}
