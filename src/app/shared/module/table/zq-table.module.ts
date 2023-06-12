import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableTrDirective } from './cell//table-tr.directive';
import { TableTdDirective } from './cell/table-td.directive';
import { TableComponent } from './table.component';
import { ZqPaginationModule } from '../pagination/zq-pagination.module';



@NgModule({
  declarations: [
    TableTrDirective,
    TableTdDirective,
    TableComponent
  ],
  imports: [
    CommonModule,
    ZqPaginationModule
  ],
  exports: [
    TableTrDirective,
    TableTdDirective,
    TableComponent
  ]
})
export class ZqTableModule { }
