import { Component, ViewEncapsulation, effect, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ng-19demo1',
  imports: [],
  templateUrl: './ng19demo1.component.html',
  styleUrl: './ng19demo1.component.less',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Ng19demo1Component),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class Ng19demo1Component implements ControlValueAccessor {
  title = input('');
  value = signal(null);
  writeValue(obj: any): void {
    this.value.set(obj);
  }
  writeEffect = effect(() => {
    console.log(this.value(), 'ddddddddddddd')
  })
  changeFn: any
  touchFn: any
  registerOnChange(fn: any): void {
    this.changeFn = fn;
  }
  registerOnTouched(fn: any): void {
    this.touchFn = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
  }
}
