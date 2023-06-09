import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { ZqSelectOption } from '../../types/types';

@Component({
  selector: 'zq-select-panel',
  template: `
    <div class="zq-select-option-wraper" [ngStyle]="{ maxHeight: inOptionHeight ? inOptionHeight + 'px' : 'auto' }">
      <ng-container *ngIf="options.length">
        <div
          class="zq-option-item"
          [ngClass]="{ 'select-base-active': item.checked }"
          *ngFor="let item of options"
          (click)="selectItem(item)"
        >
          <span [title]="item.label">{{ item.label }}</span>
        </div>
      </ng-container>
      <ng-container *ngIf="!options.length">
        <zq-empty-box></zq-empty-box>
      </ng-container>
    </div>
  `,
  host: {
    class: 'zq-select-panel'
  }
})
export class ZqSelectPanelComponent implements OnInit {
  @Input() inOptionHeight?: number | string;
  @Input('inOptions') options: ZqSelectOption[] = [];
  @Input() inMulti: boolean = false;
  @Output() selectChange: EventEmitter<ZqSelectOption[]> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}
  selectItem(item: ZqSelectOption) {
    if (!this.inMulti) {
      this.options.forEach(el => {
        if (el !== item) {
          el.checked = false;
        }
      });
    }
    item.checked = !item.checked;
    this.changeEmit([item]);
  }
  changeEmit(item: ZqSelectOption[] = []) {
    this.selectChange.emit(item);
  }
}
