import { Directive, ElementRef, Input, SimpleChanges } from '@angular/core';
import { SLValidator } from './sl-validator.directive';
import { AbstractControl, MaxValidator, MinValidator, NG_VALIDATORS, NgModel, Validator } from '@angular/forms';
import { isEmpty } from 'lodash';

@Directive({
  selector: '[slNumberValidator]',
  providers:  [{provide: NG_VALIDATORS, useExisting: SlNumberValidatorDirective, multi: true}]
})
export class SlNumberValidatorDirective implements Validator {
  @Input() inMin?: number
  @Input() inMax?: number

  constructor() {
  }
  validate(control: AbstractControl) {
    const {inMin, inMax} = this;
    const {value} = control
    if (inMax && value > inMax) {
      return {err: 'sss'}
    }
    if (inMin && value < inMin) {
      return {err: 'sss'}
    }
    return null
  }
}
