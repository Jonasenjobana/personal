import { CanvasMapperElement, CanvasMapperLayer } from '../util/slu-canvas-mapper2';
export class Arc extends CanvasMapperElement {
  radius: number;
  color: string;
  override layer: PipeBackgroundLayer
  override render() {
    const that = this,
      { ox, oy, mapper, layer, radius = 50, color = '#00ff00' } = that,
      { canvasContext: ctx } = layer;
    const [changeX, changeY] = layer.changeXYFromActual(ox, oy);
    const [cx, cy] = mapper.getContainerPosition(changeX, changeY);
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
export interface ArcConfig {
  latlng: [number, number];
  color: string;
  radius: number;
}
export class PipeBackgroundLayer extends CanvasMapperLayer {
  bgWidth!: number;
  bgHeight!: number;
  bgImg: HTMLImageElement;
  ifLoad: boolean = false;
  pWHScale!: number;
  actualWidth: number
  actualHeight: number
  constructor(config: PipeBackgroundConfig) {
    super();
    const { bgWidth, bgHeight, bgUrl } = config;
    this.bgHeight = bgHeight;
    this.bgWidth = bgWidth;
    this.bgImg = new Image(bgWidth, bgHeight);
    this.pWHScale = bgWidth / bgHeight;
    this.bgImg.src = bgUrl;
    this.bgImg.onload = () => {
      this.ifLoad = true;
      this.update();
    };
  }

  override onReset() {
    const that = this,
      { width, height } = that;
  }
  override onUpdate(): void {
    const that = this,
    { canvasContext: ctx, width: lw, height: lh, mapper, pWHScale, mapElements, groupElements } = that;
    /**添加背景 */
    if (this.ifLoad) {
      const { currentOffsetPosition, scale } = mapper;
      if (lw > lh) {
        that.actualWidth = lh * pWHScale * scale;
        that.actualHeight = lh * scale;
      } else {
        that.actualWidth =  lw * scale;
        that.actualHeight = (lw / pWHScale) * scale;
      }
      ctx.drawImage(
        that.bgImg,
        currentOffsetPosition[0],
        currentOffsetPosition[1],
        that.actualWidth,
        that.actualHeight
      );
    }
  }
  /**根据实际背景大小变更 */
  changeXYFromActual(x: number, y: number) {
    const that = this, {bgHeight, bgWidth, actualHeight, actualWidth, mapper} = that;
    const xScale = actualWidth / bgWidth;
    const yScale = actualHeight / bgHeight;
    // actualWidth 和 actualHeight已经乘了比例 但是changeXYFromActual 后续getContainerPosition又乘了一次 避免此情况得去除
    return [x * xScale / mapper.scale, y * yScale/ mapper.scale];
  }
}
export interface PipeBackgroundConfig {
  bgWidth: number;
  bgHeight: number;
  bgUrl: string;
}
