import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { ZqSelectOption, ZqSelectItem } from './type';

@Component({
  selector: 'zq-select-panel',
  template: `
    <div class="zq-select-option-wraper" [ngStyle]="{ maxHeight: inOptionHeight ? inOptionHeight + 'px' : 'auto' }">
      <ng-container *ngIf="listOfTemplate.length">
        <zq-select-item
          *ngFor="let item of listOfTemplate"
          [label]="item.label"
          [value]="item.value"
          [listOfSelected]="listOfSelected"
          (click)="selectItem(item)"
        ></zq-select-item>
      </ng-container>
      <ng-container *ngIf="!listOfTemplate.length">
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
  @Input() listOfTemplate: ZqSelectItem[] = [];
  @Input() listOfSelected: ZqSelectItem[] = [];
  @Input() inMulti: boolean = false;
  @Output() selectChange: EventEmitter<ZqSelectItem> = new EventEmitter();
  constructor() {}
  ngOnInit(): void {}
  selectItem(item: ZqSelectItem) {
    this.changeEmit(item);
  }
  
  changeEmit(item: ZqSelectItem) {
    this.selectChange.emit(item);
  }
}
