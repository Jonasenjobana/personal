import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocsComponent } from './docs.component';
import { DocsRoutingModule } from './docs-routing.module';
import { ZqButtonDemo } from './zq-button-demo/zq-button-demo.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    ZqButtonDemo,
    DocsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    DocsRoutingModule
  ],
  exports: [
    ZqButtonDemo
  ]
})
export class DocsModule { }
