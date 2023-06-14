import { ZqSelectOption, ZqSelectType } from './type';
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
      <ng-container *ngSwitchCase="'Tag'"> 123 </ng-container>
    </ng-container>
    <span *ngIf="inClear" class="sufix icon-close" (click)="clearControl($event)"></span>
    <span *ngIf="!inClear" class="sufix icon-down" [class.sufix-active]="isOpen"></span>
  `,
  host: {
    class: "zq-select-top"
  }
})
export class ZqSelectTopControlComponent implements OnInit {
  @Input() listOfControlItem: ZqSelectOption[] = []
  @Input() value!: (string|number|null)[];
  @Input() zqSearch!: boolean
  @Input() inClear!: boolean
  @Input() zqPlacement!: string
  @Input() selectType!: ZqSelectType
  @Output() inputValueChange: EventEmitter<string> = new EventEmitter();
  @Output() inputBlur: EventEmitter<string> = new EventEmitter();
  @Output() outClearControl: EventEmitter<void> = new EventEmitter();
  isOpen: boolean = false
  constructor() {}
  ngOnInit(): void {
  }
  onValueChange($event: string) {
    this.inputValueChange.emit($event);
  }
  onInputBlur() {
    // this.inputBlur.emit(this.value)
  }
  clearControl($event: MouseEvent) {
    $event.stopPropagation()
    this.outClearControl.emit()
  }
}
