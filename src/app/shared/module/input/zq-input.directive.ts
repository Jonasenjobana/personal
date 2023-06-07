import { Directive, Input, Optional, Self, SimpleChanges } from '@angular/core';
import { NgControl } from '@angular/forms';
export type ZqInputType = 'num' | null
@Directive({
  selector: 'input[zq-input]',
  host: {
    class: 'zq-input',
    '[class.zq-input-disabled]': 'disabled',
  },
  providers: []
})
export class ZqInputDirective{
  @Input() inputType: ZqInputType = null
  private _value: any
  constructor(@Optional() @Self() public ngControl: NgControl) {
    
  }

  ngOnInit() {
    if (this.ngControl) {
      this.ngControl.valueChanges?.subscribe(value => {
        this._value = value
      })
    }
  }
  
}
