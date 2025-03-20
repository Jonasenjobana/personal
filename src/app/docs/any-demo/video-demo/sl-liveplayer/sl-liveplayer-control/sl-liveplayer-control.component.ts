import { ChangeDetectorRef, Component, ElementRef, HostListener, Input, Optional, SimpleChanges } from '@angular/core';
import { SlLiveplayerService } from '../sl-liveplayer.service';
import { SlLiveplayerControlBase } from './sl-liveplayer-control.base';

@Component({
  selector: 'sl-liveplayer-control',
  imports: [],
  providers: [],
  templateUrl: './sl-liveplayer-control.component.html',
  styleUrl: './sl-liveplayer-control.component.less'
})
export class SlLiveplayerControlComponent extends SlLiveplayerControlBase {
  isHoverControl: boolean = false;
  constructor(@Optional() protected override slLiveplayer: SlLiveplayerService, protected override cdr: ChangeDetectorRef) {
    super(slLiveplayer, cdr);
  }
  ngOnChanges(changes: SimpleChanges) {
  }
  ngAfterViewInit() {}
}
