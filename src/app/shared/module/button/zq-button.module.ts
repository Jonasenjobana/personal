import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZqButtonGroupComponent } from './zq-button-group.component';
import { ZqButtonComponent } from './zq-button.component';



@NgModule({
  declarations: [
    ZqButtonComponent,
    ZqButtonGroupComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ZqButtonComponent,
    ZqButtonGroupComponent
  ],
  providers: [
    {provide: 'CONST_VALUE', useValue: 'bqqqqqqqqqqqqqqqtnqqqqqqqqqqaklsd'}
  ]
})
export class ZqButtonModule { }
