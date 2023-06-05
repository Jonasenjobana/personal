import { NotFoundComponent } from './workspace/not-found/not-found.component';

import { LayoutComponent } from './layout/layout.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouterGuardService } from './shared/services/router-guard.service';
import { DocsModule } from './docs/docs.module';

const routes: Routes = [
  {
    path: 'home',
    component: LayoutComponent,
    children: [
      {
        path: 'docs',
        loadChildren: () => import('src/app/docs/docs.module').then(m => m.DocsModule),
      },
    ],
    canActivate: [RouterGuardService]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '**',
    component: NotFoundComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
