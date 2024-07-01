import { Subject, fromEvent, throwError } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { SLUSettimeout } from 'src/app/shared/utils/slu-time';
import { CanvasAnimeState, CanvasMapperConfig } from './model';

/**
 * 第二版
 * 参考leaflet api 自动改变canvas宽高 不需要每次初始化
 * 可以不再依赖经纬度 可以任意坐标系 只要定义好默认参考标准
 * TODO 绘制bnsv类似的输水系统
 * */
export class SLUCanvasMapper2 {
  mapContainerEl!: HTMLElement;
  canvasContainer!: HTMLElement;
  config: CanvasMapperConfig = {
    scale: 1,
    scaleDelta: 0.2,
    minScale: 0.2,
    maxScale: 20,
    pixelRatio: 1,
    baseProportionPixel: [1, 1],
    baseOffset: [0, 0],
    baseXY: [0, 0],
    boxScale: true,
    dragging: true
  };
  layers: CanvasMapperLayer[] = [];
  height: number = 0;
  width: number = 0;
  eventCtr: SLUCanvasMapperEvent;
  /**监听容器大小变化 */
  resize$: ResizeObserver | null;
  destroy$: Subject<void> = new Subject();
  /**当前偏移 默认0，0 未偏移 */
  currentOffsetPosition: [number, number] = [0, 0];
  /**当前坐标映射比例 */
  currentProportionPixel: [number, number] = [1, 1];
  /**当前中心 */
  currentCenter: [number, number];
  /**当前缩放比例 */
  scale: number = 1;
  pixelRatio: number = 1;
  constructor(id: string, config?: CanvasMapperConfig);
  constructor(el: HTMLElement, config?: CanvasMapperConfig);
  constructor(a: HTMLElement | string, config?: CanvasMapperConfig) {
    const that = this;
    that.mapContainerEl = typeof a == 'string' ? document.querySelector(a)! : a;
    that.eventCtr = new SLUCanvasMapperEvent();
    that.updateConfig(config);
    that.resetMapper();
    that.initEvent();
    that.resize$ = new ResizeObserver(entries => {
      SLUSettimeout.cb = {
        key: 'canvas-map-reset',
        cb: () => {
          that.resetMapper();
        },
        time: 100
      };
    });
    that.resize$.observe(this.mapContainerEl);
  }
  /**更新配置 */
  updateConfig(config: CanvasMapperConfig) {
    const that = this;
    const { baseOffset, baseProportionPixel, scale, pixelRatio } = that.setConfig(config);
    // 动态赋值
    that.currentOffsetPosition = [...baseOffset];
    that.currentProportionPixel = [...baseProportionPixel];
    that.pixelRatio = pixelRatio;
    that.scale = scale;
    /**重新初始化事件 */
    this.initEvent();
  }
  /**设置配置 */
  setConfig(config: CanvasMapperConfig) {
    const that = this;
    for (let key in config) {
      console.log(key);
      that.config[key] = config[key];
    }
    return that.config;
  }
  /**设置中心点 */
  setView(x: number, y: number, scale: number = this.scale) {
    const that = this,
      { config, currentOffsetPosition, width, height } = that,
      { baseXY, baseOffset, baseProportionPixel } = config;
    /**获取中心像素坐标 */
    const center = [width / 2, height / 2];
    // 获取容器坐标
    const [cx, cy] = that.getContainerPosition(x, y);
    const [ox, oy] = that.getContainerPosition(baseXY[0], baseXY[1]);
    /**改变偏移到圆心位置 */
    const dx = ox - cx,
      dy = oy - cy;
    that.scale = scale;
    that.currentProportionPixel[0] = baseProportionPixel[0] / that.scale;
    that.currentOffsetPosition = [center[0] + dx, center[1] + dy];
    that.update();
    return that;
  }
  /**像素坐标转为默认坐标 */
  containerPositionToDefault(x: number, y: number) {}
  initEvent() {
    const that = this,
      { canvasContainer: mapEl, config, currentOffsetPosition, eventCtr } = that,
      { dragging, boxScale } = config || {},
      { eventMap } = eventCtr;
    that.destroy$.next();
    if (mapEl) {
      if (dragging) {
        fromEvent(mapEl, 'mousedown')
          .pipe(
            takeUntil(that.destroy$),
            switchMap(event => {
              return fromEvent(mapEl, 'mousemove').pipe(takeUntil(fromEvent(document.body, 'mouseup')));
            })
          )
          .subscribe((ev: MouseEvent) => {
            // 拖拽
            const { movementX, movementY } = ev;
            that.currentOffsetPosition = [
              that.currentOffsetPosition[0] + movementX,
              that.currentOffsetPosition[1] + movementY
            ];
            that.update();
            eventCtr.emit('moveend', { offset: that.currentOffsetPosition });
            that.emitLayer('moveend', { offset: that.currentOffsetPosition });
          });
      }
      if (boxScale) {
        fromEvent(mapEl, 'mousewheel')
          .pipe(takeUntil(that.destroy$))
          .subscribe((ev: WheelEvent) => {
            const { deltaY, offsetX, offsetY } = ev;
            // 滚轮缩放
            that.onScale(offsetX, offsetY, deltaY);
            that.update();
            eventCtr.emit('zoom', { scale: that.scale });
            that.emitLayer('zoom', { scale: that.scale });
          });
      }
      fromEvent(mapEl, 'click')
        .pipe(takeUntil(that.destroy$))
        .subscribe((ev: PointerEvent) => {
          const { x, y } = ev;
          eventCtr.emit('click', { x, y });
          that.emitLayer('click', { x, y });
        });
    }
  }
  update() {
    const that = this,
      { layers } = that;
    layers.forEach(layer => layer.update());
  }
  emitLayer(evName: string, $event) {
    this.layers.forEach(layer => {
      layer.emit(evName, $event);
    });
  }
  /**重设地图容器大小 */
  resetMapper() {
    const { width, height } = this.mapContainerEl.getBoundingClientRect();
    if (!this.canvasContainer) {
      this.canvasContainer = document.createElement('div');
      this.canvasContainer.className = 'canvas-container';
      this.mapContainerEl.appendChild(this.canvasContainer);
    }
    this.width = width;
    this.height = height;
    this.canvasContainer.style.width = width + 'px';
    this.canvasContainer.style.height = height + 'px';
    this.layers.forEach(layer => {
      layer.reset();
    });
  }
  getContainerPosition(x: number, y: number) {
    const that = this,
      { config, currentOffsetPosition, currentProportionPixel } = that,
      { mapping, baseXY } = config;
    const [offsetX, offsetY] = currentOffsetPosition;
    const [proportion, pixel] = currentProportionPixel;
    const [bX, bY] = baseXY;
    let ox, oy, cx, cy;
    if (mapping) {
      /**二次转换 */
      const [mapBx, mapBy] = mapping(bX, bY);
      const [mapCx, mapCy] = mapping(x, y);
      (ox = mapBx), (oy = mapBy);
      (cx = mapCx), (cy = mapCy);
    } else {
      /**否则直接根据基点和给的点 等比例换算 */
      (ox = bX), (oy = bY);
      (cx = x), (cy = y);
    }
    const scale = pixel / proportion; // 每n个自定义单位 对应m个像素;
    const dx = cx - ox;
    const dy = cy - oy;
    return [scale * dx + offsetX, scale * dy + offsetY];
  }
  /**
   * 设置缩放大小
   * 重设单位和像素比例实现缩放
   **/
  setScale(detalWheel: number) {
    const that = this,
      { config, scale } = that,
      { baseProportionPixel, maxScale, minScale, scaleDelta } = config;
    if (detalWheel > 0) {
      let changeScale = scale - scaleDelta;
      // 缩小
      that.scale = changeScale <= minScale ? minScale : changeScale;
    } else {
      let changeScale = scale + scaleDelta;
      // 放大
      that.scale = changeScale >= maxScale ? maxScale : changeScale;
    }
    that.currentProportionPixel[0] = baseProportionPixel[0] / that.scale;
  }
  on(eventName: string, cb: Function) {
    this.eventCtr.on(eventName, cb);
  }
  off();
  off(eventName: string);
  off(eventName: string, fn: Function[] | Function);
  off(eventName?: string, fn?: Function[] | Function) {
    if (fn) {
      this.eventCtr.off(eventName, fn);
    } else if (eventName) {
      this.eventCtr.off(eventName);
    } else {
      this.eventCtr.off();
    }
  }
  /**根据鼠标位置基准偏移和缩放 */
  onScale(mouseX, mouseY, deltaWheel) {
    const that = this,
      { currentOffsetPosition, currentProportionPixel } = that,
      [baseOffsetX, baseOffsetY] = currentOffsetPosition;
    // 缩放之前
    const preScaleValue = currentProportionPixel[1] / currentProportionPixel[0];
    that.setScale(deltaWheel);
    // // 缩放比例
    const scaleValue = currentProportionPixel[1] / currentProportionPixel[0];
    // // 之前鼠标位置和鼠标位置缩放后应偏移的位置
    const [newX, newY] = [
      ((mouseX - baseOffsetX) / preScaleValue) * scaleValue + baseOffsetX,
      ((mouseY - baseOffsetY) / preScaleValue) * scaleValue + baseOffsetY
    ];
    // // 基准点偏移量 等同于 新位置偏移量
    const [dx, dy] = [newX - mouseX, newY - mouseY];
    that.currentOffsetPosition = [baseOffsetX - dx, baseOffsetY - dy];
  }
  /**添加图层 */
  addLayer(layer: CanvasMapperLayer) {
    layer.addTo(this);
  }
  /**删除图层 */
  removeLayer(layer: CanvasMapperLayer) {
    const delIdx = this.layers.findIndex(el => el == layer);
    if (delIdx == -1) {
      return;
    }
    this.layers.splice(delIdx, 1);
    this.canvasContainer.removeChild(layer.canvasEl);
  }
  destroy() {
    this.resize$?.disconnect();
    this.resize$ = null;
    this.eventCtr.off();
    this.mapContainerEl.removeChild(this.canvasContainer);
  }
}
/**
 * 图层基类
 * 可结合konava.js绘制
 *  */
