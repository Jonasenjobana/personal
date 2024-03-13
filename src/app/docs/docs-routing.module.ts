import { FormDemoComponent } from './form-demo/form-demo.component';
import { CanvasDemoComponent } from './canvas-demo/canvas-demo.component';
import { CoderDemoComponent } from './coder-demo/coder-demo.component';
import { DiDemoComponent } from './di-demo/di-demo.component';
import { ZqModalDemoComponent } from './zq-modal-demo/zq-modal-demo.component';
import { ZqButtonDemo } from './zq-button-demo/zq-button-demo.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocsComponent } from './docs.component';
import { InputDemoComponent } from './input-demo/input-demo.component';
import { ZqSelectDemoComponent } from './zq-select-demo/zq-select-demo.component';
import { TableDemoComponent } from './table-demo/table-demo.component';
import { ScrollMenuComponent } from './scroll-menu/scroll-menu.component';
import { MessageDemoComponent } from './message-demo/message-demo.component';
import { GanteCanvasComponent } from './any-demo/canvas-demo/gante-canvas/gante-canvas.component';

const routes: Routes = [
  {
    path: '',
    component: DocsComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'gante-demo'
      },
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
      },
      {
        path: 'di-demo',
        component: DiDemoComponent
      },
      {
        path: 'coder-demo',
        component: CoderDemoComponent
      },
      {
        path: 'canvas-demo',
        component: CanvasDemoComponent
      },
      {
        path: 'scroll-demo',
        component: ScrollMenuComponent
      },
      {
        path: 'form-demo',
        component: FormDemoComponent
      },
      {
        path: 'table-demo',
        component: TableDemoComponent
      },
      {
        path: 'message-demo',
        component: MessageDemoComponent
      },
      {
        path: 'gante-demo',
        component: GanteCanvasComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocsRoutingModule { }
