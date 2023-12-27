import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { isNotEmpty } from '../../utils/common.util';

@Directive({
  selector: '[zq-validate]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: ZqValidateDirective, multi: true },
  ],
})
export class ZqValidateDirective implements Validator {
  @Input('zq-validate') zqValidate: ZqValidateOption = {}
  constructor() { }
  validate(control: AbstractControl<any, any>): ValidationErrors | null {
    if (!this.zqValidate) return null
    const {required, errorTip} = this.zqValidate
    const value = control.value
    if (required) {
      if (!isNotEmpty(value)) {
        return {errorTip}
      }
    } if (isNotEmpty(value)) {
      // 走自定义判断
    }
    return null
  }
}
export type ZqValidatorType = 'phone' | 'email' | 'idCard' | 'number' | 'url' | 'regex' | 'required' | 'minLength' | 'maxLength' | 'min' | 'max' | 'custom' | 'customAsync';
export interface ZqValidateOption {
  required?: boolean;// 是否必填
  errorTip?: string; // 错误提示
  type?: ZqValidatorType;// 校验类型
  label?: string; // 提示前缀 
  regex?: RegExp;// 正则表达式
  minLength?: number;// 最小长度
  maxLength?: number;// 最大长度
  min?: number;// 最小值
  max?: number;// 最大值
  custom?: (value?: any) => boolean;// 自定义校验
  customAsync?: (value?: any) => Promise<boolean>;// 异步自定义校验
  customAsyncDelay?: number;// 异步自定义校验延迟
}