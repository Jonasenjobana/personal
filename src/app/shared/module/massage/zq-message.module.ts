import { ZqModalModule } from './../modal/zq-modal.module';
import { ZqDirectiveModule } from './../directive/zq-directive.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZqMessageComponent } from './zq-message.component';



@NgModule({
  declarations: [
    ZqMessageComponent
  ],
  imports: [
    ZqDirectiveModule,
    CommonModule,
    ZqModalModule
  ]
})
export class ZqMessageModule { }
