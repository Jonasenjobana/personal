import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DomDemoComponent } from './dom-demo/dom-demo.component';
import { ScrollComponent } from './scroll/scroll.component';
import { GridDemoComponent } from './dom-demo/grid-demo/grid-demo.component';
import { RotateComponent } from './dom-demo/rotate/rotate.component';
import { GsapScrollComponent } from './gsap-scroll/gsap-scroll.component';
import { GsapMenuComponent } from './gsap-demo/gsap-menu/gsap-menu.component';
import { AutoFitA4Component } from './auto-fit-a4/auto-fit-a4.component';

const routes: Routes = [
  {
    path: 'dom-demo',
    component: DomDemoComponent
  },
  {
    path: 'scroll',
    component: ScrollComponent
  },
  {
    path: 'grid',
    component: GridDemoComponent
  },
  {
    path: 'rotate',
    component: RotateComponent
  },
  {
    path: 'gsap-scroll',
    component: GsapScrollComponent
  },
  {
    path: 'gsap-menu',
    component: GsapMenuComponent
  },
  {
    path: 'a4',
    component: AutoFitA4Component
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DomDemoRoutingModule { }
