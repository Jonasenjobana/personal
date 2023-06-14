import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZqModalConfirmComponent } from './zq-modal-confirm.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { ZqModalDirective } from './zq-modal.directive';

@NgModule({
  declarations: [ZqModalConfirmComponent, ZqModalDirective],
  imports: [CommonModule, OverlayModule],
  exports: []
})
export class ZqModalModule {}
