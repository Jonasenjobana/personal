import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipeCanvasComponent } from './pipe-canvas/pipe-canvas.component';
import { ParticalCanvasComponent } from './partical-canvas/partical-canvas.component';



@NgModule({
  declarations: [
    PipeCanvasComponent,
    ParticalCanvasComponent
  ],
  imports: [
    CommonModule
  ]
})
export class CanvasDemoModule { }
