// 根据起始点连线 中间往两边延展的管道
export class Pipe {
  sx: number;
  sy: number;
  ex: number;
  ey: number;
  option = {
    // 管道高度
    height: 10,
    particelSize: 6,
    particelSpeed: 0.2
  };
  // 管道的旋转角度 相对于x轴正方向 顺时针
  pipeRotate: number;
  // 水粒子
  waterParticle: WaterParticle[] = [];
  pipeLen: number;
  // 粒子AABB模型 矩形 左上至右下
  particelAABBBound: [[number, number], [number, number]] = [
    [0, 0],
    [6, 4]
  ];
  // 管道AABB模型 矩形 左上至右下
  pipeAABBBound!: [[number, number], [number, number]];
  maxWaterParticelCount!: number;
  constructor(s: [number, number], e: [number, number]) {
    this.sx = s[0];
    this.sy = s[1];
    this.ex = e[0];
    this.ey = e[1];
    // this.ctx = ctx;
    this.init();
    console.log((this.pipeRotate * 180) / Math.PI);
  }
  init() {
    this.pipeRotate = Math.atan2(this.ey - this.sy, this.ex - this.sx);
    const len = (this.pipeLen = Math.sqrt(Math.pow(this.ey - this.sy, 2) + Math.pow(this.ex - this.sx, 2)));
    const { particelSize, particelSpeed, height } = this.option;
    // 最大粒子数
    const maxCount = (this.maxWaterParticelCount = Math.round(len / particelSize));
    this.waterParticle = new Array(maxCount).fill(0).map((el, idx) => {
      return new WaterParticle(idx * particelSize, particelSize / 2, particelSpeed, 0);
    });
    this.pipeAABBBound = [
      [0, 0],
      [len, height]
    ];
  }
  render(ctx: CanvasRenderingContext2D) {
    const { particelSize, particelSpeed, height } = this.option;
    ctx.save();
    // 根据当前管道方向 为正方形
    ctx.translate(this.sx, this.sy);
    ctx.rotate(this.pipeRotate);
    ctx.beginPath();
    ctx.strokeStyle = '#fff';

    ctx.strokeRect(0, 0, this.pipeLen, height);
    ctx.fillStyle = 'rgba(255, 255, 255)';
    this.waterParticle
      .filter(el => {
        const ifShow = this.inPipeBound(el);
        if (!ifShow) {
          el.width = 1;
          el.x = 0;
          el.y = particelSize / 2;
        }
        return ifShow;
      })
      .forEach(el => {
        if (el.width > particelSize) {
          el.x += el.vx;
          // 大于管道运动方向终点的边界
          if (el.x + particelSize - 1 >= this.pipeAABBBound[1][0]) {
            ctx.fillRect(el.x + 1, el.y, this.pipeAABBBound[1][0] - el.x, particelSize - 2);
          } else {
            ctx.fillRect(el.x + 1, el.y, particelSize - 2, particelSize - 2);
          }
        } else {
            el.width += el.vx;
            ctx.fillRect(el.x, el.y, el.width, particelSize - 2);
        }
      });
    ctx.closePath();
    ctx.restore();
  }
  // 在管道边界内部
  inPipeBound(particel: WaterParticle) {
    const { x, y } = particel;
    const { pipeAABBBound, particelAABBBound, option } = this;
    return pipeAABBBound[0][0] <= x && x <= pipeAABBBound[1][0];
  }
}
// 管道控制
export class PipeControl {
  ctx: CanvasRenderingContext2D;
  pipes: Pipe[] = PipesMock;
  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.render();
  }
  setPipes(pipes: Pipe[]) {
    this.pipes = pipes;
  }
  pushPipe(pipe: Pipe) {
    this.pipes.push(pipe);
  }
  clear() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }
  render() {
    this.clear();
    this.pipes.forEach(el => {
      el.render(this.ctx);
    });
    requestAnimationFrame(() => {
      this.render();
    });
  }
}
export class WaterParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number = 1;
  constructor(x: number, y: number, vx: number, vy: number) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
  }
}
export const PipesMock: Pipe[] = [
  new Pipe([100, 100], [100, 200]),
  new Pipe([100, 200], [200, 200]),
  new Pipe([200, 200], [200, 100]),
  new Pipe([200, 100], [100, 100])
];
