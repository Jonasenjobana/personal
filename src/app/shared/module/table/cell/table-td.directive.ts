import { Directive } from '@angular/core';

@Directive({
  selector: '[zqTableTd]',
  host: {
    class: 'zq-td',
  }
})
export class TableTdDirective {

  constructor() { }

}
