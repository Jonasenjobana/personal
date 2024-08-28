import * as L from "leaflet";
import { SLULeafletCanvas } from "./slu-leaflet-canvas";
import { SLULeafletPane } from "./slu-leaflet-pane";
import Konva from "konva";

export class TestLayer extends SLULeafletCanvas {
    constructor() {
        super();
    }
    
}
export class TestPanel extends SLULeafletPane {
    knovaStage: Konva.Stage;
    layer: Konva.Layer
    constructor() {
        super();
    }
    override afterAdd(): void {
        this.knovaStage = new Konva.Stage({
            container: this.divContainer,
            width: this.width,
            height: this.height
        });
        this.layer = new Konva.Layer();
        this.knovaStage.add(this.layer);
    }
    override afterRemove(): void {
        
    }
    override renderAnimation() {
        const circle = new Konva.Circle({x: 50, y: 50, radius: 30, fill: 'yellow'})
        circle.on('click', (e) => {
            circle.setAttr('radius', 100);
            circle.setAttrs({x: 200, y: 200})
            console.log(e)
        })
        this.layer.add(circle);
    }
}