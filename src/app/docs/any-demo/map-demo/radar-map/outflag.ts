import { KnovaCanvasElement, KnovaCanvasGroup } from "./base";

export class OutFlagRadar extends KnovaCanvasGroup {
    constructor() {
        super();
    }
    /**获取边界外部元素 */
    get outOfContainerEl() {
        return this.elements.filter(el => {
            return this.isOutofContainer(el)
        })
    }
    /**
     * 容器外部判断
    */
    isOutofContainer(el: KnovaCanvasElement) {
        const that = this, {mapper} = that, {width, height} = mapper;
        
        const {cx, cy} = el;
        return 0 > cx || cx > width || 0 > cy || cy > height;
    }
    override render() {

    }
}