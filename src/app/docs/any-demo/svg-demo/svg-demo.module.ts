import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Svg1Component } from './svg-1/svg-1.component';
import { SVGDemoRoutingModule } from './svg-demo-routing.module';



@NgModule({
  declarations: [
    Svg1Component
  ],
  imports: [
    CommonModule,
    SVGDemoRoutingModule
  ]
})
export class SvgDemoModule { }
