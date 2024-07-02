import Konva from "konva";
import { CanvasMapperElement, CanvasMapperLayer, SLUCanvasMapper2 } from "../util/slu-canvas-mapper2";
import { KonvaEventListener } from "konva/lib/Node";
import { IFrame } from "konva/lib/types";
import { KnovaCanvasElement } from "./base";

export class RadarLayer extends CanvasMapperLayer {
    stage: Konva.Stage
    layer: Konva.Layer;
    staticEls: CanvasMapperElement[] = [];
    animeLayer: Konva.Layer;
    anime: Konva.Animation;
    animeEls: KnovaCanvasElement[] = [];
    constructor() {
        super();
    }
    override onAdd() {
        const that = this, {mapper} = that, {canvasContainer, width, height} = mapper;
        this.stage = new Konva.Stage({
            container: canvasContainer,
            width, 
            height
        });
        this.stage.on('mousemove', (ev) => {
            const {target} = ev;
            if (target.getAttr('data')?.cursor) {
                this.stage.container().style.cursor = 'pointer';
            } else {
                this.stage.container().style.cursor = 'default';
            }
        })
        this.layer = new Konva.Layer();
        this.animeLayer = new Konva.Layer();
        this.anime = new Konva.Animation((frame: IFrame) => {
            this.animeCallback(frame);
        }, this.animeLayer);
        this.stage.add(this.layer, this.animeLayer);
        this.anime.start();
    }
    public override on(eventName: string, cb: KonvaEventListener<any, any>): void {
        if (!this.stage) return;
        this.stage.on(eventName, cb);
    }
    override off(evName?: string, cb?: KonvaEventListener<any, any>) {
        if (!this.stage) return;
        this.stage.off(evName, cb);
    }
    animeCallback(frame: IFrame) {
        this.animeEls.forEach(el => el.render(frame));
    }
    override onReset(): void {
        if (!this.stage) return;
        this.stage.width(this.width);
        this.stage.height(this.height);
    }
    protected override onRemove(): void {
        const that = this, {mapper, stage, anime} = that;
        if (!mapper) return;
        if (stage) {
            stage.destroy();
        }
        if (anime) {
            anime.stop();
        }
    }
    protected override onDestroy(): void {
        const that = this, {anime, stage, layer, animeLayer} = that;
        anime && anime.stop();
        stage && stage.destroy();
    }
}