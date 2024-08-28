import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DomDemoRoutingModule } from './dom-demo-routing.module';
import { ScrollNumberComponent } from './scroll-number/scroll-number.component';
import { DynamicComponent } from './dynamic-component/dynamic-component.component';
import { DomDemoComponent } from './dom-demo/dom-demo.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollComponent } from './scroll/scroll.component';


@NgModule({
  declarations: [
    ScrollNumberComponent,
    DynamicComponent,
    DomDemoComponent,
    ScrollComponent,
  ],
  imports: [
    CommonModule,
    DomDemoRoutingModule,
    DragDropModule
  ]
})
export class DomDemoModule { }
