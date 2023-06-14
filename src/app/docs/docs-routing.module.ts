import { ZqModalDemoComponent } from './zq-modal-demo/zq-modal-demo.component';
import { ZqButtonDemo } from './zq-button-demo/zq-button-demo.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocsComponent } from './docs.component';
import { InputDemoComponent } from './input-demo/input-demo.component';
import { ZqSelectDemoComponent } from './zq-select-demo/zq-select-demo.component';
import { TableDemoComponent } from './table-demo/table-demo.component';

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
        component: InputDemoComponent
      },
      {
        path: 'select-demo',
        component: ZqSelectDemoComponent
      },
      {
        path: 'table-demo',
        component: TableDemoComponent
      },
      {
        path: 'modal-demo',
        component: ZqModalDemoComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocsRoutingModule { }
