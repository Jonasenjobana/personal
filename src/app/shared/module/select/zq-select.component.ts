import { copyDeep } from 'src/app/shared/utils/common.util';
import { ZqSelectOption, ZqSelectItem } from './type';
import { ConnectedOverlayPositionChange } from '@angular/cdk/overlay';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  SimpleChanges,
  Output,
  EventEmitter,
  Inject,
  forwardRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { OnChangeType, OnTouchedType } from '../table/type';
import { BehaviorSubject, combineLatest, combineLatestWith, map, filter } from 'rxjs';
import { ZqSelectType } from './type';
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
          [inClear]="inClear"
          [value]="value"
          [zqSearch]="zqSearch"
          [selectType]="selectType"
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
            [listOfTemplate]="listOfTemplate"
            [listOfSelected]="selectedItem"
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
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ZqSelectComponent),
      multi: true
    }
  ]
})
export class ZqSelectComponent implements OnInit, ControlValueAccessor {
  trigerWidth!: number;
  isOpen: boolean = false;
  triggerElement!: HTMLDivElement;
  selectedItem: ZqSelectItem[] = [];
  listOfTemplate: ZqSelectItem[] = [];
  listOfOptions: ZqSelectOption[] = [];
  value: (string | number | null)[] = [];
  listOfValue: any[] = [];
  private listOfValue$ = new BehaviorSubject<any[]>([]);
  private listOfTemplateItem$ = new BehaviorSubject<ZqSelectOption[]>([]);
  onChange: OnChangeType = () => {};
  onTouched: OnTouchedType = () => {};
  @Input() zqPlacement: string = '请选择选项';
  /** 搜索 */
  @Input() zqSearch: boolean = false;
  /** 多选标签 带有删除单个标签 */
  @Input() selectType: ZqSelectType = 'Default';
  /** 禁用*/
  @Input() inDisabled: boolean = false;
  /** 清除按钮 */
  @Input() inClear: boolean = false;
  /** 多选 */
  @Input() inMulti: boolean = false;
  @Input() zqOptions: Array<ZqSelectOption> = [];
  // 选择器下拉高度
  @Input() inOptionHeight?: number | string;
  @Input() compareTo: (a: any, b: any) => boolean = (a: any, b: any) => a === b;
  @Output() selectItemChange: EventEmitter<ZqSelectItem[]> = new EventEmitter();
  @ViewChild('triggerOrigin', { static: true, read: ElementRef })
  triggerOrigin!: ElementRef<HTMLDivElement>;
  constructor() {}
  writeValue(obj: any | any[]): void {
    if (this.value !== obj) {
      this.value = obj;
      const convertToList = (model: any, mode: ZqSelectType) => {
        // 数组形式保存
        if (model === null || model === undefined) {
          return [];
        } else if (mode === 'Default') {
          return [model];
        } else {
          return model;
        }
      };
      const listOfValue = convertToList(obj, this.selectType);
      this.listOfValue = listOfValue;
      this.listOfValue$.next(listOfValue);
    }
  }
  registerOnChange(fn: OnChangeType): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: OnTouchedType): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.inDisabled = isDisabled;
  }
  outSideClick() {
    this.isOpen = false;
  }
  ngOnInit(): void {
    this.triggerElement = this.triggerOrigin.nativeElement;
    this.listOfValue$
      .pipe(combineLatestWith(this.listOfTemplateItem$))
      .subscribe(([selectedValue, templateList]: any) => {
        this.listOfTemplate = templateList;
        this.selectedItem = selectedValue
          .map((value: any) => {
            return [...templateList].find(o => o.value == value);
          })
          .filter((item: any) => !!item);
      });
    this.updateTrigerSize();
  }
  initOption() {}
  ngOnChanges(changes: SimpleChanges) {
    const { zqOptions } = changes;
    if (zqOptions) {
      this.listOfOptions = this.zqOptions || [];
      const listOfTemplate = this.listOfOptions
        .filter(el => !el.hide)
        .map(el => {
          return {
            ...el,
            type: this.selectType
          };
        });
      this.listOfTemplateItem$.next(listOfTemplate);
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
  onSelectChange(item: ZqSelectItem[]) {
    this.selectedItem = item;
    this.value = [...item.map(el => el.label)];
    this.isOpen = this.inMulti || false;
    this.selectItemChange.emit(item);
  }
  onClear() {}
  onInputValueChange($event: string) {}
  onInputBlur(value: string) {}
  ngOnDestory() {}
}
