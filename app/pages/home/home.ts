import { Component } from '@angular/core';
import { NavController, Loading } from 'ionic-angular';
import { BledetailPage } from '../bledetail/bledetail';
import { BLE } from 'ionic-native';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  bles = [];
  
  // service and characteristic of HM-10 device
  hm10 = {
    serviceUUID: '0000ffe0-0000-1000-8000-00805f9b34fb',
    txCharacteristic: '0000ffe1-0000-1000-8000-00805f9b34fb',
    rxCharacteristic: '0000ffe1-0000-1000-8000-00805f9b34fb'
  };
  
  constructor(private nav: NavController) {
  }
  
  // scan nearby ble
  scanBle() {
    this.bles = [];
    this.loading();
    BLE.startScan([this.hm10.serviceUUID]).subscribe(ble => { this.bles.push(ble); });
     
    // stop after 3 second
    setTimeout(() => {
      BLE.stopScan().then(() => {
      });   
    }, 1000);
    
  }
  
  // load detail page and connect to it
  connectBle(ble) {
    this.nav.push(BledetailPage, { ble : ble });
  }
  
  // loading animation
  loading() {
    let loading = Loading.create({
      content: "Please wait...",
      duration: 1000
    });
    this.nav.present(loading); 
  }
}
