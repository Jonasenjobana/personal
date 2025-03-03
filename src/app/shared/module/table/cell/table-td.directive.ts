import { Directive } from '@angular/core';

@Directive({
  selector: '[zqTableTd]',
  host: {
    class: 'zq-td',
  },
  standalone: true
})
export class TableTdDirective {

  constructor() { }

}
