import { QCanvasElement } from "./model/element";

export class QCanvas {
    private ctx: CanvasRenderingContext2D;
    private control: QCanvasControl;
    private elements: QCanvasElement[];
    private frameList: QFrameCall[] = [];
    private animeId: number
    constructor(el: HTMLCanvasElement) {
        const {width, height} = el.getBoundingClientRect();
        this.ctx = el.getContext('2d');
        this.ctx.canvas.width = width;
        this.ctx.canvas.height = height;
        this.control = new QCanvasControl();
    }
    /**开启动画 每秒60帧刷新 */
    set onFrame(value: QFrameCall) {
        this.frameList.push(value);
    }
    animeRender(event?: QEvent, preTime?: number) {
        this.clear();
        let current = new Date().getTime();
        if (!event) {
            // 初始化动画事件
            event = {
                time: 0,
                count: 0,
                delta: 0
            }
        }
        this.animeId = requestAnimationFrame(() => {
            this.frameList.forEach(frame => {
                frame(event);
            });
            this.animeRender(event);
        })
    }
    render() {
        
    }
    /**清除整个画布 */
    clear() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
    addElement() {

    }
    removeElement() {

    }
}
export class QCanvasControl {
    constructor() {

    }
}
export type QFrameCall = ((event: QEvent) => void)
export interface QEvent {
    /**开始自现在总时间 */
    time: number;
    /**当前一秒第几帧 */
    count: number;
    /**上一秒至当前帧总时间 */
    delta: number;
} 