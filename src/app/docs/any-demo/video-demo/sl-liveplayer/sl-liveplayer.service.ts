import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';

@Injectable()
export class SlLiveplayerService {
  constructor() {
    this.listenDocument();
  }
  vueInstance: any
  playStateSub$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  speedSub$: BehaviorSubject<number> = new BehaviorSubject(1);
  currentTimeSub$: BehaviorSubject<number> = new BehaviorSubject(0);
  fullscreenSub$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  detachSub$: Subject<void> = new Subject();
  documentFullscreen$: Subject<void> = new Subject();
  urlChange$: BehaviorSubject<string> = new BehaviorSubject('');
  updateCurrentTime(time: number) {
    this.vueInstance?.setCurrentTime(time);
  }
  listenDocument() {
    document.addEventListener('fullscreenchange', () => this.documentFullscreen$.next());
  }
  destroyed() {
    this.playStateSub$.complete();
    this.speedSub$.complete();
    this.currentTimeSub$.complete();
    this.fullscreenSub$.complete();
    this.detachSub$.complete();
    this.documentFullscreen$.complete();
    this.urlChange$.complete();
  }
}
