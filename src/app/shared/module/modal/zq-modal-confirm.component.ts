import { CdkPortalOutlet } from '@angular/cdk/portal';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ZqBaseModalComponent } from './zq-modal.directive';

@Component({
  selector: 'zq-modal-confirm',
  template: `
    <div class="zq-modal-confirm">
      <div class="zq-modal-header">
        <span>×</span>
      </div>
      <div class="zq-modal-content">
        <ng-template cdkPortalOutlet></ng-template>
      </div>
      <div class="zq-modal-footer">
        123footer
      </div>
    </div>
  `
})
export class ZqModalConfirmComponent extends ZqBaseModalComponent implements OnInit {
  @ViewChild(CdkPortalOutlet, { static: true }) override contentPortal!: CdkPortalOutlet;
  constructor() {
    super();
  }

  ngOnInit(): void {}
}
