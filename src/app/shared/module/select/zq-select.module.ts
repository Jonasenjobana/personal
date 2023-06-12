import { FormsModule } from '@angular/forms';
import { ZqInputModule } from './../input/zq-input.module';
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ZqSelectComponent } from './zq-select.component'
import { OverlayModule } from '@angular/cdk/overlay';
import { ZqSelectPanelComponent } from './zq-select-panel.component';
import { ZqSelectTopControlComponent } from './zq-select-top-control.component'
import { EmptyBoxModule } from '../empty-box/empty-box.module';
import { ZqSelectControlItemComponent } from './zq-select-control-item.component';

@NgModule({
  declarations: [ZqSelectComponent, ZqSelectPanelComponent, ZqSelectTopControlComponent, ZqSelectControlItemComponent],
  imports: [CommonModule, OverlayModule, ZqInputModule, FormsModule, EmptyBoxModule],
  exports: [ZqSelectComponent],
  providers: [
    {provide: 'CONST_VALUE', useValue: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'}
  ]
})
export class ZqSelectModule {}
