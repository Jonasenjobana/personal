import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ZqSelectOption } from '../../types/types';

@Component({
  selector: 'zq-select-panel',
  template:  `
    <div class="zq-select-option-wraper">
      <div class="zq-option-item" [ngClass]="{'select-base-active': item._checked}" *ngFor="let item of inOptions" (click)="selectItem(item)">
        <span [title]="item.label">{{item.label}}</span>
      </div>
    </div>
  `,
  host: {
    class: 'zq-select-panel'
  }
})
export class ZqSelectPanelComponent implements OnInit {
  @Input() inOptions: ZqSelectOption[] = []
  @Input() inMulti: boolean = false
  @Output() selectChange: EventEmitter<ZqSelectOption[]> = new EventEmitter() 
  constructor() { }

  ngOnInit(): void {
  } 
  selectItem(item: ZqSelectOption) {
    if (!this.inMulti) {
      this.inOptions.forEach(el => {
        if (el !== item) {
          el._checked = false
        }
      })
    }
    item._checked = !item._checked
    this.changeEmit([item])
  }
  changeEmit(item: ZqSelectOption[] = []) {
    this.selectChange.emit(item)
  }
}
