
import { Component, Input, OnInit, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { ZqSelectOption } from '../select/type';
import { PageItemComponent } from './page-item.component';

@Component({
  selector: 'zq-page-content',
  template: `
    <ul class="zq-page-ul">
      <li
        zq-page-item
        *ngFor="let item of listOfPageItem"
        [index]="item.index"
        [type]="item.type!"
        [disabled]="item.disabled"
        [currentIndex]="currentPage"
        (click)="onPageChange(item)"
      ></li>
      <li>
        <span>显示</span>
        <zq-select
          style="width: 45px;"
          [ngModel]="pageSize"
          [inClear]="false"
          [zqOptions]="pageSelectOption"
          (selectItemChange)="onSizeChange($event)"
        ></zq-select>
        <span>条</span>
      </li>
      <li>
        <span>，跳转至</span>
        <input zq-input style="width: 20px;" (keydown.enter)="jumpToPageViaInput($event)" />
        <span>页</span>
      </li>
    </ul>
  `
})
export class PageContentComponent implements OnInit {
  @Input() currentPage!: number;
  @Input() total!: number;
  @Input() pageSize!: number;
  @Input() pageSizeOption: string[] = [];
  @Output() pageChange: EventEmitter<number> = new EventEmitter();
  @Output() sizeChange: EventEmitter<number> = new EventEmitter();
  pageSelectOption: ZqSelectOption[] = [];
  listOfPageItem: Array<Partial<PageItemComponent>> = [];
  constructor() {}
  ngOnChanges(changes: SimpleChanges) {
    const { currentPage, total, pageSize, pageSizeOption } = changes;
    if (currentPage || total || pageSize) {
      this.buildIndex();
    }
    if (pageSizeOption) {
      this.pageSelectOption = this.pageSizeOption.map(el => {
        return {
          label: el,
          value: el
        };
      });
    }
  }
  jumpToPageViaInput($event: Event) {
    const target = $event.target as HTMLInputElement;
    this.currentPage = Number(target.value);
    this.currentPage = this.validPage();
    this.buildIndex()
    this.pageChange.emit(this.currentPage);
    target.value = '';
  }
  validPage() {
    const lastIndex = this.getLastIndex(this.total, this.pageSize);
    return lastIndex < this.currentPage ? lastIndex : this.currentPage <= 0 ? 1 : this.currentPage;
  }
  onSizeChange(item: ZqSelectOption[]) {
    const size = Number(item[0].label);
    if (this.pageSize == size) return;
    this.pageSize = size;
    this.currentPage = this.validPage();
    this.buildIndex();
    this.sizeChange.emit(Number(item[0].label));
    this.pageChange.emit(this.currentPage);
  }
  onPageChange(item: Partial<PageItemComponent>) {
    if (!!item.disabled) return;
    if (['prev_5', 'next_5'].includes(item.type!)) {
      this.currentPage = item.type === 'prev_5' ? this.currentPage - 5 : this.currentPage + 5;
    } else if (['prev', 'next'].includes(item.type!)) {
      this.currentPage = item.type === 'prev' ? this.currentPage - 1 : this.currentPage + 1;
    } else {
      this.currentPage = item.index!;
    }
    this.pageChange.emit(this.currentPage);
    this.buildIndex();
  }
  ngOnInit(): void {}
  buildIndex() {
    const lastIndex = this.getLastIndex(this.total, this.pageSize);
    this.listOfPageItem = this.genIndex(this.currentPage, lastIndex);
  }
  getLastIndex(total: number, pageSize: number) {
    return Math.ceil(total / pageSize);
  }
  genIndex(currentIndex: number, lastIndex: number) {
    const concatWithPrevNext = (listOfItems: Array<Partial<PageItemComponent>>): Array<Partial<PageItemComponent>> => {
      const prevItem: Partial<PageItemComponent> = {
        type: 'prev',
        disabled: currentIndex === 1
      };
      const nextItem: Partial<PageItemComponent> = {
        type: 'next',
        disabled: currentIndex === lastIndex
      };
      return [prevItem, ...listOfItems, nextItem];
    };
    const generatePageItems = (start: number, end: number): Array<Partial<PageItemComponent>> => {
      const list: Array<Partial<PageItemComponent>> = [];
      for (let i = start; i <= end; i++) {
        list.push({
          index: i,
          type: 'page'
        });
      }
      return list;
    };
    if (lastIndex <= 9) {
      return concatWithPrevNext(generatePageItems(1, lastIndex));
    } else {
      const generateRangeItems = (selected: number, last: number): Array<Partial<PageItemComponent>> => {
        let list: Array<Partial<PageItemComponent>> = [];
        const firstItem = generatePageItems(1, 1);
        const lastItem = generatePageItems(lastIndex, lastIndex);
        const prev: Partial<PageItemComponent> = {
          type: 'prev_5'
        };
        const next: Partial<PageItemComponent> = {
          type: 'next_5'
        };
        if (selected < 5) {
          const maxLeft = selected === 4 ? 6 : 5;
          list = [...generatePageItems(2, maxLeft), next];
        } else if (selected < last - 4) {
          list = [prev, ...generatePageItems(selected - 2, selected + 2), next];
        } else {
          const minRight = selected === last - 4 ? last - 5 : last - 4;
          list = [prev, ...generatePageItems(minRight, last - 1)];
        }
        return [...firstItem, ...list, ...lastItem];
      };
      return concatWithPrevNext(generateRangeItems(currentIndex, lastIndex));
    }
  }
}
