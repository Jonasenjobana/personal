import { Component, Inject, Injector, Input, QueryList, SimpleChanges, ViewChild, ViewChildren, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, NgForm, NgModel } from '@angular/forms';
import {
  Subscription,
} from 'rxjs';
import { OnChangeType, OnTouchedType } from 'src/app/shared/module/table/type';
@Component({
  selector: 'input-range-tmp',
  templateUrl: './input-range-tmp.component.html',
  styleUrls: ['./input-range-tmp.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputRangeTmpComponent),
      multi: true
    }
  ]
})
export class InputRangeTmpComponent implements ControlValueAccessor {
  @Input() inType: string = '~';
  @Input() inModel: any;
  @Input() inKeys: RangeKey = { value1: 'value1', value2: 'value2', type: 'type' };
  @Input() inRange: [number, number] = [0, 100]
  @Input() inputType: 'number' | 'text' = 'number';
  @ViewChild('ngForm') set ngForm(value: NgForm) {
    this.rangeNgModel = this.injector.get(NgModel);
    value.valueChanges!.subscribe(el => {
      const {valid} = value;
      this.setModel(el)
      this.rangeNgModel!.control.setErrors(valid ? null : {errMsg: 'error!'});
      this.rangeNgModel!.control.setValue(this.inModel);
      console.log(this.rangeNgModel);
    })
  }
  rangeNgModel?: NgModel
  modelGroup: FormControl[] = [];
  model: any = {
    value1: '',
    value2: '',
    type: ''
  };
  sub$: Subscription = new Subscription();
  isDisabled: boolean = false;
  onChange: OnChangeType = () => {};
  onTouched: OnTouchedType = () => {};
  constructor(private injector: Injector) {
  }
  writeValue(obj: any): void {
    this.inModel = obj;
    this.initModel();
  }
  registerOnChange(fn: OnChangeType): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: OnTouchedType): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
  ngOnChanges(changes: SimpleChanges) {
    const { inModel, inKeys, inRange } = changes;
    if (inModel || inKeys) {
      this.initModel();
    }
  }
  setModel(el: any) {
    Object.keys(this.inKeys).forEach(key => {
      this.inModel[this.inKeys[key as keyof RangeKey]] = el[key]
      console.log(this.inKeys[key as keyof RangeKey], key);
      
    })
    console.log(this.inKeys);
    
  }
  initModel() {
    if (this.inModel && this.inKeys) {
      Object.keys(this.inKeys).forEach(key => {
        this.model[key] = this.inModel[this.inKeys[key as keyof RangeKey]];
      });
    }
  }
  ngAfterViewInit() {
  }
  ngOnDestroy() {
    this.sub$.unsubscribe();
  }
}
type RangeKey = { value1: string; value2: string; type: string };
