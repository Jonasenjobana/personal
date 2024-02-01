import {
  Component,
  Inject,
  Injector,
  Input,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
  forwardRef
} from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, NgForm, NgModel } from '@angular/forms';
import { Subscription } from 'rxjs';
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
  @Input() inKeys: RangeKey = { value1: 'value1', value2: 'value2', type: 'type' };
  @Input() inRange: [number, number] = [0, 100];
  @Input() inputType: 'number' | 'text' = 'number';
  @ViewChild('ngForm') set ngForm(ngForm: NgForm) {
    this.rangeNgModel = this.injector.get(NgModel);
    ngForm.valueChanges!.subscribe(el => {
      const { valid } = ngForm;
      this.rangeNgModel!.control.setErrors(valid ? null : { errMsg: '校验异常！' });
      this.onChange(el);
    });
  }
  value: any;
  rangeNgModel?: NgModel;
  sub$: Subscription = new Subscription();
  isDisabled: boolean = false;
  onChange: OnChangeType = () => {};
  onTouched: OnTouchedType = () => {};
  constructor(private injector: Injector) {}
  writeValue(obj: any): void {
    this.value = obj;
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
  ngOnDestroy() {
    this.sub$.unsubscribe();
  }
}
type RangeKey = { value1: string; value2: string; type: string };
