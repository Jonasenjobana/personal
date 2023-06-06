import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZqInputDirective } from './zq-input.directive';



@NgModule({
  declarations: [
    ZqInputDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ZqInputDirective
  ]
})
export class ZqInputModule { }
