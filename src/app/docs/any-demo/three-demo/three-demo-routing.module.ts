import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThreeDay1Component } from './three-day1/three-day1.component';

const routes: Routes = [
  {
    path: 'day1',
    component: ThreeDay1Component
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThreeDemoRoutingModule { }
