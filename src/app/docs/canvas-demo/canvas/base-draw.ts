export class CanvasDrawTool {
  ctx: CanvasRenderingContext2D;
  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }
  setPara(option: Partial<CanvasRenderingContext2D>) {
    this.ctx.save();
    Object.assign(this.ctx, option);
  }
  drawPoint(points: [number, number][], radius: number = 5, option: Partial<CanvasRenderingContext2D>) {
    const ctx = this.ctx;
    const defaultOption = Object.assign(
      {},
      {
        fillStyle: '#185efe',
        strokeStyle: '#185efe'
      },
      option
    );
    this.setPara(defaultOption);
    ctx.beginPath();
    points.forEach(point => {
      const [x, y] = point;
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();
    });
    ctx.closePath();
    ctx.restore();
  }
  drawLine(points: [number, number][], option: Partial<CanvasRenderingContext2D>) {
    const ctx = this.ctx;
    const defaultOption = Object.assign(
      {},
      {
        lineWidth: 3,
        strokeStyle: '#000',
        fillStyle: '#000'
      },
      option
    );
    this.setPara(defaultOption);
    ctx.beginPath();
    let startPoint = points[0];
    ctx.moveTo(startPoint[0], startPoint[1]);
    points.slice(1).forEach(point => {
      const [x, y] = point;
      ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }
  /**
   *
   * @param image
   * @param size 画布上的大小
   * @param position 画布上的位置
   * @param oPosition 图片上的位置 默认左上角 点位一般取中间，需要手动计算偏移
   * @param oSize 图片上的大小 默认整张图
   */
  async drawImage(
    image: HTMLImageElement,
    size: [number, number],
    position: [number, number],
    oPosition = [0, 0],
    oSize = [image.width, image.height]
  ) {
    const ctx = this.ctx;
    ctx.drawImage(
      image,
      oPosition[0],
      oPosition[1],
      oSize[0],
      oSize[1],
      position[0] - oSize[0] / 2,
      position[1] - oSize[1] / 2,
      size[0],
      size[1]
    );
  }
  drawText(text: string) {

  }
  drawRect(points: [number, number][]) {
    this.ctx.restore();
  }
  drawPolygen() {
    this.ctx.restore();
  }
  clearCanvas() {
    this.ctx.clearRect(0, 0, 100000, 100000);
  }
}
