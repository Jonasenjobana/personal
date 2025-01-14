import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebglDemoComponent } from './webgl-demo/webgl-demo.component';
import { WebGlDemoRoutingModule } from './webgl-demo-routing.module';


@NgModule({
  declarations: [
    WebglDemoComponent
  ],
  imports: [
    CommonModule,
    WebGlDemoRoutingModule
  ]
})
export class WebglDemoModule { }
