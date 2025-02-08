import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThreeDay1Component } from './three-day1/three-day1.component';
import { ThreeDemoRoutingModule } from './three-demo-routing.module';
import { ThreeDay5Component } from './three-day5/three-day5.component';
import { ThreeDay6Component } from './three-day6/three-day6.component';
import { ThreeDay61Component } from './three-day6-1/three-day6-1.component';
import { ThreeDay71Component } from './three-day7-1/three-day7-1.component';
import { ThreeDay72Component } from './three-day7-2/three-day7-2.component';
import { ThreeDay81Component } from './three-day8-1/three-day8-1.component';
import { ThreeDay91Component } from './three-day9-1/three-day9-1.component';
import { ThreeDemo1Component } from './do/three-demo1/three-demo1.component';
import { Three2Component } from './three2/three2.component';



@NgModule({
  declarations: [
    ThreeDay1Component,
    ThreeDay5Component,
    ThreeDay6Component,
    ThreeDay61Component,
    ThreeDay71Component,
    ThreeDay72Component,
    ThreeDay81Component,
    ThreeDay91Component,
    ThreeDemo1Component,
    Three2Component
  ],
  imports: [
    CommonModule,
    ThreeDemoRoutingModule
  ]
})
export class ThreeDemoModule { }
