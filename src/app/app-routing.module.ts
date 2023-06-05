import { NotFoundComponent } from './workspace/not-found/not-found.component';

import { LayoutComponent } from './layout/layout.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ZqButtonComponent } from './docs/zq-button/zq-button.component';
import { RouterGuardService } from './shared/services/router-guard.service';

const routes: Routes = [
  {
    path: 'home',
    component: LayoutComponent,
    children: [
      {
        path: 'docs',
        component: ZqButtonComponent,
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
