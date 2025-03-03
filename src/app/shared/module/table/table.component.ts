import { PaginationOption } from './../pagination/type';
import { Component, forwardRef, Inject, Input, OnInit, Optional, Output, SkipSelf, EventEmitter } from '@angular/core';
import { ZqTableItem } from './type';
import { TableTrDirective } from './cell/table-tr.directive';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'zq-table',
  template: `
    @for (col of inCols; track $index) {
    <col [style.width]="col.width + 'px'" [style.minWidth]="col.width + 'px'" [style.height]="true ? '30px' : '30px'" [align]="col?.align || 'center'" />
    }
    <thead>
      <tr>
        @for (item of inCols; track $index) {
          <th>
          {{ item.title }}
        </th>
        }
      </tr>
    </thead>
    <tbody> </tbody>
    <zq-pagination (pageChange)="onPageChange($event)" (sizeChange)="onSizeChange($event)" [pageRecord]="20"></zq-pagination>
  `,
  host: {
    class: 'zq-table'
  },
  standalone: true,
  imports: [PaginationComponent]
})
export class TableComponent<T> implements OnInit {
  @Input() inCols: ZqTableItem<T>[] = [];
  @Input() pagination: PaginationOption = new PaginationOption();
  @Output() pageChange: EventEmitter<number> = new EventEmitter();
  @Output() sizeChange: EventEmitter<number> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}
  onPageChange(page: number) {
    this.pageChange.emit(page);
  }
  onSizeChange(size: number) {
    this.sizeChange.emit(size);
  }
}
