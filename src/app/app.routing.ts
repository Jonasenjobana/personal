import { NotFoundComponent } from './workspace/not-found/not-found.component';

import { LayoutComponent } from './layout/layout.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './workspace/home/home.component';
import { RouterGuardService } from './shared/services/router-guard.service';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      // {
      //   path: '',
      //   pathMatch: 'full',
      //   redirectTo: 'docs'
      // },
      {
        path: 'docs',
        loadComponent: () => import('src/app/docs/docs.component').then(m => m.DocsComponent),
        loadChildren: () => import('src/app/docs/docs.routing').then(m => m.routes)
      },
      {
        path: 'home',
        component: HomeComponent
      }
    ],
    canActivate: [RouterGuardService]
  },
  {
    path: '**',
    component: NotFoundComponent
  },
];
