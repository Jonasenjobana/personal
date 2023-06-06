import { InputDempComponent } from './input-demp/input-demp.component';
import { ZqButtonDemo } from './zq-button-demo/zq-button-demo.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocsComponent } from './docs.component';

const routes: Routes = [
  {
    path: '',
    component: DocsComponent,
    children: [
      {
        path: 'button-demo',
        component: ZqButtonDemo
      },
      {
        path: 'input-demo',
        component: InputDempComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocsRoutingModule { }
