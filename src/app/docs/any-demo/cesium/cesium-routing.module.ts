import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Cesium01Component } from './cesium01/cesium01.component';
import { Cesium02Component } from './cesium02/cesium02.component';

const routes: Routes = [
  {
    path: '01',
    component: Cesium01Component
  },
  {
    path: '02',
    component: Cesium02Component
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CesiumRoutingModule { }
