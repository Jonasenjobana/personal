import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebglDemoComponent } from './webgl-demo/webgl-demo.component';
import { WebGlDemoRoutingModule } from './webgl-demo-routing.module';
import { Demo2Component } from './demo2/demo2.component';


@NgModule({
  declarations: [
    WebglDemoComponent,
    Demo2Component,
  ],
  imports: [
    CommonModule,
    WebGlDemoRoutingModule
  ]
})
export class WebglDemoModule { }
