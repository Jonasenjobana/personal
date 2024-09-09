import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { ThreeBase } from '../three.base';
import { OffscreenCanvasCreator } from '@antv/g';
import * as moment from 'moment';
import * as rbush from 'rbush';
import { Vector2 } from 'three';
/**
 * 粒子练习
 */
@Component({
  selector: 'three-day8-1',
  templateUrl: './three-day8-1.component.html',
  styleUrls: ['./three-day8-1.component.less']
})
export class ThreeDay81Component extends ThreeBase {
  constructor(private renderer2: Renderer2) {
    super();
  }
  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.init2DCanvas();
  }
  @ViewChild('2dCanvas', { static: true }) canvasRef: ElementRef<HTMLCanvasElement>;
  ctx: CanvasRenderingContext2D;
  rbush: rbush = new rbush();
  /**缓存粒子位置 */
  cachedParticle: Particle[] = [];
  /**
   * 2d canvas init
   * set canvas size and get context
   */
  init2DCanvas() {
    const el = this.canvasRef.nativeElement;
    const { width, height } = el.getBoundingClientRect();
    el.width = width;
    el.height = height;
    this.ctx = el.getContext('2d');
    // gsap.
    const anime = () => {
      requestAnimationFrame(anime);
      this.drawPartialText();
    };
    // 绘制粒子
    anime();
    // this.drawPartialText();
  }
  drawPartialText() {
    const el = this.canvasRef.nativeElement;
    const { width, height } = el.getBoundingClientRect();
    const text = moment().format('HH:mm:ss');
    /**粒子像素大小 */
    const partialRadius = 2;
    /**中间间隙 */
    const space = 6;
    const off = new OffscreenCanvas(width, height);
    const ctx = off.getContext('2d');
    ctx['font'] = '100px Microsoft YaHei';
    ctx['fillStyle'] = '#000';
    const textW = ctx['measureText'](text).width;
    ctx['fillText'](text, width / 2 - textW / 2, height / 2);
    this.ctx.clearRect(0, 0, width, height);
    /**获取像素坐标 */
    const imgData = ctx['getImageData'](0, 0, width, height);
    const particles = [];
    // 横向扫描
    for (let i = 0; i < height; i += space) {
      for (let j = 0; j < width; j += space) {
        // i * width + j 是每个像素的索引
        const a = imgData.data[(i * width + j) * 4 + 3];
        if (a != 0) {
          particles.push(new Particle({ x: j, y: i, radius: partialRadius, color: this.randomColor() }).update(this.ctx, this.rbush));
        }
      }
    }
    this.updateParticles(particles, this.ctx);
  }
  randomColor() {
    const random = Math.random();
    return `rgb(${55},${Math.floor(random * 122)},${Math.floor(random * 255)})`;
  }
  updateParticles(particles: Particle[], ctx: CanvasRenderingContext2D) {
    particles.forEach(p1 => {
      if (this.cachedParticle.findIndex(p2 => p1.x == p2.x && p1.y == p2.y) == -1) {
        this.cachedParticle.push(p1);
      }
    });
    this.cachedParticle.forEach(particle => {
      if (particles.findIndex(p => p.x == particle.x && p.y == particle.y) == -1) {
        particle.status = 'drop';
        particle.update(ctx, this.rbush);
      }
    })
    this.setRbush();
    // this.cachedParticle = this.cachedParticle.filter(p => p.status != 'disappear');
  }

  setRbush() {
    const loadArr = this.cachedParticle.map(cached => {
      const {x, y, radius} = cached;
      return {
        minX: x-radius,
        minY: y-radius,
        maxX: x+radius,
        maxY: y+radius,
        data: cached
      }
    })
    this.rbush.clear();
    this.rbush.load(loadArr);
  }
}
class Particle {
  radius: number;
  x: number;
  y: number;
  /**初始位置 */
  orginY: number;
  orginX: number;
  color: string;
  status: 'drop' | 'disappear' | 'default' = 'default';
  /**x轴速度 */
  speedX: number;
  accX: number
  readonly gravity: number = 3; /**重力加速度 */
  bounce: number = 0.5; /**弹性指数*/
  speedY: number = 0;
  height: number;
  constructor(options: any = {}) {
    const { x = 0, y = 0, color = '#fff', radius = 5 } = options;
    this.radius = radius;
    this.x = this.orginX = x;
    this.y = this.orginY = y;
    this.height = this.y;
    this.color = color;
    this.accX = Math.random();
    this.bounce = this.bounce + Math.random() * 0.5;
    this.speedX = 1 * Math.random() > 0.3 ? 1 : Math.random() < 0.6 ? -1 : 0 * Math.random();
    this.speedY = Math.random();
  }
  /**
   * 接触到边界
   * 边界为画布
   * 球体之间的碰撞 处理角度 矢量角
   *  */
  touchedBound(rbush: any) {
    const right = this.x + this.radius;
    const bottom = this.y + this.radius;
    if (right >= window.innerWidth - 10 || right <= 10) {
      this.speedX *= this.bounce * this.speedX * -1;
    }
    if (bottom >= window.innerHeight || bottom <= 0) {
      this.y = window.innerHeight - this.radius;
      // this.speedY *= this.bounce * -1;
    }
    const result = rbush.search({
      minX: this.x - this.radius,
      minY: this.y - this.radius,
      maxX: this.x + this.radius,
      maxY: this.y + this.radius
    });
    if (result.length > 0) {
      // 最靠近的球体
      this.speedY *= -1;
      this.accX *= this.bounce * -1
    }
  }
  update(ctx, rbush) {
    if (this.status == 'drop') {
      this.speedY += this.gravity;
      this.speedX += this.accX;
      this.y += this.speedY;
      this.x += this.speedX;
      this.height = this.y;
      this.touchedBound(rbush);
      if (Math.abs(this.speedY) < 0.02) {
        this.status = 'disappear';
      }
    }
    this.draw(ctx);
    return this;
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}
