import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZqButtonModule } from './module/button/zq-button.module';
@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    ZqButtonModule
  ],
  exports: [
    ZqButtonModule,
  ]
})
export class SharedModule { }
