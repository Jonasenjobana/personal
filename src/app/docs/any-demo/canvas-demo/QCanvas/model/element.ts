import { QCanvas } from "../q-canvas";
import { uniqueId } from 'lodash';
/**层基类 */
export class QCanvasLayer {
    zIndex: number
    groups: QCanvasGroup[] = [];
    elements: QCanvasElement[] = [];
    render() {}
}
/**组基类 */
export class QCanvasGroup {
    zIndex: number;
    elements: QCanvasElement[] = [];
    render() {}
}
/**元素基类 */
export class QCanvasElement<T = any> {
    id: string
    position: [number, number];
    zIndex: number;
    data: T;
    children: QCanvasElement[] = [];
    ctxParams: any = {};
    protected qcanvas: QCanvas
    constructor(position: [number, number], zIndex: number) {
        this.id = uniqueId();
        this.position = position;
        this.zIndex = zIndex;
    }
    onAdd(qcanvas: QCanvas) {
        this.qcanvas = qcanvas;
        
    }
    onRemove() {

    }
    render() {}
}
export class QCanvasCircle<T = any> extends QCanvasElement {
    constructor(position: [number, number], radius: number, option?: QCanvasOption) {
        const {zIndex = 0} = option
        super(position, zIndex);
    }
}
export class QCanvasRect<T = any> extends QCanvasElement {
    width: number
    height: number
    
    constructor(position: [number, number], width: number, height: number, option?: QCanvasOption) {
        const {zIndex = 0} = option
        super(position, zIndex);
        this.width = width;
        this.height = height;
    }
}
export interface QCanvasOption {
    zIndex: number
    fillColor: string
    strokeColor: string
}