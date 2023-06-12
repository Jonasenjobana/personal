import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: 'tr[zqTableTr]',
  host: {
    class: 'zq-tr',
    
  }
})
export class TableTrDirective {

  constructor(private elementRef: ElementRef) {

  }

}
