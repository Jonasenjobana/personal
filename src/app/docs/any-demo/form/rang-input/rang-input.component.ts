import { CommonModule } from '@angular/common';
import { Component, Injector, Optional, Self, forwardRef, input } from '@angular/core';
import { AbstractControl, AsyncValidator, ControlValueAccessor, FormControl, FormsModule, NG_ASYNC_VALIDATORS, NG_VALIDATORS, NG_VALUE_ACCESSOR, NgControl, NgForm, NgModel, ValidationErrors, Validator } from '@angular/forms';
import { OnChangeType, OnTouchedType } from 'ng-zorro-antd/core/types';
import { NzInputModule } from 'ng-zorro-antd/input';
import { isNotEmpty } from 'src/app/shared/utils/common.util';

@Component({
  selector: 'rang-input',
  imports: [NzInputModule, CommonModule, FormsModule],
  templateUrl: './rang-input.component.html',
  styleUrl: './rang-input.component.less',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RangInputComponent),
      multi: true
    },
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: forwardRef(() => RangInputComponent),
      multi: true
    }
  ],
  exportAs: 'rangInput'
})
export class RangInputComponent implements ControlValueAccessor, AsyncValidator {
  private modelValue: {min: number, max: number} = null;
  private disabled: boolean = false;
  public minValue: any
  public maxValue: any
  constructor(@Optional() private ngForm: NgForm, @Self() private inject: Injector) {
  }
  private onChangeFn: OnChangeType = () => void 0;
  private onTouchFn: OnTouchedType = () => void 0;
  public onValidateFn: () => void = () => void 0;
  public writeValue(obj: any): void {
    this.modelValue = obj;
    console.log(this.minValue,this.maxValue)
    this.minValue = obj?.min || null;
    this.maxValue = obj?.max || null;
  }
  public registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }
  public registerOnTouched(fn: any): void {
    this.onTouchFn = fn;
  }
  public setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  public registerOnValidatorChange(fn: () => void): void {
    this.onValidateFn = fn;
  }
  public validate(control: AbstractControl<any, any>) {
    const {value} = control;
    const {min, max} = value || {};
    let error = null;
    return new Promise(res => {
      if (isNotEmpty(min) && isNotEmpty(max)) {
        if (Number(min) > Number(max)) {
          error = {error: '最小值不能大于最大值'}
        }
      }
      res(error);
    })
  }
  // registerOnValidatorChange?(fn: () => void): void {
  //   throw new Error('Method not implemented.');
  // }
  public onValueChange($event: any, type: 'min' | 'max') {
    this.modelValue[type] = $event;
    this.onChangeFn(this.modelValue);
  }
}
