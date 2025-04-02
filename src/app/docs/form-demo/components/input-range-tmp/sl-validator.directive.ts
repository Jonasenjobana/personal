import { Directive, ElementRef, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, NgModel, ValidationErrors, Validator } from '@angular/forms';
@Directive({
  selector: '[slValidator]',
  providers:  [{provide: NG_VALIDATORS, useExisting: SlValidatorDirective, multi: true}]
})
export class SlValidatorDirective implements Validator {
  @Input() slValidator!: SLValidator
  constructor(private elementRef: ElementRef) { 
  }
  validate(control: AbstractControl<any, any>): ValidationErrors | null {
    const {type} = this.slValidator;
    if (type == 'require') {
      if (!control.value) return {
        require: 'need'
      }
    }
    return null
  }
}
export interface SLValidator {
  type: 'require' | 'number' | 'int+' | 'int0+',
  required?: boolean
  regExp?: RegExp
  label?: string
  errorTip?: string
}