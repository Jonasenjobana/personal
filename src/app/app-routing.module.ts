import { NotFoundComponent } from './workspace/not-found/not-found.component';

import { LayoutComponent } from './layout/layout.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouterGuardService } from './shared/services/router-guard.service';
import { DocsModule } from './docs/docs.module';
import { HomeComponent } from './workspace/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'docs/canvas-demo',
        pathMatch: 'full',
      },
      {
        path: 'docs',
        loadChildren: () => import('src/app/docs/docs.module').then(m => m.DocsModule),
      },
      {
        path: 'home',
        component: HomeComponent
      }
    ],
    canActivate: [RouterGuardService]
  },
  {
    path: '',
    redirectTo: 'docs/canvas-demo',
    pathMatch: 'full',
  },
  {
    path: '**',
    component: NotFoundComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
