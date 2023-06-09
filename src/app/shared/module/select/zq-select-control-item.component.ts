import { ZqSelectOption } from './../../types/types';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'zq-select-control-item',
  template: `
    <div>
      {{ label }}
    </div>
  `,
  styles: []
})
export class ZqSelectControlItemComponent implements OnInit {
  @Input() listOfItems: ZqSelectOption[] = [];
  @Input() label: string | number | null = null;
  constructor() {}

  ngOnInit(): void {}
}
