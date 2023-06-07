import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZqValidateDirective } from './zq-validate.directive';



@NgModule({
  declarations: [
    ZqValidateDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ZqValidateDirective
  ]
})
export class ZqValidateModule { }
