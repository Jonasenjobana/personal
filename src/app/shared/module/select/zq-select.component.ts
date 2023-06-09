import { copyDeep } from 'src/app/shared/utils/common.util';
import { ZqSelectOption, ControlMode } from './../../types/types';
import { ConnectedOverlayPositionChange } from '@angular/cdk/overlay';
import { Component, OnInit, ViewChild, ElementRef, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ZqSelectType } from '../../types/types';
import { ZqSelectService } from './zq-select.service';
@Component({
  selector: 'zq-select',
  template: `
    <div
      class="zq-select-wraper"
      [ngClass]="{ 'zq-select-active': isOpen }"
      cdkOverlayOrigin
      #triggerOrigin="cdkOverlayOrigin"
      (click)="openSelect()"
    >
      <div class="select-show">
        <zq-select-top-control
          style="width: 100%;"
          [zqPlacement]="zqPlacement"
          [listOfControlItem]="listOfControlItem"
          [inClear]="inClear"
          [searchValue]="searchValue"
          [controlMode]="controlMode"
          (inputBlur)="onInputBlur($event)"
          (outClearControl)="onClear()"
          (inputValueChange)="onInputValueChange($event)"
        ></zq-select-top-control>
      </div>
    </div>
    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="triggerOrigin"
      [cdkConnectedOverlayOpen]="isOpen"
      [cdkConnectedOverlayWidth]="trigerWidth"
      [cdkConnectedOverlayFlexibleDimensions]="true"
      (overlayOutsideClick)="outSideClick()"
    >
      <ng-container [ngSwitch]="selectType">
        <ng-container *ngSwitchDefault>
          <zq-select-panel
            [inOptionHeight]="inOptionHeight"
            [inOptions]="options"
            (selectChange)="onSelectChange($event)"
          ></zq-select-panel>
        </ng-container>
      </ng-container>
    </ng-template>
  `,
  host: {
    class: 'zq-select'
  },
  providers: [
    ZqSelectService
  ]
})
export class ZqSelectComponent implements OnInit {
  trigerWidth!: number;
  isOpen: boolean = false;
  triggerElement!: HTMLDivElement;
  listOfControlItem: ZqSelectOption[] = [];
  selectedItem: ZqSelectOption[] = [];
  inOptionSnap: ZqSelectOption[] = [];
  options: ZqSelectOption[] = [];
  controlMode: ControlMode = null;
  private _searchValue: string = ''
  @Input() zqPlacement: string = '请选择选项';
  @Input() zqSearch: boolean = false;
  @Input() selectType: ZqSelectType = null;
  @Input() inView: boolean = false;
  @Input() inClear: boolean = false;
  @Input() inMulti: boolean = false;
  @Input() inSearch: boolean = false;
  @Input() zqOptions: ZqSelectOption[] = [];
  @Input() inOptionHeight?: number | string;
  @Output() selectChange: EventEmitter<ZqSelectOption[]> = new EventEmitter();
  @ViewChild('triggerOrigin', { static: true, read: ElementRef })
  triggerOrigin!: ElementRef<HTMLDivElement>;
  get searchValue() {
    return this._searchValue
  }
  set searchValue(value: string) {
    this._s.valueSub$.next(value)
    this._searchValue = value
  }
  constructor(private _s: ZqSelectService) {}
  outSideClick() {
    this.isOpen = false;
  }
  ngOnInit(): void {
    this.triggerElement = this.triggerOrigin.nativeElement;
    this.updateTrigerSize();
  }
  ngOnChanges(changes: SimpleChanges) {
    const { zqOptions, zqSearch } = changes;
    if (zqOptions) {
      this.inOptionSnap = copyDeep(this.zqOptions);
      this.options = this.zqOptions.filter(el => !el.hide).map(el => {
        return {
          ...el
        };
      });
    }
    if (zqSearch) {
      this.controlMode = 'search';
    }
  }
  updateTrigerSize() {
    if (!this.triggerElement) return;
    const { width } = this.triggerElement.getBoundingClientRect();
    this.trigerWidth = width;
  }
  openSelect() {
    this.updateTrigerSize();
    this.isOpen = !this.isOpen;
  }
  onSelectChange(item: ZqSelectOption[]) {
    this.selectedItem = item;
    this.searchValue = item[0].label;
    this.isOpen = false;
    this.selectChange.emit(item);
  }
  onClear() {
    this.selectedItem = [];
    this.options = this.inOptionSnap.filter(el => !el.hide)
    this.searchValue = ''
    this._s.valueSub$.next(this.searchValue)
    this.selectChange.emit([]);
  }
  onInputValueChange($event: string) {
    this.options = this.inOptionSnap.filter(el => el.label.includes($event) || $event === '');
  }
  onInputBlur(value: string) {
    if (this.options.findIndex(el => el.label === value) === -1) {   
      this.options = this.inOptionSnap;
      this._s.valueSub$.next(this.searchValue)
    } else {
        this.searchValue = value
    }
  }
}
