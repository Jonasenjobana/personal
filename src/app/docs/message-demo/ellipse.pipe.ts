import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ellipse'
})
export class EllipsePipe implements PipeTransform {
  fontSize!: number;
  ctx!: CanvasRenderingContext2D;
  transform(text: string, rangeElement: HTMLElement, fontSize: number = 16): string {
    this.fontSize = fontSize;
    const actualWidth = this.caculateText(text);
    const contentWidth = this.getBoxContentWidth(rangeElement);
    const ellipseWidth = this.caculateText('...');
    if (contentWidth > actualWidth) {
      return text;
    }
    const averageWidth = Math.floor((contentWidth - ellipseWidth) / 2);
    return `${this.getStr(text, averageWidth)}...${this.getStr(text, averageWidth, true)}`;
  }
  getStr(text: string, maxWidth: number, isReverse: boolean = false) {
    let preWidth = 0;
    let index = 0;
    for (let i = 0; i < text.length; i++) {
      let width = this.caculateText(isReverse ? text.slice(-i - 1) : text.slice(0, i + 1));
      if (width > maxWidth) {
        return isReverse ? text.slice(-i): text.slice(0, i);
      }
      preWidth = width;
      index = i;
    }
    return text;
  }
  caculateText(text: string) {
    if (!this.ctx) {
      let canvas = document.createElement('canvas');
      const ctx = (this.ctx = canvas.getContext('2d')!);
      ctx.font = `${this.fontSize}px Microsoft YaHei`;
    }
    let width = this.ctx.measureText(text).width;
    return Math.round(width);
  }
  getBoxContentWidth(rangeElement: HTMLElement) {
    const { width } = rangeElement.getBoundingClientRect();
    const { paddingLeft: pl, paddingRight: pr } = getComputedStyle(rangeElement);
    return width - parseInt(pl) || 0 - parseInt(pr) || 0;
  }
}
