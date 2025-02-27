// 默认水平 左至右为正方向
class PipeLine {
    constructor(start: [number, number], end: [number, number]) {
        this.sx = start[0]
        this.sy = start[1]
        this.ex = end[0]
        this.ey = end[1]
        this.rotate = Math.atan2(this.ey - this.sy, this.ex - this.sx) * 180 / Math.PI;
        this.width = Math.sqrt(Math.pow(this.ex - this.sx, 2) + Math.pow(this.ey - this.sy, 2));
    }
    height: number = 10
    width: number
    sx: number
    sy: number
    ex: number
    ey: number
    /**根据起始结束位置自动计算旋转角度 和 方向 */
    rotate: number
}
// 水管
class PipeLineMain {
    // 只要控制pipeLines的更新 即可 完成不同的水管演示效果
    pipeLines: WaterParticeGroup[] = [];
    requestId: number = 0;
    constructor() {
        
    }
    generatePipeLine() {
        this.pipeLines = PipeLines.map(pipeLine => {
            return new WaterParticeGroup(pipeLine);
        })
    }
    update() {
        
    }
    draw(ctx: CanvasRenderingContext2D) {
        ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);
        ctx.beginPath();
        this.pipeLines.forEach(pipeLine => {
            pipeLine.draw(ctx);
        })
        ctx.closePath();
        this.requestId = requestAnimationFrame(() => {
            this.draw(ctx);
        })
    }
    clear(ctx: CanvasRenderingContext2D) {
        ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);
        cancelAnimationFrame(this.requestId);
    }
}
// 水管内粒子群
class WaterParticeGroup {
    particesMain: WaterParticeMain[] = [];
    pipeOption: PipeLine
    constructor(pipe: PipeLine) {
        this.pipeOption = pipe
    }
    generatePartices() {
        
    }
    updatePartices() {
        
    }
    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        // 旋转管道
        ctx.rotate(this.pipeOption.rotate * Math.PI / 180)
        this.particesMain.forEach(partice => {
            partice.draw(ctx);
        })
        ctx.restore();
    }
    // 粒子边界判断
    bound() {
        const {width,height,sx, sy,ex,ey} = this.pipeOption;
        this.particesMain.forEach(main => {
            main.partices.forEach(particle => {
                if(particle.x < sx || particle.x > ex || particle.y < sy || particle.y > ey) {
                    particle.lifeTime = 0;
                }
            })
            main.update()
        })
    }
}
// 粒子主体
class WaterParticeMain {
    partices: WaterPartice[] = [];
    maxPartice: number = 20;
    generatePartice() {
        this.partices = new Array(this.maxPartice/2).fill(0).map(() => {
            return new WaterPartice(1000*20);
        })
    }
    update() {
        /**过滤消亡粒子和出边界的粒子 */
        this.partices = this.partices.filter(partice => partice.lifeTime > 0);
    }
    draw(ctx: CanvasRenderingContext2D) {
        this.partices.forEach(partice => {
            partice.draw(ctx);
        });
    }
}
// 粒子
class WaterPartice {
    x: number
    y: number
    /**粒子大小 */
    size: number = 2
    /**粒子速度 */
    speed: number = 1
    /**粒子颜色 */
    color: string = '#e2e3f8'
    /**生成生命周期 毫秒 */
    lifeTime: number = 100
    update() {
        this.lifeTime - 16;
    }
    draw(ctx: CanvasRenderingContext2D) {
        ctx.moveTo(this.x, this.y);
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    }
    constructor(lifeTime) {
        
    }
}
// 模拟水管道
const PipeLines: PipeLine[] = [
    new PipeLine([10,10],[90, 10]),
    new PipeLine([90,10],[90, 90]),
    new PipeLine([90,90],[10, 90]),
    new PipeLine([10,90],[10, 10]),
]