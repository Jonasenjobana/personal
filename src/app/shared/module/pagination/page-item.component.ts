import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'li[zq-page-item]',
  template: `
    <div class="zq-page-item  {{type}}">
      {{index}}
    </div>
  `,
  host: {
    class: 'zq-page-li'
  }
})
export class PageItemComponent implements OnInit {
  @Input() index?: number
  @Input() type!: 'prev' | 'next' | 'page' | 'prev_5' | 'next_5'
  @Input() disabled: boolean = false
  constructor() { }

  ngOnInit(): void {
  }
}
