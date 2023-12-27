import * as L from 'leaflet';
import { PlotElement } from './base';
export type CanvasLayerOption = {
  className?: string;
  zoomAnime?: boolean;
} & L.LayerOptions;
export class LeafletCanvasLayer<T = any> extends L.Layer {
  constructor(option: CanvasLayerOption) {
    super(option);
    this.options = Object.assign(this.options, option);
  }
  protected renderData: { zIndex: number; plotElement: PlotElement<T>[] }[] = [];
  protected width!: number;
  protected height!: number;
  public ctx!: CanvasRenderingContext2D;
  public ifAddOnMap: boolean = false;
  public override options: CanvasLayerOption = {
    pane: 'canvas',
    zoomAnime: true
  };
  protected canvasEle: HTMLCanvasElement | null = null;
  override onAdd(map: L.Map): this {
    this._map = map;
    if (this.ifAddOnMap) return this;
    this.ifAddOnMap = true;
    this.initCanvasPane();
    this.resetCanvas();
    return this;
  }
  initCanvasPane() {
    const canvas = (this.canvasEle = L.DomUtil.create(
      'canvas',
      `leaflet-layer ${this.options.className || 'leaflet-canvas-map'}`
    ));
    console.log(canvas, this.canvasEle);
    this.ctx = canvas.getContext('2d')!;
    const map = this._map,
      pane = this.options.pane || 'overlayPane',
      animated = this.options.zoomAnime;
    // 创建地图窗格
    this.getPane(pane) || map.createPane(pane).appendChild(this.canvasEle);
    let originProp = '' + L.DomUtil.testProp(['transformOrigin', 'WebkitTransformOrigin', 'msTransformOrigin']);
    L.DomUtil.addClass(canvas, 'leaflet-zoom-' + (animated ? 'animated' : 'hide'));
    this.resetCanvas();
    this.eventSwitch(true);
  }
  override onRemove(map: L.Map): this {
    if (!this.ifAddOnMap) return this;
    this.ifAddOnMap = false;
    const pane = this.options.pane || 'overlayPane';
    this.getPane(pane)?.removeChild(this.canvasEle!);
    this.eventSwitch(false);
    return this;
  }
  resetCanvas() {
    if (!this.canvasEle) return;
    let topLeft = this._map.containerPointToLayerPoint([0, 0]);
    L.DomUtil.setPosition(this.canvasEle, topLeft);
    let size = this._map.getSize();
    this.canvasEle.width = this.width = size.x;
    this.canvasEle.height = this.height = size.y;
  }
  eventSwitch(flag: boolean) {
    const map = this._map;
    let key: 'on' | 'off' = flag ? 'on' : 'off';
    map[key]('moveend', this.resetAll, this);
    map[key]('viewreset', this.resetAll, this);
    map[key]('resize', this.resetAll, this);
    if (map.options.zoomAnimation && L.Browser.any3d) {
      map[key]('zoomanim', this._initZoomAnime, this);
    }
  }
  resetAll() {
    this.resetCanvas();
    this.render(this.options);
  }
  private _initZoomAnime(e: L.ZoomAnimEvent) {
    let map: any = this._map;
    var scale = map.getZoomScale(e.zoom),
      offset = map._getCenterOffset(e.center)._multiplyBy(-scale).subtract(map._getMapPanePos());
    L.DomUtil.setTransform(this.canvasEle!, offset, scale);
  }
  render(option: any) {}
  initDatas(datas: PlotElement<T>[]) {
    datas.forEach(el => {
      this.setData(el);
    });
    this.renderData.sort((a, b) => a.zIndex - b.zIndex);
  }
  setData(data: PlotElement<T>) {
    let findIndex = this.renderData.findIndex(item => item.zIndex === data.zIndex);
    if (findIndex === -1) {
      this.renderData.push({ zIndex: data.zIndex, plotElement: [data] });
    } else {
      this.renderData[findIndex].plotElement.push(data);
    }
  }
  /**
   * 按顺序返回数组
   */
  getDataByOrder() {
    return this.renderData.map(item => {
      return item.plotElement;
    });
  }
}
