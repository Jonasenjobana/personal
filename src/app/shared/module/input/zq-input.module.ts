import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZqInputDirective } from './zq-input.directive';
import { ZqInputGroupComponent } from './zq-input-group.component';



@NgModule({
  declarations: [
    ZqInputDirective,
    ZqInputGroupComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ZqInputDirective,
    ZqInputGroupComponent
  ]
})
export class ZqInputModule { }
