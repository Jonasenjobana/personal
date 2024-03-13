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
    this.stage = new GanteStageData();
  }
  // stage
  createStage() {
    const { width, height } = this.getGanteRect;
    this.stage = Object.assign(this.stage, { width, height });
    const { stageLength, scale, scrollDistance } = this.stage;
    this.stageGroup.removeChildren();
    this.createBackground(stageLength, scale, width, scrollDistance);
    this.ganteBtn();
  }
  createBackground(stageLength: number, scale: number, width: number, scrollDistance: number) {
    let actualLength = stageLength * scale,
      actualWidth = width * scale,
      totalLine = Math.round(actualWidth / actualLength);
    let headGroup = new Group();
    for (let i = 0; i < 100; i++) {
      let line = new Line({
        style: {
          x1: i * actualLength - scrollDistance,
          y1: 0,
          x2: i * actualLength + 1 - scrollDistance,
          y2: 500,
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
          textBaseline: 'middle'
        }
      });
      rect.appendChild(text);
      rect.addEventListener('mousemove', $event => {
        rect.style.fill = '#e06568';
      });
      headGroup.appendChild(line);
      headGroup.appendChild(rect);
      this.stageGroup.appendChild(headGroup);
    }
  }
  ganteBtn() {
    let btnRect = new Rect({
      style: {
        x: 0,
        y: -40,
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
      this.stage.scale = 1;
      this.stage.scrollDistance = 0;
      this.createStage();
    })
    this.stageGroup.appendChild(btnRect);
  }
  onMouseWheeel($event: FederatedWheelEvent) {
    const { shiftKey, deltaY } = $event;
    const dir = deltaY > 0 ? -1 : 1;
    let { scrollDistance, scale } = this.stage;
    if (shiftKey) {
      let diffScroll = 50 * scale;
      // 水平滚动
      scrollDistance += diffScroll * dir * -1;
      if (scrollDistance < 0) {
        this.stage.scrollDistance = scrollDistance;
        this.stageGroup.translate(diffScroll * dir * -1);
      } else {
        this.stage.scrollDistance = 0;
      }
    } else {
      // 缩放
      let tempScale = 1 + dir * 0.1;
      scale *= tempScale;
      if (scale <= 2 && scale >= 0.5) {
        this.stage.scale = scale;
        this.stageGroup.scale(tempScale);
      }
    }
    // this.renderGante();
    console.log(this.stage)
  }
  renderGante() {
    this.stageGroup.removeChildren();
    this.createStage();
  }
}
