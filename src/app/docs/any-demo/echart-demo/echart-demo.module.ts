import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Echart1Component } from './echart1/echart1.component';
import { EchartDemoRoutingModule } from './echart-demo-routing.module';



@NgModule({
  declarations: [
    Echart1Component
  ],
  imports: [
    CommonModule,
    EchartDemoRoutingModule
  ]
})
export class EchartDemoModule { }
