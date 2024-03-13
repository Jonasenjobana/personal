import { Component, ElementRef, ViewChild } from '@angular/core';
import { Canvas, Rect, Group, Line, FederatedWheelEvent, Text } from '@antv/g';
import { Renderer } from '@antv/g-canvas';
import { GanteData, GanteStageData } from './gante';
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
  @ViewChild('gante', { static: true }) set ganteRef(value: ElementRef<HTMLDivElement>) {
    this.ganteEl = value.nativeElement;
  }
  ganteEl: HTMLDivElement;
  get getGanteRect() {
    return this.ganteEl.getBoundingClientRect();
  }
  private state: 'click' | 'wheel' | 'drag' | 'default' = 'default';
  private stage!: GanteStageData;
  private stageDatas: GanteData[] = [
    {
      stageRange: ['1-1', '1-3'],
      offsetStage: 20,
      colIndex: 1,
      color: '#00ff00',
      stageName: '启动项目'
    },
    {
      stageRange: ['1-2', '1-4'],
      offsetStage: 0,
      colIndex: 2,
      color: '#ff0000',
      stageName: '需求调研'
    }
  ];
  ngAfterViewInit() {
    const { width, height } = this.getGanteRect;
    this.canvas = new Canvas({
      container: this.ganteEl, // 画布 DOM 容器 id
      width,
      height,
      renderer: new Renderer() // 指定渲染器
    });
    this.stageGroup = new Group({
      name: 'gante graph'
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
    this.stage = new GanteStageData();
  }
  // stage
  createStage() {
    const { width, height } = this.getGanteRect;
    this.stage = Object.assign(this.stage, { width, height });
    const { stageLength, scale, scrollDistance } = this.stage;
    this.createBackground(stageLength, scale, width, scrollDistance);
  }
  createBackground(stageLength: number, scale: number, width: number, scrollDistance: number) {
    let actualLength = stageLength * scale,
      actualWidth = width * scale,
      totalLine = Math.round(actualWidth / actualLength);
    for (let i = 0; i < totalLine; i++) {
      let line = new Line({
        style: {
          x1: i * actualLength - scrollDistance,
          y1: 0,
          x2: i * actualLength + 1 - scrollDistance,
          y2: 200,
          lineWidth: 1,
          stroke: '#333',
          lineDash: [5, 5]
        }
      });
      let rect = new Rect({
        style: {
          x: i * actualLength - scrollDistance + 1,
          y: 0,
          width: actualLength - scrollDistance,
          height: 40,
          fill: '#ffd5d3'
        }
      });
      let text = new Text({
        style: {
          x: actualLength / 2,
          y: 20,
          text: i,
          fontSize: 24,
          fill: '#1890FF',
          stroke: '#F04864',
          textBaseline: 'middle',
        }
      });
      rect.appendChild(text);
      this.stageGroup.appendChild(line);
      this.stageGroup.appendChild(rect);
    }
  }
  onMouseWheeel($event: FederatedWheelEvent) {
    const { shiftKey, deltaY } = $event;
    const dir = deltaY > 0 ? 1 : -1;
    let { scrollDistance, scale } = this.stage;
    if (shiftKey) {
      // 水平滚动
      scrollDistance += dir * 50;
      this.stage.scrollDistance = scrollDistance;
      if (scrollDistance <= 0) {
        this.stage.scrollDistance = 0;
      }
    } else {
      // 缩放
      scale += dir * 0.25;
      if (scale <= 4 && scale >= 0.1) {
        this.stage.scale = scale;
      }
    }
    this.renderGante();
  }
  renderGante() {
    this.stageGroup.removeChildren();
    this.createStage();
  }
}
