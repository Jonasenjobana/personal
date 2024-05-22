export interface ScaleOption {
  el: HTMLElement;
  dragable: boolean;
  bound?: any; // 拖拽边界
  maxScale?: number;
  minScale?: number;
}
// 根据鼠标位置缩放拖拽dom元素
// TODO根据上一个位置推断下一个位置缩放坐标变化
export class ScaleElement {
  scaleValue: number = 1;
  option: ScaleOption;
  baseRect: number[];
  isDrag: boolean = false;
  centerXY: number[] = [0, 0];
  translateXY: number[] = [0, 0];
  translateOffset: number[] = [0, 0];
  constructor(option: ScaleOption) {
    this.init(option);
  }
  // 初始化
  init(option: ScaleOption) {
    const { el, dragable } = (this.option = option);
    el.addEventListener('wheel', this.onWheel);
    el.addEventListener('click', e => {
      console.log(e.offsetX, e.offsetY);
    });
    const { width, height } = el.getBoundingClientRect();
    this.baseRect = [width, height];
    this.centerXY = [width / 2, height / 2];
    if (dragable) {
      document.body.addEventListener('mouseup', () => {
        this.isDrag = false;
      });
      el.addEventListener('mousedown', () => {
        this.isDrag = true;
      });
      el.addEventListener('mousemove', e => {
        const { movementX, movementY } = e;
        if (!this.isDrag || !this.option.dragable) {
          // 鼠标移动 保存前偏移位置
          this.translateOffset = [...this.translateXY];
          return;
        }
        const [tox, toy] = this.translateOffset;
        el.style.transform = `translate(${tox + movementX}px, ${toy + movementY}px) scale(${this.scaleValue})`;
        this.translateXY = this.translateOffset = [
          this.translateOffset[0] + movementX,
          this.translateOffset[1] + movementY
        ];
      });
    }
  }
  // 滚轮缩放
  onWheel = (e: WheelEvent) => {
    const { offsetX, offsetY, deltaY } = e;
    if (deltaY < 0) {
      // 放大
      this.scaleValue = this.scaleValue + 0.2 < 10 ? this.scaleValue + 0.2 : this.scaleValue;
    } else {
      // 缩小
      this.scaleValue = this.scaleValue - 0.1 > 0.2 ? this.scaleValue - 0.1 : this.scaleValue;
    }
    this.setStyle(this.option.el, [offsetX, offsetY], this.scaleValue);
  };
  // 设置transform更改元素缩放
  setStyle(el: HTMLElement, [x, y]: number[], scale: number) {
    el.style.transformOrigin = `${x}px ${y}px`;
    const [offsetX, offsetY] = this.translateOffset;
    const [cx, cy] = this.centerXY;
    // scale1默认位置转变后新坐标偏移
    // const [tx, ty] = [x - (cx + scale * (x - cx)), y - (cy + scale * (y - cy))];
    console.log(this.translateOffset, this.translateXY);
    // 每次偏移都是按最开始scale(1) 位置进行偏移再缩放，所以需要保存之前偏移的位置
    el.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
    // 保存当前偏移位置
    this.translateXY = [offsetX, offsetY];
  }
}
