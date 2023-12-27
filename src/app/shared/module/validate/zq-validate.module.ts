import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZqValidateDirective } from './zq-validate.directive';
import { ZqAsyncValidateDirective } from './zq-async-validate.directive';



@NgModule({
  declarations: [
    ZqValidateDirective,
    ZqAsyncValidateDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ZqValidateDirective,
    ZqAsyncValidateDirective
  ]
})
export class ZqValidateModule { }
