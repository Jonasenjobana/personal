import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { SlLiveplayerControlComponent } from './sl-liveplayer-control/sl-liveplayer-control.component';
import { SlLiveplayerService } from './sl-liveplayer.service';
import { Subject, takeUntil } from 'rxjs';
import { SlLiveplayerProgressComponent } from './sl-liveplayer-progress/sl-liveplayer-progress.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sl-liveplayer',
  imports: [SlLiveplayerControlComponent, SlLiveplayerProgressComponent, CommonModule],
  providers: [SlLiveplayerService],
  templateUrl: './sl-liveplayer.component.html',
  styleUrl: './sl-liveplayer.component.less',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SlLiveplayerComponent {
  constructor(private slLiveplayer: SlLiveplayerService, private cdr: ChangeDetectorRef) {}
  @Input() time: number = 0;
  /**视频流地址 */
  @Input() inUrl: string = '';
  @Input() duration: number = 0;
  /**视频封面 */
  @Input() poster: string = '';
  /**自动播放 */
  @Input() autoplay: boolean = true;
  /**播放true 暂停false */
  @Input() playState: boolean = this.autoplay;
  /**直播 隐藏进度条 */
  @Input() isLive: boolean = false;
  /**显示进度条 */
  @Input() showProgress: boolean = true;
  /**工具类高度 */
  @Input() barHeight: number = 28;
  /**全屏下工具栏高度 */
  @Input() fullBarHeight: number = 40;
  /**自定义大小的所谓全屏 */
  @Input() customFull: boolean = false;
  /**全屏整体包围盒 */
  @ViewChild('liveplayerWraper') liveplayerWraperRef: ElementRef<HTMLDivElement>;
  /**liveplayer dom 可获取vue实例 */
  @ViewChild('livePlayer') livePlayerRef: ElementRef<{ [key in string]: any } & HTMLElement>;
  /**视频进度回调 */
  @Output() timeChange: EventEmitter<{ currentTime: number; duration: number }> = new EventEmitter();
  /**播放状态回调 */
  @Output() playStateChange: EventEmitter<boolean> = new EventEmitter();
  /**视频可以播放 */
  @Output() canplayChange: EventEmitter<void> = new EventEmitter();
  readyFlag: boolean = true;
  /**加载视频 */
  onLoading: boolean = false;
  /**liveplayer vue实例 */
  public liveplayerInstance: any = null;
  public fullscreen: boolean = false;
  /**内部组件是否初始化完成 */
  public isLiveplayerInit: boolean = false;
  /**进度条相对时间 */
  private currentTime: number = 0;
  private destroy$: Subject<void> = new Subject();
  url: string = '';
  /**liveplaye内部初始化 获取长宽 */
  liveplayWidth: string = '';
  liveplayHeight: string = '';
  /**全屏延迟 */
  triggerFullAnime: number = -1;
  /**工具栏包围容器高度 */
  controlBarHeight: string = '';
  prevUrl: string = '';
  ngOnChanges(changes: SimpleChanges) {
    const { playState, inUrl, time } = changes;
    if (playState) {
      this.slLiveplayer.playStateSub$.next(playState.currentValue);
    }
    if (inUrl) {
      this.onLoading = true;
      this.prevUrl = inUrl.previousValue;
      this.slLiveplayer.urlChange$.next(this.inUrl);
    }
    if (time) {
      this.setCurrentTime(this.time);
    }
  }
  ngAfterViewInit() {
    this.initLiveplayer();
  }
  initLiveplayer() {
    const liveplayer = this.livePlayerRef.nativeElement;
    const { width, height } = liveplayer.getBoundingClientRect();
    this.liveplayWidth = `${width}px`;
    this.liveplayHeight = `${height}px`;
    this.liveplayerInstance = liveplayer['getVueInstance']();
    this.slLiveplayer.vueInstance = this.liveplayerInstance;
    this.cdr.detectChanges();
    liveplayer.oncanplay = () => {
      // 相当于vue内部的初始化
      this.isLiveplayerInit = true;
      this.canplayChange.emit();
    };
    this.initSubscribe();
  }
  /**初始化控件 */
  initSubscribe() {
    this.destroy$.next();
    this.slLiveplayer.playStateSub$.pipe(takeUntil(this.destroy$)).subscribe(playState => {
      this.playState = playState;
      this.onPlayStateChange(playState);
    });
    this.slLiveplayer.speedSub$.pipe(takeUntil(this.destroy$)).subscribe(speed => {
      this.onSpeedChange(speed);
    });
    this.slLiveplayer.urlChange$.subscribe((url: string) => {
      this.destroyPlayer();
      if (this.autoplay) {
        setTimeout(() => {
          this.url = url;
        }, 1000);
        setTimeout(() => {
          const video = this.videoInstance;
          if (video) {              
            this.slLiveplayer.playStateSub$.next(true);
          }
        }, 2000);
      }
    });
    this.slLiveplayer.documentFullscreen$.subscribe(() => {
      if (this.customFull) return;
      const el = this.liveplayerWraperRef.nativeElement;
      this.slLiveplayer.fullscreenSub$.next(document.fullscreenElement == el);
    });
    this.slLiveplayer.fullscreenSub$.pipe(takeUntil(this.destroy$)).subscribe(fullscreen => {
      // 通过document判断全屏
      this.fullscreen = fullscreen;
      const el = this.liveplayerWraperRef.nativeElement;
      cancelAnimationFrame(this.triggerFullAnime);
      this.triggerFullAnime = requestAnimationFrame(() => {
        this.fullscreen ? el.requestFullscreen() : document.fullscreenElement != null && document.exitFullscreen();
      });
    });
  }
  get videoInstance() {
    const el = this.livePlayerRef.nativeElement;
    return el.querySelector('video');
  }
  onPlayStateChange(playstate: boolean) {
    playstate ? this.liveplayerInstance?.play() : this.liveplayerInstance?.pause();
  }
  onSpeedChange(speed: number) {}
  onTimeUpdate($event: any) {
    const { detail } = $event;
    this.onLoading = false;
    this.currentTime = detail[0];
    this.slLiveplayer.currentTimeSub$.next(this.currentTime);
  }
  setCurrentTime(currentTime: number) {
    this.liveplayerInstance?.setCurrentTime(currentTime);
  }
  destroyPlayer() {
    this.url = '';
    this.slLiveplayer.currentTimeSub$.next(0);
    // this.isLiveplayerInit = false;
  }
  toggleFullscreen() {
    this.slLiveplayer.fullscreenSub$.next(!this.fullscreen);
  }
  onEnded() {}
  changePlayState() {
    this.playState = !this.playState;
    this.onPlayStateChange(this.playState);
  }
  onError($event) {
    if ($event.detail[0] == 'MediaError') {
      // this.reload();
    }
  }
  /**重新加载live-player组件播放器 释放原资源，重新加载 */
  async reInitLiveplayer() {
    const tempUrl = this.url;
    this.url = '';
    this.readyFlag = false;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // NG销毁后 重新初始化
        this.readyFlag = true;
      }, 1000);
      setTimeout(() => {
        this.initLiveplayer();
        this.url = tempUrl;
        resolve(true);
      }, 2000);
    })
  }
}
