import { ZqBaseModalConfig, ZqModalConfig } from './type';
import { CdkPortalOutlet } from '@angular/cdk/portal';
import { Component, OnInit, ViewChild, TemplateRef, Input, Inject } from '@angular/core';
import { ZqBaseModalComponent } from './zq-modal.directive';

@Component({
  selector: 'zq-modal-confirm',
  template: `
    <div class="zq-modal-confirm">
      <div class="zq-modal-header">
        <div>
          <span [zqIcon]="'close'" iconSize="lg" [right]="10" (click)="onCloseModal()"></span>
        </div>
      </div>
      <div class="zq-modal-content">
        <ng-template cdkPortalOutlet></ng-template>
      </div>
      <div class="zq-modal-footer">
        <button zq-button (click)="onCloseModal()">{{ textClose }}</button>
        <button zq-button [zqType]="'primary'" (click)="onOkModal()">{{ textOk }}</button>
      </div>
    </div>
  `,
  styleUrls: ['./zq-modal-confirm.less']
})
export class ZqModalConfirmComponent extends ZqBaseModalComponent implements OnInit {
  @Input() textClose: string = '取消';
  @Input() textOk: string = '保存';
  @ViewChild(CdkPortalOutlet, { static: true }) override contentPortal!: CdkPortalOutlet;
  constructor(public config: ZqBaseModalConfig) {
    super();
    
  }

  ngOnInit(): void {}
}
