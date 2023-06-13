import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { PaginationOption } from './type';

@Component({
  selector: 'zq-pagination',
  template: `
    <div class="zq-pagination">
      <zq-page-content
        [pageSize]="pageRecord"
        [total]="pageCount"
        [pageSizeOption]="['15', '20', '30', '50']"
        [currentPage]="currentPage"
        (pageChange)="onPageChange($event)"
        (sizeChange)="onSizeChange($event)"
      ></zq-page-content>
      <div class="page-size"></div>
      <div class="page-jump"></div>
    </div>
  `
})
export class PaginationComponent implements OnInit {
  /** 总页数 */
  @Input() pageRecord: number = 20;
  /** 当前页数 */
  @Input() currentPage: number = 10;
  /** 分页大小 */
  @Input() pageSize: number = 15;
  /** 总条数 */
  @Input() pageCount: number = 233;
  @Input() pageOption: PaginationOption = new PaginationOption();
  @Input() showSize: boolean = false;
  @Input() showJump: boolean = false;
  @Output() pageChange: EventEmitter<number> = new EventEmitter();
  @Output() sizeChange: EventEmitter<number> = new EventEmitter();
  constructor() {}
  ngOnChanges(changes: SimpleChanges) {
    const { pageOption } = changes;
    if (pageOption) {
      this.setOption();
    }
  }
  setOption() {
    const { pageRecord, currentPage, pageSize, pageCount } = this.pageOption;
    this.pageRecord = pageRecord ?? this.pageRecord;
    this.currentPage = currentPage ?? this.currentPage;
    this.pageSize = pageSize ?? this.pageSize;
    this.pageCount = pageCount ?? this.pageCount;
  }
  onPageChange(page: number) {
    this.pageChange.emit(page);
  }
  onSizeChange(size: number) {
    this.sizeChange.emit(size);
  }
  ngOnInit(): void {}
}
