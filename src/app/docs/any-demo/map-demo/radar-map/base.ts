import { IFrame } from "konva/lib/types";
import { CanvasMapperElement } from "../util/slu-canvas-mapper2";

export class KnovaCanvasElement extends CanvasMapperElement {
    /** 鼠标点击样式 */
    cursorPointer: boolean = true;
    constructor(ox: number, oy: number) {
        super(ox, oy);
    }
    override render(iframe?: IFrame) {
    }
}