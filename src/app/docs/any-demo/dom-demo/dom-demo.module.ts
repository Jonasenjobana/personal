import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DomDemoRoutingModule } from './dom-demo-routing.module';
import { ScrollNumberComponent } from './scroll-number/scroll-number.component';
import { DynamicComponent } from './dynamic-component/dynamic-component.component';
import { DomDemoComponent } from './dom-demo/dom-demo.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollComponent } from './scroll/scroll.component';
import { GridDemoComponent } from './dom-demo/grid-demo/grid-demo.component';
import { GridItemDirective } from './dom-demo/grid-demo/grid-item.directive';
import { RotateComponent } from './dom-demo/rotate/rotate.component';
import { GsapScrollComponent } from './gsap-scroll/gsap-scroll.component';
import { GsapMenuComponent } from './gsap-demo/gsap-menu/gsap-menu.component';
import { GsapScaleLineComponent } from './gsap-demo/gsap-scale-line/gsap-scale-line.component';
import {PlatformModule} from '@angular/cdk/platform';
import { AutoFitA4Component } from './auto-fit-a4/auto-fit-a4.component';

@NgModule({
  declarations: [
    ScrollNumberComponent,
    DynamicComponent,
    DomDemoComponent,
    ScrollComponent,
    GridDemoComponent,
    GridItemDirective,
    RotateComponent,
    GsapScrollComponent,
    GsapMenuComponent,
    GsapScaleLineComponent,
    AutoFitA4Component,
    
  ],
  imports: [
    CommonModule,
    DomDemoRoutingModule,
    DragDropModule,
    PlatformModule
  ]
})
export class DomDemoModule { }
