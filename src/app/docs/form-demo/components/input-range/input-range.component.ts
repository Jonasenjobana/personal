import { Component, Input, SimpleChanges } from '@angular/core';
import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';
import { isEmpty, isNumber } from 'lodash';

@Component({
  selector: 'input-range',
  templateUrl: './input-range.component.html',
  styleUrls: ['./input-range.component.less']
})
export class InputRangeComponent {
  @Input() inFormGroup: AbstractControl | null = null;
  /** 动态key */
  @Input() controlNames: { value1: string; value2: string; type?: string } = {
    value1: 'value1',
    value2: 'value2',
    type: 'type'
  };
  @Input() isMinMax: boolean = false;
  @Input() required: boolean = false;
  @Input() validator: ValidatorFn | null = null;
  @Input() inType: string = '~';
  @Input() isNumber: boolean = false;
  @Input() inTypeOpts: string[] = ['=', '<', '≤', '≥', '≠', '>'];
  @Input() isEdit: boolean = true;
  validatorSet: Set<ValidatorFn> = new Set();
  formGroup?: FormGroup;
  preRange?: { value1: string | number; value2: string | number; type: string };
  ngOnChanges(changes: SimpleChanges) {
    const { required, validator, inFormGroup, isRange, isNumber } = changes;
    if (inFormGroup && this.inFormGroup) {
      this.formGroup = this.inFormGroup as FormGroup;
      this.preRange = {
        value1: this.formGroup.value[this.controlNames.value1],
        value2: this.formGroup.value[this.controlNames.value2],
        type: this.formGroup.value[this.controlNames.type!]
      };
      if (required && this.required) {
        this.formGroup.addValidators(this.requiredValidator);
      }
      if (isNumber && this.isNumber) {
        this.formGroup.get('value1')?.valueChanges.subscribe(el => {
          if (Number.isNaN(Number(el)) && el != '-') {
            this.formGroup?.get('value1')?.setValue(parseFloat(this.preRange!.value1 + '' || ''));
          } else {
            this.preRange!.value1 = el;
          }
        });
        this.formGroup.get('value2')?.valueChanges.subscribe(el => {
          if (Number.isNaN(Number(el)) && el != '-') {
            this.formGroup?.get('value2')?.setValue(parseFloat(this.preRange!.value2 + '' || ''));
          } else {
            this.preRange!.value2 = el;
          }
        });
        this.formGroup.addValidators(this.minAndMaxValidator);
      }
      if (validator && this.validator) {
        this.formGroup.addValidators(this.validator);
      }
    }
  }
  /**
   * 处理 负号 小数点 0开头 -0 +0 正号
   * @param value
   */
  setValueToNumber(value: string) {
    if (value[0] == '-') {
    }
  }

  minAndMaxValidator: ValidatorFn = (group: AbstractControl) => {
    const { value1, value2 } = this.controlNames;
    const v1 = Number(group.get(value1)?.value);
    const v2 = Number(group.get(value2)?.value);
    let errMsg: string = '';
    if (Number.isNaN(v1) || Number.isNaN(v2)) {
      errMsg = '需要填写数字！';
    }
    if (v1 <= v2) return null;
    return {
      errMsg
    };
  };
  requiredValidator: ValidatorFn = (group: AbstractControl) => {
    const { value1, value2, type } = this.controlNames;
    const minValue = group.get(value1)?.value;
    const maxValue = group.get(value2)?.value;
    const typeValue = group.get(type!)?.value;
    let errMsg = '';
    if (isEmpty(minValue) || isEmpty(maxValue)) {
      errMsg = '范围不能为空！';
    } else if (!typeValue) {
      errMsg = '类型不能为空！';
    } else {
      return null;
    }
    return {
      errMsg
    };
  };
  ngOnDestroy() {
    this.validatorSet = new Set();
  }
}
