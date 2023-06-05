import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZqButtonDemo } from './zq-button/zq-button-demo.component';
import { DocsComponent } from './docs.component';
import { DocsRoutingModule } from './docs-routing.module';



@NgModule({
  declarations: [
    ZqButtonDemo,
    DocsComponent
  ],
  imports: [
    CommonModule,
    DocsRoutingModule
  ],
  exports: [
    ZqButtonDemo
  ]
})
export class DocsModule { }
