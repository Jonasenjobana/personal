import { Directive, Input } from '@angular/core';

@Directive({
  selector: 'input[zq-input]',
  host: {
    class: 'zq-input',
    '[class.zq-input-disabled]': 'disabled',
  }
})
export class ZqInputDirective {
  constructor() { }

}
