import { IFrame } from "konva/lib/types";
import { CanvasMapperElement, CanvasMapperGroup } from "../util/slu-canvas-mapper2";

export class KnovaCanvasElement extends CanvasMapperElement {
    /** 鼠标点击样式 */
    cursorPointer: boolean = true;
    cx: number;
    cy: number;
    constructor() {
        super();
    }
    override render(iframe?: IFrame) {
    }
}
export class KnovaCanvasGroup extends CanvasMapperGroup {
    override elements: KnovaCanvasElement[] = [];
    constructor() {
        super();
    }
    override render() {
        
    }
}