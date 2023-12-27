import * as L from 'leaflet';
import { CanvasLayerOption, LeafletCanvasLayer } from './leaflet-canvas';
export type PlotType = 'Rect' | 'Circle' | 'Point' | 'Line' | 'Polygen' | 'Img' | 'Track' | 'Ship';
export type CanvasPlotOption = CanvasLayerOption & Partial<CanvasRenderingContext2D>;
export type CanvasPointOption = {
  radius: number;
} & CanvasPlotOption;
export class PlotElement<T = any> {
  latlng: L.LatLng;
  data: T;
  zIndex: number;
  constructor(data: T, lat: number, lng: number, zIndex: number = 1) {
    this.data = data;
    this.latlng = L.latLng(lat, lng);
    this.zIndex = zIndex;
  }
}
export class ShipLayer<T = any> extends LeafletCanvasLayer {
  constructor(option: CanvasLayerOption) {
    super(option);
  }
}
// 模拟dom节点生成canvas元素
/**
 * 1、需要实现排版引擎
 * 2、
 */
export class BaseCanvasElement {
  constructor(tag: 'div' | 'span', option: CanvasElementOption) {
    this.tag = tag;
    this.style = option.style;
    this.events = option.events;
  }
  tag: 'div' | 'span';
  style?: StyleSheet;
  events?: { [key in EventName]: EventCb };
  position?: [number, number]
  children: BaseCanvasElement[] = []
  /**
   * 射线法判断有无在元素内部
   * @param event
   */
  isInElement(event: CanvasEvent) {
    const {ctx, offsetX, offsetY} = event
    
  }
}
export type CanvasElementOption = {
  style?: StyleSheet
  attr?: Object
  events?: { [key in EventName]: EventCb }
}
export type EventName = 'click' | 'dbclick' | 'mousemove' | 'mouseleave' | 'mouseenter' | 'wheel';
export type EventCb = (e: CanvasEvent) => void;
export type CanvasEvent = {
  ctx: CanvasRenderingContext2D;
  clientX: number; // 相对浏览器
  clientY: number;
  offsetX: number; // 相对canvas画布
  offsetY: number;
  scrollX?: number;
  scrollY?: number;
};
