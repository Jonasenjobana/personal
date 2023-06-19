import { ZqButtonModule } from './../button/zq-button.module';
import { ZqDirectiveModule } from './../directive/zq-directive.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZqModalConfirmComponent } from './zq-modal-confirm.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { ZqBaseModalComponent } from './zq-modal.directive';
import {PortalModule} from '@angular/cdk/portal';
import { ZqModalService } from './zq-modal.service';
@NgModule({
  declarations: [ZqModalConfirmComponent, ZqBaseModalComponent],
  imports: [CommonModule, OverlayModule, PortalModule, ZqDirectiveModule, ZqButtonModule],
  exports: [ZqModalConfirmComponent, ZqBaseModalComponent],
  providers: [
    ZqModalService
  ]
})
export class ZqModalModule {}
