import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cesium01Component } from './cesium01/cesium01.component';
import { CesiumRoutingModule } from './cesium-routing.module';
import { Cesium02Component } from './cesium02/cesium02.component';
import { Cesium03Component } from './cesium03/cesium03.component';



@NgModule({
  declarations: [
    Cesium01Component,
    Cesium02Component,
    Cesium03Component
  ],
  imports: [
    CommonModule,
    CesiumRoutingModule
  ]
})
export class CesiumModule { }
