import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebglDemoComponent } from './webgl-demo/webgl-demo.component';

const routes: Routes = [
  {
    path: '01',
    component: WebglDemoComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebGlDemoRoutingModule { }
