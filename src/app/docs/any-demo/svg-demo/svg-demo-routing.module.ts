import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Svg1Component } from './svg-1/svg-1.component';

const routes: Routes = [
  {
    path: '01',
    component: Svg1Component
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SVGDemoRoutingModule { }
