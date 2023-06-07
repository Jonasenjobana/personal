import { Component, Input, OnInit, TemplateRef } from '@angular/core';

@Component({
  selector: 'zq-input-group',
  template: `
    <span class=""></span>
  `,
})
export class ZqInputGroupComponent implements OnInit {
  @Input() zqPrefix?: string | TemplateRef<void>
  @Input() zqSuffix?: string | TemplateRef<void>
  constructor() { }

  ngOnInit(): void {
  }

}
