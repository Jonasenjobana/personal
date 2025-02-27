import { fromEvent } from 'rxjs';

// 用于canvas模拟地图效果
export class SLUCanvasMapper {
  public ctx!: CanvasRenderingContext2D;
  public animeCtx?: CanvasRenderingContext2D;
  public config!: CanvasMapperConfig;
  private scale = 1;
  private mapScale!: [number, number]; // 米 ，像素
  private basePointOffset!: [number, number];
  private mapEl!: HTMLCanvasElement;
  /**单元素 点线面 map可以更详细区分类型 <line, []> <point, []>等*/
  private allEleMap: Map<string, CanvasMapperElement[]> = new Map();
  /**多元素组成一组 轨迹*/
  private allGroupMap: Map<string, CanvasMapperElementGroup[]> = new Map();
  /**播放时间 */
  public playTime?: number
  private animeFn?: number
  constructor(config: CanvasMapperConfig) {
    this.setConfig(config);
    this.initMap();
  }
  /**创建地图 */
  initMap() {
    const that = this,
      { config } = that,
      { mapEl, width, height, animeEl } = config;
    (mapEl.width = width), (mapEl.height = height);
    that.mapEl = mapEl;
    that.ctx = mapEl.getContext('2d')!;
    if (animeEl) {
      animeEl.width = width, animeEl.height = height;
      that.animeCtx = animeEl.getContext('2d')!;
    }
    that.registerEvent();
  }
  setPlayTime(time: number) {
    this.playTime = time;
    this.renderAll();
  }
  setConfig(config: CanvasMapperConfig) {
    this.config = Object.assign(
      {
        draggable: true,
        scaleOption: {
          scaleMax: 20,
          scaleMin: 1,
          deltaScale: 0.2
        },
      },
      config
    );
    const {baseMeterPixel, baseOffset} = this.config.basePoint
    this.mapScale = [...baseMeterPixel];
    this.basePointOffset = [...baseOffset];
  }
  getEleByKey<T extends CanvasMapperBaseInfo>(key: string): CanvasMapperElement<T>[] | undefined {
    return this.allEleMap.get(key);
  }
  getGroupByKey(key: string) {
    return this.allGroupMap.get(key);
  }
  setEleMap(key: string, datas: CanvasMapperElement[]) {
    this.allEleMap.set(key, datas);
  }
  clearEleMapByKey(key: string) {
    this.allEleMap.set(key, []);
  }
  setGroupMap(key: string, datas: CanvasMapperElementGroup[]) {
    this.allGroupMap.set(key, datas);
  }
  clearGroupMapByKey(key: string) {
    this.allGroupMap.set(key, []);
  }
  allEle() {
    let allEle: CanvasMapperElement[] = [];
    this.allEleMap.forEach((value) => {
      allEle.push(...value)
    })
    return allEle;
  }
  /**判断点有无在边界外 */
  inBound(x: number, y: number) {
    const that = this, {config} = that, {inBoundCb, width, height} = config
    if (inBoundCb) {
      // 特殊边界
      return inBoundCb(x, y);
    }
    // 默认矩形边界
    return x <= width && y <= height;
  }
  /**注册地图基本事件 */
  registerEvent() {
    const that = this, { mapEl, config } = that, {draggable} = config;
    let isDragger = false, preOffset
    fromEvent(mapEl, 'mousemove').subscribe((event: MouseEvent) => {
        const {offsetX, offsetY} = event;
        mapEl.style.cursor = that.allEle().some((el) => {
                const { x, y, targetRange = [4, 4] } = el, [rangeX, rangeY] = targetRange;
                return x + rangeX >= offsetX && x - rangeX <= offsetX && y + rangeY >= offsetY && y - rangeY <= offsetY;})
                ? 'pointer' : draggable ? 'grab' : 'default'
        if (isDragger && draggable) {
            // 拖拽
            const {movementX, movementY} = event;
            // this.ctx.translate(movementX , movementY);
            that.setMapperOffset(movementX, movementY);
            that.renderAll()
            mapEl.style.cursor = 'grabbing';
        }
    });
    fromEvent(mapEl, 'mousedown').subscribe((event: MouseEvent) => {
        isDragger = true;
        const { offsetX, offsetY } = event;
        preOffset = [offsetX, offsetY];
    });
    fromEvent(document.body, 'mouseup').subscribe((event: MouseEvent) => {
      isDragger = false; 
      const {offsetX, offsetY} = event;
      // 还原点击前的canvas原点偏移
      // this.ctx.translate(preOffset[0] - offsetX, preOffset[1] - offsetY);
      // 再改变基准点偏移
      // this.setMapperOffset(offsetX - preOffset[0], offsetY - preOffset[1]);
      // 根据新的坐标参考 重绘所有点
      // this.renderAll();
      const selectedEl = this.allEle().find((el) => {
        const { x, y, targetRange = [4, 4] } = el, [rangeX, rangeY] = targetRange;
        return x + rangeX >= offsetX && x - rangeX <= offsetX && y + rangeY >= offsetY && y - rangeY <= offsetY;
      });
      if (selectedEl) {
        selectedEl.onClick && selectedEl.onClick(event);
      }
      this.config.clickCb && this.config.clickCb(event, selectedEl);
      this.mapEl.style.cursor = draggable ? 'grab' : 'default';
    });
    fromEvent(mapEl, 'mousewheel').subscribe((event: WheelEvent) => {
        const { deltaY, offsetX, offsetY } = event;
        this.onScale(offsetX, offsetY, deltaY);
    });
    fromEvent(mapEl, 'dblclick').subscribe((event: MouseEvent) => {
      this.config.dbClickCb && this.config.dbClickCb(event);
    });
  }
  /**
   * 经纬度 获取画布xy坐标位置
   * 缩放偏移原理都是根据基准点偏移 像素m比例进行的
   **/
  getRadarMapXY(lat: number | string, lng: number | string) {
    const that = this,
      { config, basePointOffset, mapScale } = that,
      { basePoint } = config,
      { baseLatlng } = basePoint;
    return latlngToPixel(
      [Number(lat), Number(lng)],
      baseLatlng,
      ...mapScale,
      ...basePointOffset
    );
  }
  /**设置地图偏移 */
  setMapperOffset(offsetX, offsetY) {
    const that = this,
      { basePointOffset } = that;
    that.basePointOffset = [basePointOffset[0] + offsetX, basePointOffset[1] + offsetY];
  }
  /**
   * 设置缩放大小
   * 重设米和像素比例实现缩放
   **/
  setScale(detalWheel: number) {
    const that = this,
      { config, scale } = that,
      { scaleMax, scaleMin, deltaScale } = config.scaleOption!,
      { baseMeterPixel } = config.basePoint;
    if (detalWheel > 0) {
      // 缩小
      that.scale = scale <= scaleMin ? scaleMin : scale - deltaScale;
    } else {
      // 放大
      that.scale = scale >= scaleMax ? scaleMax : scale + deltaScale;
    }
    that.mapScale[0] = baseMeterPixel[0] / that.scale;
  }
  /**根据鼠标位置基准偏移和缩放 */
  onScale(mouseX, mouseY, deltaWheel) {
    const that = this,
      { basePointOffset, mapScale } = that,
      [baseOffsetX, baseOffsetY] = basePointOffset;
    // 缩放之前
    const preScaleValue = mapScale[1] / mapScale[0];
    that.setScale(deltaWheel);
    // 缩放比例
    const scaleValue = mapScale[1] / mapScale[0];
    // 之前鼠标位置和鼠标位置缩放后应偏移的位置
    const [newX, newY] = [
      ((mouseX - baseOffsetX) / preScaleValue) * scaleValue + baseOffsetX,
      ((mouseY - baseOffsetY) / preScaleValue) * scaleValue + baseOffsetY,
    ];
    // 基准点偏移量 等同于 新位置偏移量
    const [dx, dy] = [newX - mouseX, newY - mouseY];
    that.basePointOffset = [baseOffsetX - dx, baseOffsetY - dy];
    this.renderAll();
  }
  /**渲染地图所有相关元素 */
  renderAll() {
    const that = this, {config} = that;
    that.clearCanvas();
    that.allEleMap.forEach(value => {
        value.forEach(el => {
          el.updateXY();
          // 更新静态元素
          !el.isAnime && el.render();
        })
    });
    that.allGroupMap.forEach(value => {
        value.forEach(group => {
          !group.isAnime && group.render();
        })
    });
    // 绘制动态元素
    that.renderAnime();
    config.renderCb && config.renderCb();
  }
  renderAnime() {
    if (!this.animeCtx) return;
    // 取消上一次动画
    this.cancelAnime();
    this.anime();
  }
  anime(timeStamp?: number) {
    this.clearAnime();
    // 动画元素是否为空
    let isAnmieEmpty = true;
    const that = this, {allEleMap, allGroupMap} = that;
    allEleMap.forEach((value, key) => {
      value.filter(el => el.isAnime).forEach(el => {
        isAnmieEmpty = false;
        el.updateAnimeTime(timeStamp);
        el.render();
      })
    });
    allGroupMap.forEach(value => {
      value.filter(el => el.isAnime).forEach(group => {
        isAnmieEmpty = false
        // 各个元素到达自身的更新时间
        group.updateAnimeTime(timeStamp);
        group.render();
      })
    });
    that.animeFn = requestAnimationFrame((timeStamp: number) => {
      this.anime(timeStamp);
      if (isAnmieEmpty) {
        this.cancelAnime();
      }
    })
  }
  /**取消动画 */
  cancelAnime() {
    // 防止内存泄漏
    this.animeFn && cancelAnimationFrame(this.animeFn);
    this.animeFn = undefined;
  }
  clearCanvas() {
    const that = this, {ctx, config} = that, {width, height} = config;
    ctx.save();
    // 还原矩形变化并且清除画布
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.restore();
  }
  clearAnime() {
    const that = this, {animeCtx, config} = that, {width, height} = config;
    if (!animeCtx) return;
    animeCtx.save();
    // 还原矩形变化并且清除画布
    animeCtx.setTransform(1, 0, 0, 1, 0, 0);
    animeCtx.clearRect(0, 0, width, height);
    animeCtx.restore();
  }
  /**还原默认比例 和 偏移 */
  resetMap() {
    const that = this, {config} = that, {baseOffset, baseMeterPixel} = config.basePoint;
    this.basePointOffset = [...baseOffset];
    this.mapScale = [...baseMeterPixel];
    this.scale = 1;
    this.renderAll();
  }
  onDestroy() {
    this.cancelAnime();
  }
}
// canvas mapper 基础配置
export interface CanvasMapperConfig {
  mapEl: HTMLCanvasElement;
  /**动画图层 */
  animeEl?: HTMLCanvasElement;
  width: number;
  height: number;
  style?: Object;
  /**边界判断 */
  inBoundCb?: (x: number, y: number) => boolean
  /**每次渲染回调 */
  renderCb?: () => void;
  /**选中 */
  clickCb?: (...any) => void;
  dbClickCb?: (...any) => void; 
  /**允许拖拽 */
  draggable?: boolean
  /**地图基点 */
  basePoint: {
    /**集点经纬度 */
    baseLatlng: [number, number];
    /**地图集点默认偏移 */
    baseOffset: [number, number];
    /** 地图 米 和 对应像素 */
    baseMeterPixel: [number, number];
  };
  /**缩放配置 */
  scaleOption?: {
    scaleMax: number;
    scaleMin: number;
    /**缩放变化量 */
    deltaScale: number;
  };
}
// 根据需求只需要重写render方法 减少内部和业务耦合
// 静态元素
export abstract class CanvasMapperElementGroup {
    mapper!: SLUCanvasMapper;
    ctx!: CanvasRenderingContext2D;
    /**动画图层 */
    animeCtx?: CanvasRenderingContext2D
    // 动画元素
    isAnime?: boolean
    /**动画状态 */
    animeState?: CanvasElementAnimeState
    constructor(canvasMapper: SLUCanvasMapper) {
        this.mapper = canvasMapper;
        this.ctx = canvasMapper.ctx;
    }
    abstract render();
    updateAnimeTime(timeStamp?: number): boolean { return false};
}
// 根据需求只需要重写render方法 减少内部和业务耦合
// 静态元素
export abstract class CanvasMapperElement<T extends CanvasMapperBaseInfo = any> {
    x!: number
    y!: number
    mapper!: SLUCanvasMapper;
    /**静态图层 */
    ctx!: CanvasRenderingContext2D;
    animeCtx?: CanvasRenderingContext2D
    // 业务数据 至少有lat lng字段用于转化为坐标
    info: T;
    // 动画元素
    isAnime?: boolean
    /**动画状态 */
    animeState?: CanvasElementAnimeState
    onClick?: (e: MouseEvent) => void;
    /**触发范围 */
    targetRange?: [number, number]
    constructor(info: T, canvasMapper: SLUCanvasMapper) {
        this.mapper = canvasMapper;
        this.ctx = canvasMapper.ctx;
        this.info = info;
        this.updateXY();
    }
    abstract render();
    /**重新更新坐标 */
    updateXY() {
      const {lat, lng} = this.info;
      const [x, y] = this.mapper.getRadarMapXY(lat, lng);
      this.x = x, this.y = y;
    }
    updateAnimeTime(timeStamp?: number): boolean { return false};
}
// 动态元素
export abstract class CanvasMapperElementAnime<T extends CanvasMapperBaseInfo = any> extends CanvasMapperElement {
    constructor(info: T, mapper: SLUCanvasMapper) {
      super(info, mapper);
      this.isAnime = true;
      this.animeCtx = mapper.animeCtx!;
    }
    /**动画图层 */
    override animeCtx!: CanvasRenderingContext2D
    /**重置动画状态 */
    abstract resetAnimeState()
    /**更新动画状态 */
    abstract updateAnimeStatus()
     /**更新动画时间 */
    override updateAnimeTime(timeStamp?: number) {
      const that = this, {animeState, isAnime} = that;
      if (isAnime && animeState) {
        if (!timeStamp) {
          animeState.curTimeStamp = timeStamp;
          return false;
        }
        const diff = timeStamp - (animeState.curTimeStamp || 0);
        if (diff >= animeState.animeTime) {
          animeState.curTimeStamp = timeStamp;
          this.updateAnimeStatus();
          return true;
        }
      }
      return false;
    }
}
// 动态元素
export abstract class CanvasMapperElementGroupAnime extends CanvasMapperElementGroup {
    constructor(mapper: SLUCanvasMapper) {
      super(mapper);
      this.isAnime = true;
      this.animeCtx = mapper.animeCtx!;
    }
    /**重置动画状态 */
    abstract resetAnimeState();
      /**更新动画状态 */
    abstract updateAnimeStatus();
    /**更新动画时间 */
    override updateAnimeTime(timeStamp?: number) {
      const that = this, {animeState, isAnime} = that;
      if (isAnime && animeState) {
        if (!timeStamp) {
          animeState.curTimeStamp = timeStamp;
          return false;
        }
        const diff = timeStamp - (animeState.curTimeStamp || 0);
        if (diff >= animeState.animeTime) {
          animeState.curTimeStamp = timeStamp;
          that.updateAnimeStatus();
          return true;
        }
      }
      return false;
    }
}
interface CanvasMapperBaseInfo {
  lat: number | string
  lng: number | string
}
export interface CanvasElementAnimeState {
  // 执行动画时间
  animeTime: number
  // 当前时间戳
  curTimeStamp?: number
}

