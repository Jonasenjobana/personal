import { RouterModule, Routes } from '@angular/router';
import { DocsComponent } from './docs.component';
import { TableDemoComponent } from './table-demo/table-demo.component';
import { ZqButtonDemo } from './zq-button-demo/zq-button-demo.component';
import { ZqSelectDemoComponent } from './zq-select-demo/zq-select-demo.component';
import { Ng19demoComponent } from './any-demo/ng19demo/ng19demo.component';
import { AiCommunityComponent } from './any-demo/ai-community/ai-community.component';
import { VideoDemoComponent } from './any-demo/video-demo/video-demo.component';

export const routes: Routes = [
  //  {
  //         path: '',
  //         pathMatch: 'full',
  //         redirectTo: 'three-demo/day8-1'
  //       },
  {
    path: 'video',
    component: VideoDemoComponent
  },
  {
    path: 'cesium',
    loadChildren: () => import('./any-demo/cesium/cesium.routing').then(m => m.routes)
  },
  {
    path: 'table-demo',
    component: TableDemoComponent
  },
  {
    path: 'button-demo',
    component: ZqButtonDemo
  },
  {
    path: '19',
    component: Ng19demoComponent
  },
  {
    path: 'ai',
    component: AiCommunityComponent
  },
  // {
  //   path: 'input-demo',
  //   component: InputDemoComponent
  // },
  {
    path: 'select-demo',
    component: ZqSelectDemoComponent
  },
  // // {
  // //   path: 'table-demo',
  // //   component: TableDemoComponent
  // // },
  // {
  //   path: 'modal-demo',
  //   component: ZqModalDemoComponent
  // },
  // {
  //   path: 'di-demo',
  //   component: DiDemoComponent
  // },
  // {
  //   path: 'coder-demo',
  //   component: CoderDemoComponent
  // },
  // {
  //   path: 'canvas-demo',
  //   component: CanvasDemoComponent
  // },
  // {
  //   path: 'scroll-demo',
  //   component: ScrollMenuComponent
  // },
  // {
  //   path: 'form-demo',
  //   component: FormDemoComponent
  // },
  // // {
  // //   path: 'table-demo',
  // //   component: TableDemoComponent
  // // },
  // {
  //   path: 'message-demo',
  //   component: MessageDemoComponent
  // },
  // {
  //   path: 'pipe-demo',
  //   component: PipeCanvasComponent
  // },
  // {
  //   path: 'partical',
  //   component: ParticalCanvasComponent
  // },
  {
    path: 'three-demo',
    loadChildren: () => import('./any-demo/three-demo/three-demo.routing').then(r => r.routes)
  }
  // {
  //   path: 'map-lab',
  //   loadChildren: () => import('./any-demo/map-demo/map-demo.module').then(m => m.MapDemoModule)
  // },
  // {
  //   path: 'dom',
  //   loadChildren: () => import('./any-demo/dom-demo/dom-demo.module').then(m => m.DomDemoModule)
  // },
  // {
  //   path: 'echart',
  //   loadChildren: () => import('./any-demo/echart-demo/echart-demo.module').then(m => m.EchartDemoModule)
  // },
  // {
  //   path: 'webgl',
  //   loadChildren: () => import('./any-demo/webgl-demo/webgl-demo.module').then(m => m.WebglDemoModule)
  // },
  // {
  //   path: 'svg',
  //   loadChildren: () => import('./any-demo/svg-demo/svg-demo.module').then(m => m.SvgDemoModule)
  // }
];
