import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';

@Component({
  selector: 'li[zq-page-item]',
  template: `
    <div class="zq-page-item  {{ type }}" [class.actived-item]="index === currentIndex" [class.disabled-item]="!!disabled">
      {{ index }}
    </div>
  `,
  host: {
    class: 'zq-page-li'
  }
})
export class PageItemComponent implements OnInit {
  @Input() index?: number;
  @Input() type: 'prev' | 'next' | 'page' | 'prev_5' | 'next_5' = 'page';
  @Input() disabled?: boolean | undefined = undefined;
  @Input() currentIndex!: number;
  constructor() {}

  ngOnInit(): void {}
}