/**
 * 经纬度转 像素坐标
 * @param currentLatlng 当前经纬度 坐标
 * @param orginLatlng 原点所在经纬度 默认左上角
 * @param boundMeter  原点到边界距离多少m
 * @param boundPixel  原点到边界距离多少像素
 * @param offsetX 原点左上角pixel 偏移到某个位置
 * @param offsetY 原点左上角pixel 偏移到某个位置（比如 圆心距离左上角偏移
 * 计算 像素和经纬度之间的比例
 */
function latlngToPixel(currentLatlng: [number, number], orginLatlng: [number, number], boundMeter: number, boundPixel: number, offsetX: number = 0, offsetY: number = 0) {
    const [orglat, orglng] = orginLatlng;
    const [curlat, curlng] = currentLatlng;
    const { x: ox, z: oy } = latLngToMercator(orglat, orglng);
    const { x: cx, z: cy } = latLngToMercator(curlat, curlng);
    const scale = boundPixel / boundMeter;// 每米对应多少像素;
    const dx = cx - ox; const dy = cy - oy;
    return [scale * dx + offsetX, scale * dy + offsetY];
}
// 将经纬度转换为墨卡托投影坐标
function latLngToMercator(latitude: number, longitude: number): {x: number, y: number, z: number} {
    const earthRadius = 6371000; // 地球半径（米）
    // 将纬度从度转换为弧度
    const latRad = latitude * Math.PI / 180;
    // 计算墨卡托坐标的X、Y值
    const x = earthRadius * longitude * Math.PI / 180;
    const z = earthRadius * Math.log(Math.tan((Math.PI / 4) + (latRad / 2)));
    return {x, y: 0, z: -z}
}