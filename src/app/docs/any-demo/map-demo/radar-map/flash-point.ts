import Konva from 'konva';
import { RadarLayer } from './radar-layer';
import { KonvaEventListener } from 'konva/lib/Node';
import { IFrame } from 'konva/lib/types';
import { KnovaCanvasElement } from './base';
export class FlashPoint extends KnovaCanvasElement {
  id: string;
  flashRadius: number;
  flashColor: string;
  flashTime: number;
  preTime?: number;
  circle: Konva.Circle;
  lat: number;
  lng: number;
  /**动画当前半径 */
  animeRadius: number;
  /**闪烁状态 膨胀 / 收缩 */
  flashStatus: 'swell' | 'shrink' = 'swell';
  flashMax: number
  flashMin: number
  constructor(config: FlashPointConfig) {
    const { id, lat, lng, radius = 3, color = '#fefe00', time = 1000, flashMax = radius + 2, flashMin = 1 } = config;
    super();
    const that = this;
    that.id = id;
    that.lat = lat;
    that.lng = lng;
    that.flashTime = time;
    that.flashColor = color;
    that.flashRadius = radius;
    that.flashMax = flashMax;
    that.flashMin = flashMin;
  }
  override onAdd(): this {
    const { animeLayer, animeEls } = this.layer as RadarLayer;
    this.circle = new Konva.Circle({
      radius: this.flashRadius,
      fill: this.flashColor,
      draggable: true,
      data: {
        s: 'fff',
        cursor: true,
      },
    });
    animeLayer.add(this.circle);
    animeEls.push(this);
    this.animeRadius = this.flashRadius;
    return this;
  }
  override render(frame?: IFrame) {
    const that = this,
      { mapper, lat, lng, animeRadius } = that;
    const [px, py] = mapper.getContainerPosition(lng, lat);
    that.circle.radius(animeRadius);
    that.circle.x(px);
    that.circle.y(py);
    this.cx = px;
    this.cy = py;
    if (!frame) return;
    that.updateAnime(frame)
  }
  updateAnime(frame: IFrame) {
    const that = this, {flashTime, flashRadius, animeRadius, flashStatus, preTime, flashMax, flashMin} = that
    const {frameRate, lastTime} = frame;
    /**动画总帧率 */
    const totalFrame = flashTime / 1000 * frameRate;
    const flashDiff = (flashMax - flashMin) / totalFrame * 2;
    switch(flashStatus) {
      case 'shrink':
        that.animeRadius = animeRadius - flashDiff;
        if (that.animeRadius <= flashMin) {
          that.animeRadius = flashMin;
          that.flashStatus = 'swell';
        }
        break;
      case 'swell':
        that.animeRadius = animeRadius + flashDiff;
        if (that.animeRadius >= flashMax) {
          that.animeRadius = flashMax;
          that.flashStatus = 'shrink';
        }
        break;
    }
    
  }
  on(evName: string, cb: KonvaEventListener<any, any>) {
    this.circle.on(evName, cb);
  }
  off(evName?: string, cb?: KonvaEventListener<any, any>) {
    this.circle.off(evName, cb);
  }
  override onRemove(): void {
      this.circle.remove();
  }
  /**更新动画状态 */
  animeUpdate(delta: number) {
    
  }
}
export interface FlashPointConfig {
  id: string;
  lat: number;
  lng: number;
  /**闪烁最小半径 */
  flashMin?: number;
  /**闪烁最大半径 */
  flashMax?: number;
  /**半径 */
  radius?: number;
  /**闪烁颜色 */
  color?: string;
  /**闪烁周期 ms*/
  time?: number;
  info: any;
}
