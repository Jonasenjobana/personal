import { FormsModule } from '@angular/forms';
import { ZqInputModule } from './../input/zq-input.module';
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ZqSelectComponent } from './zq-select.component'
import { OverlayModule } from '@angular/cdk/overlay';
import { ZqSelectPanelComponent } from './zq-select-panel.component'

@NgModule({
  declarations: [ZqSelectComponent, ZqSelectPanelComponent],
  imports: [CommonModule, OverlayModule, ZqInputModule, FormsModule],
  exports: [ZqSelectComponent],
})
export class ZqSelectModule {}
