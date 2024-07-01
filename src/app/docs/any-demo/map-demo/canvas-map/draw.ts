import { CanvasMapperElement } from '../util/slu-canvas-mapper2';
export class Line extends CanvasMapperElement {
    radius: number;
    color: string;
    override render() {
      const that = this,
        { ox, oy, mapper, layer, radius = 50, color = '#00ff00' } = that,
        { canvasContext: ctx } = layer;
      const [cx, cy] = mapper.getContainerPosition(ox, oy);
      ctx.save();
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    constructor(config: ArcConfig) {
      const { latlng, color, radius } = config;
      super(latlng[1], latlng[0]);
      this.radius = radius;
      this.color = color;
    }
  }
export class Arc extends CanvasMapperElement {
  radius: number;
  color: string;
  override render() {
    const that = this,
      { ox, oy, mapper, layer, radius = 50, color = '#00ff00' } = that,
      { canvasContext: ctx } = layer;
    const [cx, cy] = mapper.getContainerPosition(ox, oy);
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  constructor(config: ArcConfig) {
    const { latlng, color, radius } = config;
    super(latlng[1], latlng[0]);
    this.radius = radius;
    this.color = color;
  }
}
/**test 输水系统背景 */
export class GlassBg extends CanvasMapperElement {
  bgImage: HTMLImageElement;
  width: number;
  height: number;
  ifLoad: boolean = false;
  constructor(params: { width: number; height: number, offset: [number, number] }) {
    const { width, height, offset } = params;
    super(...offset);
    this.bgImage = new Image(width, height);
    this.width = width;
    this.height = height;
    this.bgImage.src = '/assets/images/map/test-bg.png';
    this.bgImage.onload = () => {
      this.ifLoad = true;
    };
  }
  override onAdd(): void {
    const that = this,
      { layer } = that,
      { canvasContext: ctx } = layer;
  }
  override render() {
    if (!this.ifLoad) return;
    const that = this,
      { layer, mapper } = that,
      { canvasContext: ctx } = layer,
      { currentOffsetPosition, scale } = mapper
    ctx.save();
    ctx.drawImage(that.bgImage, currentOffsetPosition[0], currentOffsetPosition[1], that.width * scale, that.height * scale);
    ctx.restore();
  }
}
export interface ArcConfig {
  latlng: [number, number];
  color: string;
  radius: number;
}
