import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DomDemoComponent } from './dom-demo/dom-demo.component';

const routes: Routes = [
  {
    path: 'dom-demo',
    component: DomDemoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DomDemoRoutingModule { }
