import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { PopoverMenuComponent } from './componets/popover-menu/popover-menu.component';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

// PARA GRAFICO DE PUNTOS
// npm install chart.js --save
// npm install chartjs-plugin-datalabels --save


// PLUGIN PARA MANEJAR EL QR CON LOGO
// https://www.npmjs.com/package/easyqrcodejs#angular-support
// npm install --save easyqrcodejs
// ========
// npm install phonegap-plugin-barcodescanner
// npm install @ionic-native/barcode-scanner
// npm i @ionic-native/core
// ionic capacitor sync
import {BarcodeScanner} from '@ionic-native/barcode-scanner/ngx';
// npm install cordova-plugin-x-socialsharing
// npm install @ionic-native/social-sharing
// npm install es6-promise-plugin
// ionic capacitor sync
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
// Moment JS
// npm install moment
// Camara
// npm install cordova-plugin-camera
// npm install @ionic-native/camera
// ionic capacitor sync

//AGREGAR AL MANIFEST
//android:screenOrientation="portrait"
// Storage
// npm install @capacitor/storage
import { Camera } from '@ionic-native/camera/ngx';


@NgModule({
  declarations: [AppComponent,PopoverMenuComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,HttpClientModule,ReactiveFormsModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },BarcodeScanner,SocialSharing,Camera],
  bootstrap: [AppComponent],
})
export class AppModule {}
