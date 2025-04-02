import { Component, ElementRef, EventEmitter, Input, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
import FlvJs from 'flv.js';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';
import { getSourceTypeByUrl, resolveUrl } from './vjs.util';
export type VideoLife = 'ready' | 'loadmetadata' | 'canplay';
@Component({
  selector: 'videojs-player',
  templateUrl: './videojs-player.component.html',
  styleUrls: ['./videojs-player.component.less'],
  exportAs: 'videojsPlayer'
})
export class VideojsPlayerComponent {
  constructor(private renderer: Renderer2) {}
  @Input() autoplay = true;
  @Input() url = '';
  @Input() fullscreen = false;
  @Input() inPaused = true;
  @Input() loop = false;
  /**直播 */
  @Input() isLive = false;
  /**auto (不省流) metadata只预加载前面有用的 none不预加载点击播放才加载(省流) */
  @Input() preload: 'auto' | 'metadata' | 'none' = 'auto';
  /**初始化播放时间 */
  @Input() readyTime = 0;
  /**时间变化跳转 */
  @Input() deltaTime = 0;
  @Output() videoStatusChange: EventEmitter<any> = new EventEmitter();
  @Output() timeChange: EventEmitter<{ currentTime: number; duration: number }> = new EventEmitter();
  @ViewChild('playerMainRef', { static: true }) playerMainRef!: ElementRef<HTMLDivElement>;
  @ViewChild('playerWraperRef', { static: true }) playerWraperRef!: ElementRef<HTMLDivElement>;
  videoStatus: {[key in VideoLife]: boolean} = {
    ready: false, 
    loadmetadata: false, // 加载完元数据
    canplay: false,
  }
  // theme = input('');
  defaultAspect = '16:9'; // 默认宽高比
  vjsPlayer: Player | null = null;
  flvPlayer: FlvJs.Player | null = null;
  playmainElement!: HTMLDivElement;
  fullAnimeFlag: number = -1;
  urlAnimeFlag: number = -1;
  loadedmetadataFlag: NodeJS.Timeout = null;
  loading: boolean = false;
  /**初始化视频跳转到指定位置 */
  ifInitVideoTime: boolean = false;
  onfocus: boolean = false;
  fullscreenchangeCb = () => {
    const ifFull = document.fullscreenElement == this.playerWraperRef.nativeElement;
    this.toggleFullscreen(ifFull);
  };
  ngOnInit() {
    this.playmainElement = this.playerMainRef.nativeElement;
  }
  ngAfterViewInit() {
    document.addEventListener('fullscreenchange', this.fullscreenchangeCb);
    this.playmainElement.addEventListener('focus', () => {
      this.onfocus = true;
    })
    this.playmainElement.addEventListener('blur', () => {
      this.onfocus = false;
    })
  }
  ngOnChanges(changes: SimpleChanges) {
    const { url, inPaused, readyTime } = changes;
    if (url) {
      this.initVJSPlayer(url.currentValue);
    }
    if (inPaused) {
      this.setPause(inPaused.currentValue);
    }
    if (readyTime) {
      if (this.ifInitVideoTime) {
        this.ifInitVideoTime = false;
      }      
    }
  }
  get isPaused() {
    return this.vjsPlayer?.paused();
  }
  get isFLV() {
    return getSourceTypeByUrl(this.url) == 'video/x-flv';
  }
  setTime(currentTime: number) {
    if (this.ifSeekTimeInValid(currentTime)) return;
    this.vjsPlayer?.currentTime(currentTime);
  }
  ifSeekTimeInValid(currentTime: number) {
    return currentTime < 0 || currentTime > this.vjsPlayer?.duration() || !Number.isFinite(currentTime)
  }
  setPause(paused: boolean) {
    paused ? this.vjsPlayer?.pause() : this.vjsPlayer?.play();
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
  clickMain() {
    console.log('clickMain');
  }
  initVJSPlayer(url?: string) {
    this.disposeVJSPlayer();
    cancelAnimationFrame(this.urlAnimeFlag);
    this.urlAnimeFlag = requestAnimationFrame(() => {
      const videoEl = this.createVideoEl();
      const { src, type } = resolveUrl(url || this.url);
      const isFLV = ['video/x-flv', 'rtmp/flv'].includes(type);
      this.vjsPlayer = videojs(
        videoEl,
        {
          preload: this.preload,
          notSupportedMessage: true,
          languages: 'zh-CN',
          fill: true,
          techOrder: ['html5'],
          controls: false,
          sources: !isFLV && [{ src, type }]
        },
        () => {
          // ready
          this.vjsPlayer.play();
          this.emitVideoStatus('ready', true);
          isFLV && this.flvPlayer?.load();
        }
      );
      this.vjsPlayer.on('play', () => {
        
      })
      this.vjsPlayer.on('timeupdate', e => {
        if (this.isFLV && this.isLive) {
          // flv直播 延迟追帧
          this.catchUpTime();
        }
        const duration = this.vjsPlayer.duration();
        const currentTime = this.vjsPlayer.currentTime();
        this.setVideoInitTime();
        this.timeChange.emit({ currentTime: currentTime, duration: duration });
      });
      this.vjsPlayer.on('waiting', e => {
        this.loading = true;
      });
      this.vjsPlayer.on('loadmetadata', () => {
        
      })
      // this.vjsPlayer.on('play',)
      this.vjsPlayer.on('canplay', () => {
        this.loading = false;
        this.emitVideoStatus('canplay', true);
        this.setVideoInitTime();
      });
      this.vjsPlayer.on('dispose', () => {
        this.disposeFLVPlayer();
      });
      if (isFLV) {
        this.flvPlayer = FlvJs.createPlayer(
          {
            type: 'flv',
            url,
            isLive: true,
            hasVideo: true
          },
          {
            autoCleanupSourceBuffer: true
          }
        );
        // 绑定videojs 播放器
        this.flvPlayer.attachMediaElement(videoEl);
      }
    });
  }
  /**切片 设置视频初始位置 */
  setVideoInitTime() {
    if (this.isLive) return;
    const currentTime = this.vjsPlayer.currentTime();
    const ifInit = this.ifInitVideoTime || Math.abs(currentTime - this.readyTime) <= 5;
    if (!ifInit) {
      if (this.ifSeekTimeInValid(this.readyTime)) {
        // readyTime不合法 死锁 
        console.error('readyTime not valid');
        return;
      }
      this.setTime(this.readyTime);
    } else {
      (!this.autoplay || this.inPaused) && this.vjsPlayer.pause();
      // TODO bug 导致暂停
      this.ifInitVideoTime = ifInit;
    }
  }
  /**直播延迟追帧 */
  catchUpTime() {
    const end = this.flvPlayer.buffered.end(0); //获取当前buffered值(缓冲区末尾)
    const delta = end - this.flvPlayer.currentTime; //获取buffered与当前播放位置的差值
     // 延迟过大，通过跳帧的方式更新视频
    if (delta > 10 || delta < 0) {
      this.vjsPlayer.currentTime(this.flvPlayer.buffered.end(0) - 1);
      return;
    }
    // 追帧
    if (delta > 1) {
      this.vjsPlayer.playbackRate(1.1);
    } else {
      this.vjsPlayer.playbackRate(1);
    }
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
    this.initVideoStatus();
    this.vjsPlayer?.dispose();
    this.vjsPlayer = null;
    this.ifInitVideoTime = false;
  }
  disposeFLVPlayer() {
    this.flvPlayer?.destroy();
    this.flvPlayer = null;
  }
  initVideoStatus() {
    this.videoStatus = {
      ready: false, 
      loadmetadata: false, // 加载完元数据
      canplay: false,
    }
    this.videoStatusChange.emit(this.videoStatus);
  }
  emitVideoStatus(type: VideoLife, value: boolean) {
    this.videoStatus[type] = value;
    this.videoStatusChange.emit(this.videoStatus);
  }
  ngOnDestroy() {
    document.removeEventListener('fullscreenchange', this.fullscreenchangeCb);
    this.disposeFLVPlayer();
    this.disposeVJSPlayer();
    this.initVideoStatus();
  }
}
