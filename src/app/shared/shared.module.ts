import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZqButtonModule } from './module/button/zq-button.module';
import { ZqInputModule } from './module/input/zq-input.module';
import { ZqValidateModule } from './module/validate/zq-validate.module';
import { ZqSelectModule } from './module/select/zq-select.module';
import { ZqTableModule } from './module/table/zq-table.module';
import { ZqModalModule } from './module/modal/zq-modal.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    ZqInputModule,
    ZqValidateModule,
    ZqSelectModule,
    ZqButtonModule,
    ZqTableModule,
    ZqModalModule,
    ReactiveFormsModule
  ],
  exports: [
    ZqInputModule,
    ZqValidateModule,
    ZqModalModule,
    ZqSelectModule,
    ZqButtonModule,
    ZqTableModule
  ]
})
export class SharedModule { }