export class CanvasMapperLayer {
  protected width!: number;
  protected height!: number;
  protected ctx!: CanvasRenderingContext2D;
  protected _mapper!: SLUCanvasMapper2;
  /**事件暂存 实现清除图层mapper同步清除该图层事件 */
  protected layerEventCtr!: SLUCanvasMapperEvent;
  /**所有事件统一通过Mapper转发到layer*/
  public canvasEl!: HTMLCanvasElement;
  public zIndex: number = 0;
  public mapElements: CanvasMapperElement[] = [];
  public groupElements: CanvasMapperGroup[] = [];

  get canvasContext() {
    return this.ctx;
  }
  get mapper() {
    return this._mapper;
  }
  constructor() {}
  public addTo(mapper: SLUCanvasMapper2) {
    if (this._mapper) {
      return this;
    }
    this._mapper = mapper;
    this.layerEventCtr = new SLUCanvasMapperEvent();
    this.mapper.layers.push(this);
    this.resetCanvas();
    this.onAdd();
    this.update();
    this.mapper.canvasContainer.appendChild(this.canvasEl);
    return this;
  }
  resetCanvas() {
    if (!this.canvasEl) {
      this.canvasEl = document.createElement('canvas');
      this.canvasEl.style.position = 'absolute';
      this.canvasEl.style.top = '0';
      this.canvasEl.style.left = '0';
    }
    const { width, height, config, pixelRatio } = this.mapper;
    this.canvasEl.style.width = width + 'px';
    this.canvasEl.style.height = height + 'px';
    this.canvasEl.width = width * pixelRatio;
    this.canvasEl.height = height * pixelRatio;
    this.width = width;
    this.height = height;
    this.ctx = this.canvasEl.getContext('2d')!;
    if (pixelRatio !== 1) {
      /**等比例放大 */
      this.ctx.scale(pixelRatio, pixelRatio);
    }
  }
  emit(evName: string, $event) {
    this.layerEventCtr.emit(evName, $event);
  }
  public remove() {
    if (!this.mapper) return;
    this.mapper.removeLayer(this);
    this.off();
    this.onRemove();
    this._mapper = null;
  }
  public destroy() {
    this.off();
    this.layerEventCtr = null;
    this.onDestroy();
  }
  public update() {
    this.clearCanvas();
    this.mapElements.forEach(el => {
      el.render();
    });
    this.groupElements.forEach(el => el.render());
    this.onUpdate();
  }
  /**清除画布 */
  public clearCanvas() {
    const that = this,
      { ctx } = that;
    ctx.clearRect(0, 0, that.width, that.height);
  }
  /**更新回调 */
  onUpdate() {}
  public reset() {
    this.resetCanvas();
    this.update();
  }
  /**重新绑定 */
  public on(eventName: string, cb: Function | Function[]) {
    this.layerEventCtr.on(eventName, cb);
  }
  /**解绑当前图层所有事件 */
  public off();
  public off(eventName: string);
  public off(eventName: string, cb: Function[] | Function);
  public off(eventName?: string, cb?: Function | Function[]) {
    if (cb) {
      this.layerEventCtr.off(eventName, cb);
    } else if (eventName) {
      this.layerEventCtr.off(eventName);
    } else {
      this.layerEventCtr.off();
    }
  }
  protected onAdd() {}
  protected onRemove() {}
  protected onDestroy() {}
}
export class CanvasMapperAnimeLayer extends CanvasMapperLayer {
  animeFlag?: number;
  animeCb?: Function;
  override onAdd() {
    this.animeRender();
  }
  /**动画图层回调 */
  anime(cb: Function) {
    this.animeCb = cb;
  }
  animeRender() {
    this.cancelAnime();
    this.animeFlag = requestAnimationFrame(() => {
      this.animeRender();
    });
    this.animeCb && this.animeCb();
  }
  private cancelAnime() {
    this.animeFlag && cancelAnimationFrame(this.animeFlag);
  }
  protected override onRemove(): void {
    super.onRemove();
    this.cancelAnime();
  }
  protected override onDestroy(): void {
    super.onDestroy();
    this.cancelAnime();
  }
}
export class SLUCanvasAnimeController {
  /**动画缓存所有状态 */
  animeMap: Map<string, CanvasAnimeState> = new Map();
  constructor() {}
}
/**事件控制 */
export class SLUCanvasMapperEvent {
  public eventMap: Map<string, Function[]> = new Map();
  constructor() {}
  getEventsByName(evName: string) {
    return this.eventMap.get(evName) || [];
  }
  emit(evName: string, $event: any) {
    this.getEventsByName(evName).forEach(cb => cb($event));
  }
  /**清除所有事件 */
  off();
  /**
   * 清除事件其下所有绑定
   * @param eventName
   */
  off(eventName: string);
  /**
   * 清除其下绑定事件 回调数组
   * @param eventName
   */
  /**
   * 清除其下绑定事件 回调
   * @param eventName
   */
  off(eventName: string, cbs: Function[] | Function);
  off(eventName?: string, cbs?: Function | Function[]) {
    if (cbs) {
      if (!Array.isArray(cbs)) {
        const delIdx = this.eventMap.get(eventName).findIndex(el => el == cbs);
        if (delIdx !== -1) this.eventMap.get(eventName).splice(delIdx, 1);
        this.eventMap.set(eventName, this.eventMap.get(eventName));
      } else {
        cbs.forEach(cb => {
          this.off(eventName, cb);
        });
      }
    } else if (eventName) {
      // 清除所有 eventName相关
      this.eventMap.set(eventName, []);
    } else {
      // 清除所有绑定的 event
      this.eventMap = new Map();
    }
  }
  on(eventName: string, cbs: Function | Function[]) {
    if (Array.isArray(cbs)) {
      this.eventMap.set(eventName, this.eventMap.get(eventName)?.concat(cbs) || [...cbs]);
    } else {
      this.eventMap.set(eventName, this.eventMap.get(eventName)?.concat(cbs) || [cbs]);
    }
  }
}
export abstract class CanvasMapperGroup {
  /**所在图层 */
  layer: CanvasMapperLayer;
  element: CanvasMapperElement[] = [];
  constructor() {}
  abstract render();
  addTo(layer: CanvasMapperLayer) {
    this.layer = layer;
    this.onAdd();
    this.render();
    return this;
  }
  onAdd() {}
  remove() {}
  onRemove() {}
}
/**绘制元素基类 */
export abstract class CanvasMapperElement {
  /**元素唯一 */
  uuid: string;
  /**动画阶段 */
  animeStage: number = 0;
  /**动画进度 */
  animeProgress: number = 0;
  /**默认坐标系位置 */
  ox!: number;
  oy!: number;
  /**画布像素坐标位置 */
  cx!: number;
  cy!: number;
  /**所在图层 */
  layer: CanvasMapperLayer;
  /**所在容器 */
  mapper: SLUCanvasMapper2;
  constructor(ox: number, oy: number) {
    this.ox = ox;
    this.oy = oy;
  }
  abstract render();
  addTo(layer: CanvasMapperLayer) {
    this.layer = layer;
    this.mapper = layer.mapper;
    this.layer.mapElements.push(this);
    this.onAdd();
    this.render();
    return this;
  }
  onAdd() {}
  remove() {
    if (this.layer) {
      this.layer.mapElements.splice(this.layer.mapElements.indexOf(this), 1);
      this.layer.update();
    }
    this.onRemove();
  }
  onRemove() {}
}
