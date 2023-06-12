import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from './pagination.component';
import { PageContentComponent } from './page-content.component';
import { PageItemComponent } from './page-item.component';


@NgModule({
  declarations: [
    PaginationComponent,
    PageContentComponent,
    PageItemComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PaginationComponent
  ]
})
export class ZqPaginationModule { }
