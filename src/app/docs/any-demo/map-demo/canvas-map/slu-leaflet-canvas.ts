import * as L from "leaflet";
/**leaflet生成canvas图层的基础类 */
export abstract class SLULeafletCanvas extends L.Layer {
    constructor(options?: any) {
        super(options);
        Object.assign(this.options, options);
    }
    public get map(): L.Map { return this._map };
    public override readonly options: any = {
        pane: 'canvas',
    };
    /**生成的canvas画布，onAdd调用时生成 */
    protected canvas!: HTMLCanvasElement;
    /**画布的内容信息 */
    protected ctx!: CanvasRenderingContext2D;
    protected width: number = 0;
    protected height: number = 0;
    /**动画循环的id标识 */
    protected flagAnimation: number = 0;
    /**上次绘制完成标识 0标识完成*/
    protected flagDrawEnd: number = 0;
    /**已经添加到地图的标识 */
    private ifAddMap: boolean = false;
    protected onRemoveLayer(e: any) { }
    /**生成canvas画布设置canvas位置大小并添加到地图,addTo时会自动调用*/
    public override onAdd(map: L.Map) {
        if (this.ifAddMap) return this;
        this.ifAddMap = true;
        this._map = map;
        this._initCanvasAddPane();
        this._eventSwitch(true);
        this._resetCanvas();
        return this
    }
    /**主动调用、map.removeLayer方法等移除时会调用 
     * 移除canvas页面节点、移除事件监听、取消动画循环
    */
    public override onRemove() {
        if (!this.ifAddMap) return this;
        this.ifAddMap = false;
        let pane = this.options.pane || 'overlayPane'
        this.getPane(pane)?.removeChild(this.canvas);
        this._eventSwitch(false);
        if (this.flagAnimation) cancelAnimationFrame(this.flagAnimation);
        return this
    }
    /**重置画布*/
    public resetCanvas() {
        this.clearContext()
    }
    /** 地图移动缩放都会自行调用渲染重绘*/
    protected render() {
        if (!this.map) return;
        console.log('##########--------canvase-render--------##########');
        this.clearContext();
        this.renderFixedData();
        this.renderAnimation();
        // if (!this.flagDrawEnd && this._map && !this._map['_animating']) {
        //     /**减少极短的时间内得调用次数 */
        //     this.flagDrawEnd = L.Util.requestAnimFrame(this._drawAll, this);
        // }
    };
    /**绘制静态数据推荐使用此方法(固定的图) */
    protected renderFixedData() { };
    /** 推荐使用此方法绘制动态图(跟随鼠标拖动，移动时需要立刻绘制时)
     ** 动画图层绘制前的画布清空、计算等均在此方法中自行计算 
     ** 与renderFixedData本质是一样的
     */
    protected renderAnimation() { };
    /**清空画布内容 */
    protected clearContext(): void {
        if (!this._map || !this.ctx) return;
        this._resetCanvas();
        // this.ctx.clearRect(0, 0, this.width, this.height); // 清空画布
    }
    /**添加或关闭地图特定的监听事件(_eventSwitch事件后自动调用) */
    protected addMapEvents(map: L.Map, key: 'on' | 'off') { }
    /**初始化画布并添加到Pane中 */
    private _initCanvasAddPane() {
        let canvas = this.canvas = this.canvas || L.DomUtil.create('canvas', `sl-layer ${this.options.className || 'sl-canvas-map'}`);
        let pane = this.options.pane || 'overlayPane', map = this.map, paneEle = this.getPane(pane) || map.createPane(pane);
        /**如果指定的pane不存在就自己创建(往map添加div Pane) */
        paneEle.appendChild(this.canvas);
        paneEle.style['pointerEvents'] = 'none';
        var originProp = "" + L.DomUtil.testProp(['transformOrigin', 'WebkitTransformOrigin', 'msTransformOrigin']);
        let style: any = canvas.style;
        style[originProp] = '50% 50%';
        style['z-index'] = this.options.zIndex || 100;
        let { x, y } = map.getSize();
        canvas.width = x;
        canvas.height = y;
        this.ctx = canvas.getContext('2d')!;
        let animated = map.options.zoomAnimation && L.Browser.any3d;
        L.DomUtil.addClass(canvas, 'leaflet-zoom-' + (animated ? 'animated' : 'hide'));
        L.extend(canvas, {
            onselectstart: L.Util.falseFn,
            onmousemove: L.Util.falseFn,
            onload: L.bind(this._onCanvasLoad, this),
        });
    }
    /**基础的监听事件   
     * @param flag true开启重绘事件监听 false 关闭重绘事件监听
     **/
    private _eventSwitch(flag: boolean = true) {
        let map = this._map;
        let key: 'on' | 'off' = flag ? 'on' : 'off';
        map[key]('viewreset', this._reset, this);
        map[key]('resize', this._reset, this);
        map[key]('moveend', this._reset, this);
        if (map.options.zoomAnimation && L.Browser.any3d) {
            /**缩放动画 */
            map[key]('zoomanim', this._animateZoom, this);
        };
        this.addMapEvents(map, key);
    }
    /**重设画布,并重新渲染*/
    private _reset() {
        this._resetCanvas();
        this.render();
    }
    /**重设画布 */
    private _resetCanvas() {
        var topLeft = this._map.containerPointToLayerPoint([0, 0]);
        L.DomUtil.setPosition(this.canvas, topLeft);
        var size = this._map.getSize();
        this.canvas.width = this.width = size.x;
        this.canvas.height = this.height = size.y;
    }
    /**缩放动画 */
    private _animateZoom(e: any) {
        let map: any = this._map;
        var scale = map.getZoomScale(e.zoom),
            offset = map._getCenterOffset(e.center)._multiplyBy(-scale).subtract(map._getMapPanePos());
        L.DomUtil.setTransform(this.canvas, offset, scale);
    }
    private _onCanvasLoad() {
        this.fire('load');
    }
}
