import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasMapComponent } from './canvas-map/canvas-map.component';
import { MapDemoRoutingModule } from './map-demo-routing.module';



@NgModule({
  declarations: [
    CanvasMapComponent
  ],
  imports: [
    CommonModule,
    MapDemoRoutingModule
  ]
})
export class MapDemoModule { }
