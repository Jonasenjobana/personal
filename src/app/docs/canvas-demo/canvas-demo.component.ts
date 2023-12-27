import { SlMapService } from './canvas/sl-map.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as L from 'leaflet';
import { LeafletCanvasLayer } from './canvas/leaflet-canvas';
import { CanvasBaseService } from './canvas/canvas-base.service';

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
    this.map_.initMap();
    this.canvase_.getShipInfo().then((data: Buoy[]) => {
      this.buoyList = data;
    });
    this.map_.initMapSub$.subscribe(map => {
      this.map = map;
    });
  }
  track() {}
  detail() {}
}
interface Buoy {
  latitude: number;
  longitude: number;
  aidsName: string;
  atonId: string;
}
