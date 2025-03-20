import { ChangeDetectorRef, Directive, ElementRef, Input, Optional, ViewChild } from '@angular/core';
import { SlLiveplayerService } from '../sl-liveplayer.service';
import * as moment from 'moment';
import { Subject, concatAll, debounceTime, fromEvent, map, takeUntil, tap } from 'rxjs';

@Directive()
export abstract class SlLiveplayerProgressBase {
  constructor(@Optional() protected slLiveplayer: SlLiveplayerService, protected cdr: ChangeDetectorRef) {}
  @ViewChild('progressThumb') progressThumbRef: ElementRef<HTMLElement>;
  @ViewChild('progressBar') progressBarRef: ElementRef<HTMLElement>;
  @ViewChild('progressActive') progressActiveRef: ElementRef<HTMLElement>;
  @Input() duration: number = 0;
  currentTime: number = 0;
  progress: number = 0;
  destroy$: Subject<void> = new Subject();
  ngAfterViewInit() {
    const activeEl = this.progressActiveRef.nativeElement;
    const barEl = this.progressBarRef.nativeElement;
    const thumbEl = this.progressThumbRef.nativeElement;
    const mouseup = fromEvent(document.body, 'mouseup').pipe(takeUntil(this.destroy$));
    const mousemove = fromEvent(document.body, 'mousemove').pipe(takeUntil(this.destroy$));
    const mousedown = fromEvent(barEl, 'mousedown')
      .pipe(
        takeUntil(this.destroy$),
        map((e: PointerEvent) => {
          document.body.style.userSelect = 'none';
          return mousemove.pipe(
            takeUntil(mouseup),
            tap(() => (document.body.style.userSelect = ''))
          );
        }),
        concatAll(),
        map((e: MouseEvent) => e)
      )
      .pipe(debounceTime(25))
      .subscribe(e => {
        this.currentTime = (e.offsetX / barEl.clientWidth) * this.duration;
        this.slLiveplayer.updateCurrentTime(this.currentTime);
      });
    this.initSubscribe();
  }
  initSubscribe() {
    const activeEl = this.progressActiveRef.nativeElement;
    const barEl = this.progressBarRef.nativeElement;
    const thumbEl = this.progressThumbRef.nativeElement;
    this.slLiveplayer.currentTimeSub$.subscribe(currentTime => {
      this.currentTime = currentTime;
      this.updateStyle(barEl, activeEl, thumbEl);
    });
  }
  updateStyle(barEl, activeEl, thumbEl) {
    this.progress = Math.min(this.currentTime / this.duration, 1);
    activeEl.style.width = `${this.progress * 100}%`;
    thumbEl.style.transform = `translateX(${this.progress * barEl.clientWidth}px)`;
  }
  init() {
    this.progress = 0;
    this.currentTime = 0;
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
