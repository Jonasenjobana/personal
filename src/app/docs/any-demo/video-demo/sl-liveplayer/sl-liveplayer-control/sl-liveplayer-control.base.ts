import { ChangeDetectorRef, Directive, Input, Optional, Output } from '@angular/core';
import { SlLiveplayerService } from '../sl-liveplayer.service';

@Directive()
export abstract class SlLiveplayerControlBase {
  constructor(@Optional() protected slLiveplayer: SlLiveplayerService, protected cdr: ChangeDetectorRef) {}
  public playstate: boolean;
  public fullscreen: boolean;
  ngOnInit() {
    this.initSubscribe();
  }
  onPlayStateChange() {
    this.slLiveplayer.playStateSub$.next(!this.playstate);
  }
  onFullscreenChange() {
    this.slLiveplayer.fullscreenSub$.next(!this.fullscreen);
  }
  initSubscribe() {
    this.slLiveplayer.playStateSub$.subscribe((playState) => {
      this.playstate = playState;
      console.log(playState)
    })
    this.slLiveplayer.fullscreenSub$.subscribe((fullscreen) => {
      this.fullscreen = fullscreen;
    })
    this.slLiveplayer.urlChange$.subscribe(() => {
      this.init();
    })
  }
  init() {
  }
}
