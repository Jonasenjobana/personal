import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Canvas, Rect, Group, Line, FederatedWheelEvent, Text } from '@antv/g';
import { Renderer } from '@antv/g-canvas';
import { GanteData, GanteOption } from './gante';
import { AntVGDraggable } from '../util/drag.canvas';
@Component({
  selector: 'gante-canvas',
  templateUrl: './gante-canvas.component.html',
  styleUrls: ['./gante-canvas.component.less']
})
export class GanteCanvasComponent {
  constructor() {
    this.initStage();
  }
  private canvas!: Canvas;
  private stageGroup!: Group;
  private barGroup: Group;
  @ViewChild('gante', { static: true }) set ganteRef(value: ElementRef<HTMLDivElement>) {
    this.ganteEl = value.nativeElement;
  }
  @Input() ganteOption: GanteOption = new GanteOption(); 
  ganteEl: HTMLDivElement;
  get getGanteRect() {
    return this.ganteEl.getBoundingClientRect();
  }
  ngAfterViewInit() {
    const { width, height } = this.getGanteRect;
    this.canvas = new Canvas({
      container: this.ganteEl, // 画布 DOM 容器 id
      width,
      height,
      renderer: new Renderer() // 指定渲染器
    });
    this.stageGroup = new Group({
      name: 'gante graph',
      style: {
        y: 40
      }
    });
    this.canvas.addEventListener('wheel', ($event: FederatedWheelEvent) => {
      this.onMouseWheeel($event);
    });
    this.canvas.appendChild(this.stageGroup);
    requestAnimationFrame(() => {
      this.createStage();
    });
  }
  initStage() {
  }
  // stage
  createStage() {
    this.stageGroup.removeChildren();
    this.createBackground();
    this.ganteBtn();
  }
  createBackground() {
    const { barWidth, scale, scrollOffsetX, colData, barHeight, lineRowTotal, rowHeight } = this.ganteOption;
    let actualLength = barWidth * scale;
    let headGroup = new Group({
      style: {
        cursor: 'grab'
      }
    });
    for (let i = 0; i < colData.length; i++) {
      let line = new Line({
        style: {
          x1: i * actualLength - scrollOffsetX,
          y1: 0,
          x2: i * actualLength + 1 - scrollOffsetX,
          y2: lineRowTotal * rowHeight,
          lineWidth: 1,
          stroke: '#333',
          lineDash: [5, 5]
        }
      });
      let rect = new Rect({
        style: {
          x: i * actualLength - scrollOffsetX + 1,
          y: 0,
          width: actualLength - scrollOffsetX,
          height: barHeight,
          fill: '#309eff'
        }
      });
      let text = new Text({
        style: {
          x: actualLength / 2,
          y: barHeight / 2,
          text: colData[i],
          fontSize: 14,
          fill: '#fff',
          textBaseline: 'middle',
          textAlign: 'center'
        }
      });
      rect.appendChild(text);
      rect.addEventListener('mousemove', $event => {
        rect.style.fill = '#e06568';
      });
      AntVGDraggable({canvas: this.canvas ,el: rect, parent: headGroup})
      headGroup.appendChild(line);
      headGroup.appendChild(rect);
      this.stageGroup.appendChild(headGroup);
    }
  }
  ganteBtn() {
    let btnRect = new Rect({
      style: {
        x: 0,
        y: 0,
        width: 80,
        height: 36,
        radius: 5,
        fill: "#61afee"
      }
    })
    let text = new Text({
      style: {
        x: 40,
        y: 18,
        text: '重置',
        fontSize: 12,
        fill: '#000',
        textBaseline: 'middle',
        textAlign: 'center'
      }
    })
    btnRect.appendChild(text);
    btnRect.addEventListener('click', () => {
      this.createStage();
    })
    this.canvas.appendChild(btnRect);
  }
  onMouseWheeel($event: FederatedWheelEvent) {
    const { shiftKey, deltaY } = $event;
    const dir = deltaY > 0 ? -1 : 1;
    let { scrollOffsetX, scale } = this.ganteOption;
    if (shiftKey) {
      let diffScroll = 50;
      // 水平滚动
      scrollOffsetX += diffScroll * dir * -1;
      if (scrollOffsetX < 0) {
        this.ganteOption.scrollOffsetX = scrollOffsetX;
        this.stageGroup.translate(diffScroll * dir * -1);
      } else {
        this.ganteOption.scrollOffsetX = 0;
      }
    } else {
      // 缩放
      scale += dir * 0.2;
      if (scale <= 4 && scale >= 1) {
        this.ganteOption.scale = scale;
      }
    }
    this.renderGante();
  }
  renderGante() {
    this.stageGroup.removeChildren();
    this.createStage();
  }
}
