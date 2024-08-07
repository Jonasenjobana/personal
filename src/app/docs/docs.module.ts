import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocsComponent } from './docs.component';
import { DocsRoutingModule } from './docs-routing.module';
import { ZqButtonDemo } from './zq-button-demo/zq-button-demo.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputDemoComponent } from './input-demo/input-demo.component';
import { ZqSelectDemoComponent } from './zq-select-demo/zq-select-demo.component';
import { TableDemoComponent } from './table-demo/table-demo.component';
import { ZqModalDemoComponent } from './zq-modal-demo/zq-modal-demo.component';
import { DiDemoComponent } from './di-demo/di-demo.component';
import { NgFeatDemoComponent } from './ng-feat-demo/ng-feat-demo.component';
import { CoderDemoComponent } from './coder-demo/coder-demo.component';
import { JsonStrPipe } from './coder-demo/json-str.pipe';
import { CanvasDemoComponent } from './canvas-demo/canvas-demo.component';
import { HttpClientModule } from '@angular/common/http';
import { ScrollMenuComponent } from './scroll-menu/scroll-menu.component';
import { FormDemoComponent } from './form-demo/form-demo.component';
import { TestFormComponent } from './form-demo/test-form/test-form.component';
import { InputRangeComponent } from './form-demo/components/input-range/input-range.component';
import { InputRangeTmpComponent } from './form-demo/components/input-range-tmp/input-range-tmp.component';
import { SlValidatorDirective } from './form-demo/components/input-range-tmp/sl-validator.directive';
import { SlNumberValidatorDirective } from './form-demo/components/input-range-tmp/sl-number-validator.directive';
import { MessageDemoComponent } from './message-demo/message-demo.component';
import { MessageTipComponent } from './message-demo/components/message-tip/message-tip.component';
import { MessageWarpComponent } from './message-demo/components/message-warp/message-warp.component';
import { EllipsePipe } from './message-demo/ellipse.pipe';
import { CanvasDemoModule } from './any-demo/canvas-demo/canvas-demo.module';
import { VxeTableModule } from './any-demo/vxe-table/vxe-table.module';
import { BigScreenComponent } from './big-screen/big-screen.component';
import { BigScreenLayerComponent } from './big-screen/big-screen-layer/big-screen-layer.component';


@NgModule({
  declarations: [
    ZqButtonDemo,
    DocsComponent,
    InputDemoComponent,
    ZqSelectDemoComponent,
    TableDemoComponent,
    ZqModalDemoComponent,
    DiDemoComponent,
    NgFeatDemoComponent,
    CoderDemoComponent,
    JsonStrPipe,
    CanvasDemoComponent,
    ScrollMenuComponent,
    FormDemoComponent,
    TestFormComponent,
    InputRangeComponent,
    InputRangeTmpComponent,
    SlValidatorDirective,
    SlNumberValidatorDirective,
    MessageDemoComponent,
    MessageTipComponent,
    MessageWarpComponent,
    EllipsePipe,
    BigScreenComponent,
    BigScreenLayerComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
    DocsRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CanvasDemoModule,
    VxeTableModule
  ]
})
export class DocsModule { }
