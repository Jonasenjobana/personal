import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'zq-button-group',
  template: `<ng-content></ng-content>`,
})
export class ZqButtonGroupComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
