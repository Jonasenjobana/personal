import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { VideojsPlayerComponent } from '../videojs-player/videojs-player.component';
import { Subject, concatAll, debounceTime, fromEvent, map, takeUntil, tap } from 'rxjs';
import Player from 'video.js/dist/types/player';

@Component({
  selector: 'sl-videoplayer',
  imports: [VideojsPlayerComponent],
  templateUrl: './sl-videoplayer.component.html',
  styleUrl: './sl-videoplayer.component.less'
})
export class SlVideoplayerComponent {
  @Input() url: string = '';
  @Input() time: number = 0;
  @Input() isLive: boolean = true;
  /**视频切片开始时间 单位s */
  @Input() startTime: number = 0;
  /**自定义切片视频范围 单位s */
  @Input() inDuration: number = -1;
  @Input() loop: boolean = false;
  @Input() autoplay: boolean = true;
  @Input() inPaused: boolean = true;
  @ViewChild('progressThumb') progressThumbRef: ElementRef<HTMLElement>;
  @ViewChild('progressBar') progressBarRef: ElementRef<HTMLElement>;
  @ViewChild('progressActive') progressActiveRef: ElementRef<HTMLElement>;
  @ViewChild('videojsPlayer') videojsPlayerRef: VideojsPlayerComponent;
  @Output() timeChange: EventEmitter<{ currentTime: number; duration: number; progress: number }> = new EventEmitter();
  /**progress 进度条百分比 time: 如果是切片需要加上整体的 offsetX: dom偏移 */
  @Output() progressHover: EventEmitter<{ progress: number;time: number; offsetX: number }> = new EventEmitter();
  destroy$: Subject<void> = new Subject();
  progress: number = 0;
  duration: number = 0;
  prevPaused: boolean = true;
  ngOnChanges(changes: SimpleChanges) {
    const {inDuration, inPaused, autoplay} = changes;
    if (inDuration) {
      this.duration = inDuration.currentValue;
    }
  }
  ngAfterViewInit() {
    this.initProgressEl();
  }
  onVjsReady(vjs: Player) {
    vjs.currentTime(this.startTime);
  }
  initProgressEl() {
    const activeEl = this.progressActiveRef.nativeElement;
    const barEl = this.progressBarRef.nativeElement;
    const thumbEl = this.progressThumbRef.nativeElement;
    const mouseup = fromEvent(document.body, 'mouseup').pipe(takeUntil(this.destroy$));
    const mousemove = fromEvent(document.body, 'mousemove').pipe(takeUntil(this.destroy$));
    const barHover = fromEvent(barEl, 'mousemove')
      .pipe(takeUntil(this.destroy$))
      .subscribe((e: MouseEvent) => {
        const progress = e.offsetX / barEl.clientWidth;
        this.progressHover.emit({ progress: progress,time: this.duration * progress, offsetX: e.offsetX });
      });
    const updateTime = e => {
      const progress = e.offsetX / barEl.clientWidth;
      this.time = progress * this.duration;
      this.videojsPlayerRef.setTime(this.time);
      this.updateProgressStyle(progress);
    };
    const mousedown = fromEvent(barEl, 'mousedown')
      .pipe(
        takeUntil(this.destroy$),
        map((e: PointerEvent) => {
          updateTime(e);
          return mousemove.pipe(takeUntil(mouseup));
        }),
        concatAll(),
        map((e: MouseEvent) => {
          console.log(e);
          return e;
        })
      )
      .pipe(debounceTime(25))
      .subscribe(e => {
        updateTime(e);
      });
  }
  onTimeChange($event) {
    const { progress, duration, currentTime } = $event;
    if (this.inDuration != -1) {
      this.progress = Math.min((currentTime - this.startTime) / this.inDuration, 1);
    } else {
      this.duration = duration;
      this.progress = progress;
    }
    if (this.prevPaused != this.inPaused) {
      this.videojsPlayerRef.setPause(this.inPaused);
    }
    this.prevPaused = this.inPaused;
    this.updateProgressStyle(this.progress);
    this.timeChange.emit($event);
  }
  updateProgressStyle(progress: number) {
    const activeEl = this.progressActiveRef.nativeElement;
    const barEl = this.progressBarRef.nativeElement;
    const thumbEl = this.progressThumbRef.nativeElement;
    activeEl.style.width = `${progress * 100}%`;
    thumbEl.style.transform = `translateX(${progress * barEl.clientWidth}px)`;
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
