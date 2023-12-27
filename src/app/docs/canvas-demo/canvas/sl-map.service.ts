import { CanvasBaseService } from './canvas-base.service';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import * as L from 'leaflet';
const TILEMAPURL = 'http://t2.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=71138a8f227b7cff59fc2fddc3da6f42';
@Injectable({
  providedIn: 'root'
})
export class SlMapService {
  private map!: L.Map;
  initMapSub$: Subject<L.Map> = new Subject()
  constructor(private canvasBase_: CanvasBaseService) {}
  initMap() {
    this.map = L.map('map', {
      minZoom: 5,
      maxZoom: 18
    }).setView([33.79, 120.95], 1);
    // 添加基础地图图层
    const baseLayer = L.tileLayer(TILEMAPURL);
    baseLayer.addTo(this.map);
    this.canvasBase_.initImage();
    this.initMapSub$.next(this.map)
  }
  getBound() {
    this.map.getBounds()
  }
} 
