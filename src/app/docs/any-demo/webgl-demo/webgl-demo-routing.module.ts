import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebglDemoComponent } from './webgl-demo/webgl-demo.component';
import { Demo2Component } from './demo2/demo2.component';

const routes: Routes = [
  {
    path: '01',
    component: WebglDemoComponent
  },
  {
    path: '02',
    component: Demo2Component
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebGlDemoRoutingModule { }
