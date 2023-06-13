import { Component, forwardRef, Inject, Input, OnInit, Optional, Output, SkipSelf, EventEmitter } from '@angular/core';
import { ZqTableItem } from './type';

@Component({
  selector: 'zq-table',
  template: `
    <col
      [style.width]="col.width + 'px'"
      [style.minWidth]="col.width + 'px'"
      [style.height]="true ? '30px' : '30px'"
      [align]="col?.align || 'center'"
      *ngFor="let col of inCols"
    />
    <thead>
      <tr>
        <th *ngFor="let item of inCols">
          {{ item.title }}
        </th>
      </tr>
    </thead>
    <tbody> </tbody>
    <zq-pagination (pageChange)="onPageChange($event)" (sizeChange)="onSizeChange($event)" [pageRecord]="20"></zq-pagination>
  `,
  host: {
    class: 'zq-table'
  }
})
export class TableComponent<T> implements OnInit {
  @Input() inCols: ZqTableItem<T>[] = [];
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
