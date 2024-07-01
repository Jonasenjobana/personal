import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThreeDay1Component } from './three-day1/three-day1.component';
import { ThreeDemoRoutingModule } from './three-demo-routing.module';



@NgModule({
  declarations: [
    ThreeDay1Component
  ],
  imports: [
    CommonModule,
    ThreeDemoRoutingModule
  ]
})
export class ThreeDemoModule { }
