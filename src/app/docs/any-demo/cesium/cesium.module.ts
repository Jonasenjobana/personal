import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cesium01Component } from './cesium01/cesium01.component';
import { CesiumRoutingModule } from './cesium-routing.module';



@NgModule({
  declarations: [
    Cesium01Component
  ],
  imports: [
    CommonModule,
    CesiumRoutingModule
  ]
})
export class CesiumModule { }
