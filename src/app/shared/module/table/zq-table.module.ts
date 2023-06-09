import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableTrDirective } from './table-tr.directive';
import { TableTdDirective } from './table-td.directive';



@NgModule({
  declarations: [
    TableTrDirective,
    TableTdDirective
  ],
  imports: [
    CommonModule
  ]
})
export class ZqTableModule { }
