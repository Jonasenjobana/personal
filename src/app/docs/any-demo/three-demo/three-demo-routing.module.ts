import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThreeDay1Component } from './three-day1/three-day1.component';
import { ThreeDay5Component } from './three-day5/three-day5.component';
import { ThreeDay6Component } from './three-day6/three-day6.component';
import { ThreeDay61Component } from './three-day6-1/three-day6-1.component';
import { ThreeDay71Component } from './three-day7-1/three-day7-1.component';
import { ThreeDay72Component } from './three-day7-2/three-day7-2.component';

const routes: Routes = [
  {
    path: 'day1',
    component: ThreeDay1Component
  },
  {
    path: 'day5',
    component: ThreeDay5Component
  },
  {
    path: 'day6',
    component: ThreeDay6Component
  },
  {
    path: 'day6-1',
    component: ThreeDay61Component
  },
  {
    path: 'day7-1',
    component: ThreeDay71Component
  },
  {
    path: 'day7-2',
    component: ThreeDay72Component
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThreeDemoRoutingModule { }
