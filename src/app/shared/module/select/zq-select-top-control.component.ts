import { ZqSelectOption } from './../../types/types';
import { Component, EventEmitter, Inject, Input, OnInit, Optional, Output, SimpleChanges } from '@angular/core';
import { ZqSelectService } from './zq-select.service';

@Component({
  selector: 'zq-select-top-control',
  template: `
    <ng-container [ngSwitch]="controlMode">
      <ng-container *ngSwitchDefault>
        <input
          class="zq-select-input"
          zq-input
          [disabled]="controlMode !== 'search'"
          [placeholder]="zqPlacement"
          type="text"
          [(ngModel)]="searchValue"
          (ngModelChange)="onValueChange($event)"
          (blur)="onInputBlur()"
        />
      </ng-container>
      <ng-container *ngSwitchCase="'multi'"> 123 </ng-container>
    </ng-container>
    <span class="select-clear" (click)="clearControl($event)">×</span>
  `,
  host: {
    class: "zq-select-top"
  }
})
export class ZqSelectTopControlComponent implements OnInit {
  @Input() listOfControlItem: ZqSelectOption[] = []
  @Input() searchValue!: string;
  @Input() inClear!: boolean
  @Input() zqPlacement!: string
  @Input() controlMode: 'search' | 'tag' | null = null;
  @Output() inputValueChange: EventEmitter<string> = new EventEmitter();
  @Output() inputBlur: EventEmitter<string> = new EventEmitter();
  @Output() outClearControl: EventEmitter<void> = new EventEmitter();
  constructor(@Optional()private selectService: ZqSelectService | null) {}
  ngOnInit(): void {
    if (this.selectService) {
      this.selectService.valueSub$.subscribe(value => {
        this.searchValue = value 
      })
    }
  }
  onValueChange($event: string) {
    this.inputValueChange.emit($event);
  }
  onInputBlur() {
    this.inputBlur.emit(this.searchValue)
  }
  clearControl($event: MouseEvent) {
    $event.stopPropagation()
    this.outClearControl.emit()
  }
}
