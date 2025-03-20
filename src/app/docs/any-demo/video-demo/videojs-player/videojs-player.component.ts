import { Component, ElementRef, EventEmitter, Input, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import FlvJs from 'flv.js';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';
import { getSourceTypeByUrl, resolveUrl } from './vjs.util';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'videojs-player',
  imports: [CommonModule],
  templateUrl: './videojs-player.component.html',
  styleUrl: './videojs-player.component.less',
  exportAs: 'videojsPlayer'
})
export class VideojsPlayerComponent {
  constructor(private renderer: Renderer2) {}
  @Input() autoplay = true;
  @Input() url = '';
  @Input() fullscreen = false;
  @Input() inPaused = true;
  @Input() loop = false 
  /**当前播放时间 */
  @Input() time = -1;
  @Output() vjsReady: EventEmitter<Player> = new EventEmitter();
  @Output() canplayChange: EventEmitter<void> = new EventEmitter();
  @Output() timeChange: EventEmitter<{ currentTime: number; duration: number; progress: number }> = new EventEmitter();
  @ViewChild('playerMainRef', { static: true }) playerMainRef!: ElementRef<HTMLDivElement>;
  @ViewChild('playerWraperRef', { static: true }) playerWraperRef!: ElementRef<HTMLDivElement>;
  // theme = input('');
  defaultAspect = '16:9'; // 默认宽高比
  vjsPlayer: Player | null = null;
  flvPlayer: FlvJs.Player | null = null;
  playmainElement!: HTMLDivElement;
  fullAnimeFlag: number = -1;
  pauseAnimeFlag: number = -1;
  urlAnimeFlag: number = -1;
  timeAnimeFlag: number = -1;
  fullscreenchangeCb = () => {
    const ifFull = document.fullscreenElement == this.playerWraperRef.nativeElement;
    this.toggleFullscreen(ifFull);
  };
  ngOnInit() {
    this.playmainElement = this.playerMainRef.nativeElement;
  }
  ngAfterViewInit() {
    document.addEventListener('fullscreenchange', this.fullscreenchangeCb);
  }
  ngOnChanges(changes: SimpleChanges) {
    const { url, inPaused } = changes;
    if (url) {
      this.initVJSPlayer(url.currentValue);
    }
    if (inPaused) {
      this.setPause(inPaused.currentValue);
    }
  }
  get isPaused() {
    return this.vjsPlayer?.paused();
  }
  get isFLV() {
    return getSourceTypeByUrl(this.url) == 'video/x-flv';
  }
  async setTime(time: number) {
    if (time < 0 || time > this.vjsPlayer?.duration() || !Number.isFinite(time)) return;
    const isPaused = this.inPaused;
    this.vjsPlayer.pause();
    this.vjsPlayer?.currentTime(time);
    await Promise.resolve();
    !isPaused && this.vjsPlayer.play();
  }
  setPause(paused: boolean) {
    cancelAnimationFrame(this.pauseAnimeFlag);
    this.pauseAnimeFlag = requestAnimationFrame(() => {
      paused ? this.vjsPlayer?.paused() : this.vjsPlayer?.play();
    });
  }
  toggleFullscreen(fullscreen) {
    const wrap = this.playerWraperRef.nativeElement;
    // 通过document判断全屏
    this.fullscreen = fullscreen;
    cancelAnimationFrame(this.fullAnimeFlag);
    this.fullAnimeFlag = requestAnimationFrame(() => {
      this.fullscreen ? wrap.requestFullscreen() : document.fullscreenElement != null && document.exitFullscreen();
    });
  }
  doubleClickMain() {
    this.toggleFullscreen(!this.fullscreen);
  }
  initVJSPlayer(url?: string) {
    this.disposeVJSPlayer();
    cancelAnimationFrame(this.urlAnimeFlag);
    this.urlAnimeFlag = requestAnimationFrame(() => {
      const videoEl = this.createVideoEl();
      const { src, type } = resolveUrl(url || this.url);
      const isFLV = type == 'video/x-flv';
      this.vjsPlayer = videojs(
        videoEl,
        {
          languages: 'zh-CN',
          fill: true,
          techOrder: ['html5'],
          sources: !isFLV && [{ src, type }]
        },
        () => {
          this.autoplay && this.vjsPlayer.play();
          this.vjsPlayer.controls(false);
          this.vjsReady.emit(this.vjsPlayer);
          isFLV && this.flvPlayer?.load();
          console.log('ready');
        }
      );
      this.vjsPlayer.on('timeupdate', e => {

        this.timeChange.emit({ currentTime: this.vjsPlayer.currentTime(), duration: this.vjsPlayer.duration(), progress: this.vjsPlayer.currentTime() / this.vjsPlayer.duration() });
      });
      this.vjsPlayer.on('canplay', () => {
        this.canplayChange.emit();
      });
      this.vjsPlayer.on('dispose', () => {
        this.disposeFLVPlayer();
      });
      if (isFLV) {
        this.flvPlayer = FlvJs.createPlayer({
          type: 'flv',
          url,
          isLive: true,
          hasVideo: true
        });
        // 绑定videojs 播放器
        this.flvPlayer.attachMediaElement(videoEl);
      }
    });
  }
  createVideoEl() {
    const videoEl = this.renderer.createElement('video');
    this.renderer.addClass(videoEl, `video-js`);
    // this.renderer.addClass(videoEl, `${this.theme()}`);
    this.renderer.appendChild(this.playmainElement, videoEl);
    this.renderer.setStyle(videoEl, 'width', '100%');
    this.renderer.setStyle(videoEl, 'height', '100%');
    return videoEl;
  }
  disposeVJSPlayer() {
    this.vjsPlayer?.dispose();
    this.vjsPlayer = null;
  }
  disposeFLVPlayer() {
    this.flvPlayer?.destroy();
    this.flvPlayer = null;
  }
  ngOnDestroy() {
    document.removeEventListener('fullscreenchange', this.fullscreenchangeCb);
    this.disposeFLVPlayer();
    this.disposeVJSPlayer();
  }
}
