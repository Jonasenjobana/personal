import { Component, OnInit } from '@angular/core';
import { ZqModalDirective } from './zq-modal.directive';

@Component({
  selector: 'zq-modal-confirm',
  template: `
    <p>
      zq-modal works!
    </p>
  `,
  styles: [
  ]
})
export class ZqModalConfirmComponent extends ZqModalDirective implements OnInit {
  constructor() {
    super()
  }

  ngOnInit(): void {
  }

}
