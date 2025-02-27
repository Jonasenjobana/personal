import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Echart1Component } from './echart1/echart1.component';

const routes: Routes = [
  {
    path: '01',
    component: Echart1Component
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EchartDemoRoutingModule { }
