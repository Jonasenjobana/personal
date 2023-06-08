import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZqButtonModule } from './module/button/zq-button.module';
import { ZqInputModule } from './module/input/zq-input.module';
import { ZqValidateModule } from './module/validate/zq-validate.module';
import { ZqSelectModule } from './module/select/zq-select.module';
@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    ZqButtonModule,
    ZqInputModule,
    ZqValidateModule,
    ZqSelectModule
  ],
  exports: [
    ZqButtonModule,
    ZqInputModule,
    ZqValidateModule,
    ZqSelectModule
  ]
})
export class SharedModule { }
