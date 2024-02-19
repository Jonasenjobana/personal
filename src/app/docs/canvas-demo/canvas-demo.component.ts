import { SlMapService } from './canvas/sl-map.service';
import { Component, OnInit, ViewChild, ElementRef, signal } from '@angular/core';
import * as L from 'leaflet';
import { LeafletCanvasLayer } from './canvas/leaflet-canvas';
import { CanvasBaseService } from './canvas/canvas-base.service';
import { ACircleNode, ARenderTree, RenderTree } from './canvas/type';

@Component({
  selector: 'canvas-demo',
  templateUrl: './canvas-demo.component.html',
  styleUrls: ['./canvas-demo.component.less']
})
export class CanvasDemoComponent implements OnInit {
  constructor(private elementRef: ElementRef, private canvase_: CanvasBaseService, private map_: SlMapService) {}
  private canvasEle!: HTMLCanvasElement;
  map!: L.Map;
  buoyList: Buoy[] = [];
  ngOnInit(): void {
    // this.map_.initMap();
    // this.canvase_.getShipInfo().then((data: Buoy[]) => {
    //   this.buoyList = data;
    // });
    // this.map_.initMapSub$.subscribe(map => {
    //   this.map = map;
    // });
  }
  track() {
  }
  detail() {}
  ngAfterViewInit() {
  }
  render() {
    const canvasEle = document.querySelector('#cav') as HTMLCanvasElement;
    const ctx = canvasEle.getContext('2d')!
    canvasEle.width = 800
    canvasEle.height = 800
    // 创建离屏
    const renderCanvas = new RenderTree(canvasEle, ctx, 800, 800)
    const circle = new ACircleNode({radius: 40, position: [100, 100], onClick: ({x,y}) => {
      console.log(x,y,'click')
    }})
    const circle2 = new ACircleNode({radius:30, position: [100, 100]})
    circle.addChild(circle2);
    renderCanvas.addNode(circle);
  }
}
interface Buoy {
  latitude: number;
  longitude: number;
  aidsName: string;
  atonId: string;
}
