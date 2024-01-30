import { Directive, ElementRef, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, NgModel, ValidationErrors, Validator } from '@angular/forms';
@Directive({
  selector: '[slValidator]',
  providers:  [{provide: NG_VALIDATORS, useExisting: SlValidatorDirective, multi: true}]
})
export class SlValidatorDirective implements Validator {
  @Input() slValidator!: SLValidator
  constructor(private elementRef: ElementRef, private ngModel: NgModel) { 
    console.log(ngModel,'ngModel');
    
  }
  validate(control: AbstractControl<any, any>): ValidationErrors | null {
    return null
  }
}
export interface SLValidator {
  type: 'number' | 'int+' | 'int0+',
  required?: boolean
  regExp?: RegExp
  label?: string
  errorTip?: string
}