import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ZqSelectComponent } from './zq-select.component'
import { OverlayModule } from '@angular/cdk/overlay';
import { ZqSelectPanelComponent } from './zq-select-panel.component'

@NgModule({
  declarations: [ZqSelectComponent, ZqSelectPanelComponent],
  imports: [CommonModule, OverlayModule],
  exports: [ZqSelectComponent],
})
export class ZqSelectModule {}
