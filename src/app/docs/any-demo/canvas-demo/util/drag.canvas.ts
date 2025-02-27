import { Canvas, DisplayObject, FederatedEvent, FederatedPointerEvent } from "@antv/g";
export interface AntVGDraggableOption {
    canvas: Canvas;
    el: DisplayObject;
    // 限制边界
    parent?: DisplayObject;
    cancelCb?: ($event: FederatedEvent) => void;
    moveCb?: ($event: FederatedEvent) => void;
}
export function AntVGDraggable(opt: AntVGDraggableOption) {
    const {el, parent, moveCb, cancelCb, canvas} = opt;
    function mouseUp($event: FederatedEvent) {
        cancelCb && cancelCb($event);
        canvas.removeEventListener('mousemove', mouseMove);
        canvas.removeEventListener('mouseup', mouseUp);
    }
    function mouseMove($event: FederatedPointerEvent) {
        const {clientX, clientY} = $event;
        if (parent) {
            const {left, right, top, bottom} = parent.getBBox();
            let width = right - left, height = bottom - top;
            let x = clientX - left, y = clientY - top;
            x = Math.max(x, 0), x = Math.min(x, width);
            y = Math.max(y, 0), y = Math.min(y, height);
            console.log(x,y)
        }
        moveCb && moveCb($event);
    }
    el.addEventListener('mousedown', ($event: FederatedEvent) => {
        canvas.addEventListener('mousemove', mouseMove);
        canvas.addEventListener('mouseup', mouseUp);
    })
}