import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Cesium01Component } from './cesium01/cesium01.component';

const routes: Routes = [
  {
    path: '01',
    component: Cesium01Component
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CesiumRoutingModule { }
