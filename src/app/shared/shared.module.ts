import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZqButtonModule } from './module/button/zq-button.module';
import { ZqInputModule } from './module/input/zq-input.module';
@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    ZqButtonModule,
    ZqInputModule
  ],
  exports: [
    ZqButtonModule,
    ZqInputModule
  ]
})
export class SharedModule { }
