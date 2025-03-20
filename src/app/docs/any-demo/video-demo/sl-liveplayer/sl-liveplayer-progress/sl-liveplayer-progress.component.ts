import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, Optional } from '@angular/core';
import { SlLiveplayerProgressBase } from './sl-liveplayer-progress.base';
import { SlLiveplayerService } from '../sl-liveplayer.service';

@Component({
  selector: 'sl-liveplayer-progress',
  imports: [CommonModule],
  templateUrl: './sl-liveplayer-progress.component.html',
  styleUrl: './sl-liveplayer-progress.component.less'
})
export class SlLiveplayerProgressComponent extends SlLiveplayerProgressBase {
  constructor(@Optional() protected override slLiveplayer: SlLiveplayerService, protected override cdr: ChangeDetectorRef) {
    super(slLiveplayer, cdr);
  }
}
