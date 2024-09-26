import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cesium01Component } from './cesium01/cesium01.component';
import { CesiumRoutingModule } from './cesium-routing.module';
import { Cesium02Component } from './cesium02/cesium02.component';



@NgModule({
  declarations: [
    Cesium01Component,
    Cesium02Component
  ],
  imports: [
    CommonModule,
    CesiumRoutingModule
  ]
})
export class CesiumModule { }
