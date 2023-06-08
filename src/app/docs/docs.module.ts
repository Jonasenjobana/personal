import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocsComponent } from './docs.component';
import { DocsRoutingModule } from './docs-routing.module';
import { ZqButtonDemo } from './zq-button-demo/zq-button-demo.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { InputDemoComponent } from './input-demo/input-demo.component';
import { ZqSelectDemoComponent } from './zq-select-demo/zq-select-demo.component';


@NgModule({
  declarations: [
    ZqButtonDemo,
    DocsComponent,
    InputDemoComponent,
    ZqSelectDemoComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
    DocsRoutingModule
  ],
  exports: [
    ZqButtonDemo
  ]
})
export class DocsModule { }
