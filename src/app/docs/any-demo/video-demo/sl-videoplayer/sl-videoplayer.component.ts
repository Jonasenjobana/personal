import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { VideoLife, VideojsPlayerComponent } from '../videojs-player/videojs-player.component';
import { Subject, fromEvent } from 'rxjs';
import Player from 'video.js/dist/types/player';
import { concatAll, debounceTime, map, takeUntil } from 'rxjs/operators';
/**
 * TODO
 * 1.音量控制
 * 2.截屏
 * 3.水印
 * 4.倍速
 * 5.清晰度切换
 * 7.进度条鼠标放入显示详情
 * <sl-videoplayer url='..'>
 *  <div [main]></div>
 *  <div [control]></div>
 *  <div [progress]></div>
 * </sl-videoplayer>
 */
@Component({
  selector: 'sl-videoplayer',
  templateUrl: './sl-videoplayer.component.html',
  styleUrls: ['./sl-videoplayer.component.less'],
  imports: [VideojsPlayerComponent],
  standalone: true
})
export class SlVideoplayerComponent {
  @Input() url: string = '';
  /**视频播放时间变化量 inDeltaTime + startTime = 视频实际时间*/
  @Input() inDeltaTime: number = 0;
  /**直播 startTime inDeltaTime endTime duration为无效值 */
  @Input() isLive: boolean = true;
  /**视频切片开始时间 单位s 默认0最开始 */
  @Input() startTime: number = 0;
  /**视频切片结束时间 单位s 默认视频时长尾部 -1不限制*/
  @Input() endTime: number = -1;
  @Input() loop: boolean = false;
  @Input() autoplay: boolean = true;
  /**视频播放控制交给外部 */
  @Input() inPaused: boolean = false;
  /**隐藏默认进度条 */
  @Input() showProgress: boolean = true;
  /**隐藏默认控制面板 */
  @Input() showControl: boolean = true;
  /**TODO水印 */
  @Input() watermark: string = ''
  /**截屏 */
  // @Input() snapshot: string = ''
  @ViewChild('progressThumb') progressThumbRef: ElementRef<HTMLElement>;
  @ViewChild('progressBar') progressBarRef: ElementRef<HTMLElement>;
  @ViewChild('progressActive') progressActiveRef: ElementRef<HTMLElement>;
  @ViewChild('videojsPlayer') videojsPlayerRef: VideojsPlayerComponent;
  @Output() timeChange: EventEmitter<{ currentTime: number; duration: number; progress: number }> = new EventEmitter();
  /**progress 进度条百分比 offsetX: dom偏移 */
  @Output() progressHover: EventEmitter<{ progress: number;offsetX: number }> = new EventEmitter();
  destroy$: Subject<void> = new Subject();
  progress: number = 0;
  /**资源解析实际总时长 */
  sourceDuration: number = 0;
  /**切片开始时间 */
  readyTime: number = 0;
  /**相对于总时长的当前时间 */
  currentTime: number = 0;
  /**跳转变化量 */
  deltaTime: number = 0;
  /**videojs内部生命周期 */
  videoStatus?: {[key in VideoLife]: boolean};
  /**进度条区间时间*/
  get progressRangeTime() {
    return this.endTime != -1 ? this.endTime - this.startTime : this.sourceDuration - this.startTime;
  }
  ngOnChanges(changes: SimpleChanges) {
    const { inDeltaTime, startTime } = changes;
    if (startTime) {
      if (!this.videoStatus || !this.videoStatus.ready) return;
      if (this.startTime >= 0 && this.startTime <= this.sourceDuration && (this.endTime == -1 || this.startTime < this.endTime)) {
        // startTime切片开始时间需要合法
        this.readyTime = this.startTime;
      } else {
        console.error('sl-videoplayer component [input:startTime] not valid!');
      }
    }
    if (inDeltaTime) {
      if (this.videoStatus && this.videoStatus.ready) {
        if (this.inDeltaTime >= 0 && this.inDeltaTime <= this.progressRangeTime) {
          const time = this.inDeltaTime + this.startTime;
          this.videojsPlayerRef.setTime(time);
        }
      }
    }
  }
  ngAfterViewInit() {
    this.initProgressEl();
  }
  /**进度条注册事件 */
  initProgressEl() {
    const activeEl = this.progressActiveRef.nativeElement;
    const barEl = this.progressBarRef.nativeElement;
    const thumbEl = this.progressThumbRef.nativeElement;
    const mouseup = fromEvent(document.body, 'mouseup').pipe(takeUntil(this.destroy$));
    const mousemove = fromEvent(document.body, 'mousemove').pipe(takeUntil(this.destroy$));
    const barHover = fromEvent(barEl, 'mousemove')
      .pipe(takeUntil(this.destroy$), debounceTime(10))
      .subscribe((e: MouseEvent) => {
        const progress = e.offsetX / barEl.clientWidth;
        this.progressHover.emit({ progress: progress, offsetX: e.offsetX });
      });
    const updateTime = e => {
      const progress = (this.progress = e.offsetX / barEl.clientWidth);
      this.currentTime = this.startTime + progress * this.progressRangeTime;
      this.videojsPlayerRef.setTime(this.currentTime);
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
          return e;
        })
      ).subscribe(e => {
        updateTime(e);
      });
  }
  onTimeChange($event) {
    const { duration, currentTime } = $event;
    this.sourceDuration = duration;
    this.progress = Math.min((currentTime - this.startTime) / this.progressRangeTime, 1);
    console.log(currentTime, this.startTime, this.progressRangeTime)
    if (this.progress == 1) {
      // 自动暂停
      this.inPaused = true;
    }
    this.updateProgressStyle(this.progress);
    this.timeChange.emit($event);
  }
  updateProgressStyle(progress: number) {
    let value = Math.min(Math.max(progress, 0), 1);
    const activeEl = this.progressActiveRef.nativeElement;
    const barEl = this.progressBarRef.nativeElement;
    const thumbEl = this.progressThumbRef.nativeElement;
    activeEl.style.width = `${value * 100}%`;
    thumbEl.style.transform = `translateX(${value * barEl.clientWidth}px)`;
  }
  onStatusChange($event: {[key in VideoLife]: boolean}) {
    this.videoStatus = $event;
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
