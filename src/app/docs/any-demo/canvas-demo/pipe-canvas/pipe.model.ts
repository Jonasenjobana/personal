import { DisplayObject, Group, Line, Rect } from "@antv/g";

export class WaterPipe {
    sx: number;
    sy: number;
    ex: number;
    ey: number;
    pipeWidth: number = 100;
    pipeHeight: number = 20;
    pipeLine: PipeLine[] = []; // 水管动画粒子
    lineGap: number; // 粒子间隙
    displayGroup: DisplayObject;
    group: Group;
    pipe: Line;
    color: '#000';
    angle: number;
    constructor(sxy: [number, number], exy: [number, number], displayGroup: DisplayObject) {
        const [sx, sy] = sxy, [ex, ey] = exy;
        this.sx = sx, this.sy = sy, this.ex = ex, this.ey = ey;
        this.displayGroup = displayGroup;
        this.group = new Group({
            name: 'pipe-group'
        });
        this.pipe = new Line({
            style: {
                x1: this.sx, y1: this.sy, x2: this.ex, y2: this.ey, lineWidth: this.pipeWidth, stroke: this.color,
            }
        })
    }
    update() {
        for(let i = 0; i < this.pipeLine.length; i++) {
            this.pipeLine[i].run();
        }
        this.pipeLine = this.pipeLine.filter(line => !line.isDeath);
        this.pipeLine.push(new PipeLine(this.sx, this.sy, this.ex, this.ey, this.pipe));
    }
    run() {
        requestAnimationFrame((timeStamp: number) => {

        })
    }
    stop() {
        this.pipeLine = [];

    }
    destroy() {
      this.stop();  
    }
    getPipeAngle() {
        
    }
}
export class PipeLine {
    sx: number; // 当前位置
    sy: number;
    ex: number; // 结束位置
    ey: number;
    speed: number = 15;
    lineWidth: number = 5;
    lineLength: number = 10;
    color: string = '#1890FF';
    vx: number; // x轴速度
    vy: number; // y轴速度
    isDeath: boolean = false;
    line: Line;
    displayGroup: DisplayObject
    angle: number // 弧度
    constructor(sx, sy, ex, ey, display: DisplayObject) {
        this.line = new Line({
            style: {
                x1: 0, y1: 0, x2: this.ex, y2: this.ey, lineWidth: this.lineWidth,
                stroke: this.color,
            }
        })
        this.displayGroup = display;
        this.displayGroup.appendChild(this.line);
        this.setSpeed();
    }
    run() {
        this.sx += this.vx;
        this.sy += this.vy;
        if (this.isDeath) {
            this.destroy();
        }
    }
    destroy() {
        this.displayGroup.removeChild(this.line);
    }
    setSpeed() {
        this.vx = this.speed * Math.cos(this.angle);
        this.vy = this.speed * Math.sin(this.angle);
    }
}