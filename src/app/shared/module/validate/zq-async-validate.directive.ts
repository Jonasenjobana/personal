import { Directive, Input } from '@angular/core';
import { AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, NG_VALIDATORS, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { ZqValidateOption } from './zq-validate.directive';

@Directive({
  selector: '[zqAsyncValidate]',
  providers: [
    { provide: NG_ASYNC_VALIDATORS, useExisting: ZqAsyncValidateDirective, multi: true },
  ],
})
export class ZqAsyncValidateDirective implements AsyncValidator {
  @Input('zq-validate') zqValidate: ZqValidateOption = {}
  constructor() { }
  validate(control: AbstractControl<any, any>): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    const {customAsync, customAsyncDelay = 0, errorTip} = this.zqValidate
    if (customAsync && typeof customAsync === 'function') {
      return customAsync().then(flag => {
        if (!flag) {
          return {errorTip}
        } else {
          return null
        }
      })
    }
    return Promise.resolve(null)
  }
  // registerOnValidatorChange?(fn: () => void): void {
  //   throw new Error('Method not implemented.');
  // }

}
