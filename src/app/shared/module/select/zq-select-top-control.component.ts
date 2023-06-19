import { ZqSelectOption, ZqSelectType, ZqSelectItem } from './type';
import { Component, EventEmitter, Inject, Input, OnInit, Optional, Output, SimpleChanges } from '@angular/core';
@Component({
  selector: 'zq-select-top-control',
  template: `
    <ng-container [ngSwitch]="selectType">
      <ng-container *ngSwitchDefault>
        <input
          [disabled]="!zqSearch"
          class="zq-select-input"
          zq-input
          [placeholder]="zqPlacement"
          type="text"
          [ngModel]="value"
          (ngModelChange)="onValueChange($event)"
          (blur)="onInputBlur()"
        />
      </ng-container>
      <ng-container *ngSwitchCase="'Tag'">
        <div class="tag-wrapper">
          <div class="tag-item" *ngFor="let item of selectedItem">
            {{ item.label }}
            <span [zqIcon]="'close'" (click)="deleteItem(item, $event)"></span>
          </div>
        </div>
      </ng-container>
    </ng-container>
    <span *ngIf="inClear" class="sufix icon-close" (click)="clearControl($event)"></span>
    <span *ngIf="!inClear" class="sufix icon-down" [class.sufix-active]="isOpen"></span>
  `,
  host: {
    class: 'zq-select-top'
  }
})
export class ZqSelectTopControlComponent implements OnInit {
  @Input() listOfControlItem: ZqSelectOption[] = [];
  @Input() zqSearch!: boolean;
  @Input() inClear!: boolean;
  @Input() selectedItem: ZqSelectItem[] = [];
  @Input() zqPlacement!: string;
  @Input() isOpen: boolean = false;
  @Input() selectType!: ZqSelectType;
  @Output() inputValueChange: EventEmitter<string> = new EventEmitter();
  @Output() inputBlur: EventEmitter<string> = new EventEmitter();
  @Output() outClearControl: EventEmitter<void> = new EventEmitter();
  @Output() deleteItemChange: EventEmitter<ZqSelectItem> = new EventEmitter();
  value: string | number = '';
  ngOnChanges(changes: SimpleChanges) {
    const { selectedItem } = changes;
    if (selectedItem) {
      if (this.selectType === 'Default') {
        this.value = this.selectedItem[0]?.label || '';
      } else {
      }
    }
  }
  constructor() {}
  ngOnInit(): void {}
  onValueChange($event: string) {
    this.inputValueChange.emit($event);
  }
  deleteItem(item: ZqSelectItem, $event: MouseEvent) {
    $event.stopPropagation();
    this.deleteItemChange.emit(item)
  }
  onInputBlur() {
    // this.inputBlur.emit(this.value)
  }
  clearControl($event: MouseEvent) {
    $event.stopPropagation();
    this.outClearControl.emit();
  }
}
