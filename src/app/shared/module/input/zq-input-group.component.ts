import { Component, Input, OnInit, TemplateRef } from '@angular/core';

@Component({
  selector: 'zq-input-group',
  template: `
    <span class="zq-input-group-wraper">
      <span></span>
    </span>
  `,
})
export class ZqInputGroupComponent implements OnInit {
  @Input() zqPrefix?: string | TemplateRef<void>
  @Input() zqSuffix?: string | TemplateRef<void>
  constructor() { }

  ngOnInit(): void {
  }

}
