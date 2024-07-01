import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanvasMapComponent } from './canvas-map/canvas-map.component';

const routes: Routes = [
  {
    path: 'canvas-map',
    component: CanvasMapComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapDemoRoutingModule { }
