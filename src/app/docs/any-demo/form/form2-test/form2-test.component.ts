import { CommonModule } from '@angular/common';
import { Component, forwardRef, inject, viewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, NgControl, NgForm } from '@angular/forms';
import { OnChangeType, OnTouchedType } from 'ng-zorro-antd/core/types';
import { NzInputModule } from 'ng-zorro-antd/input';
import { SlValidatorDirective } from 'src/app/docs/form-demo/components/input-range-tmp/sl-validator.directive';

@Component({
  selector: 'form2-test',
  imports: [FormsModule, NzInputModule,CommonModule, SlValidatorDirective],
  templateUrl: './form2-test.component.html',
  styleUrl: './form2-test.component.less',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Form2TestComponent),
      multi: true
    }
  ]
})
export class Form2TestComponent implements ControlValueAccessor {
  formModel = {
    note: null,
    age: null
  }
  formRef = viewChild('formRef', {read: NgForm});
  private onChangeFn: OnChangeType = () => void 0;
  private onTouchFn: OnTouchedType = () => void 0;


  ngAfterViewInit() {
    this.formRef().valueChanges.subscribe(res => {
      // this.formRef().va
      this.onChangeFn(res);
    })
  }
  writeValue(obj: any): void {
    console.log(obj,'sdaw')
    this.formModel = obj;
  }
  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouchFn = fn;
  }

}
