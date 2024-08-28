import { Component, ElementRef, ViewChild } from '@angular/core';
import { SLUCanvasMapper2 } from '../util/slu-canvas-mapper2';
import { latLngToMercator } from '../util/latlng.util';
import { t } from './mock';
import { RadarLayer } from '../radar-map/radar-layer';
import { FlashPoint } from '../radar-map/flash-point';
import * as L from 'leaflet';

@Component({
  selector: 'canvas-map',
  templateUrl: './canvas-map.component.html',
  styleUrls: ['./canvas-map.component.less']
})
export class CanvasMapComponent {
  width: string = '100%';
  height: string = '100%';
  @ViewChild('mapRef') mapRef!: ElementRef;
  ngAfterViewInit() {
    // this.createMap();
    this.leafletMap();
    // setInterval(() => {
    //   this.width = Math.random() * 100 + '%';
    //   this.height = Math.random() * 100 + '%';
    //   requestAnimationFrame(() => {
    //     this.map && this.map.invalidateSize(true);

    //   })
    // }, 1000)
  }
  map: L.Map
  leafletMap() {
    const el = this.mapRef.nativeElement;
    this.map = L.map(el, {
      crs: L.CRS.Simple,
      minZoom: -5
    }).setView([500,500], 1).on('click', (e) => {
      console.log(e)
      const {containerPoint, latlng} = e, {x, y} = containerPoint;
      const toLatlng = this.map.latLngToContainerPoint(latlng);
      const toPoint = this.map.containerPointToLatLng(containerPoint);
      console.log(toLatlng, toPoint, x, y)
    })
    // new TestPanel().addTo(this.map);
    L.imageOverlay('/assets/images/map/map2.png',[[0,0],[2315, 2315]]).addTo(this.map);
    // const circle = L.circle([50, 50], 100, {renderer: L.canvas()}).addTo(this.map).on('click', (e) => {
    //   console.log(e)
    // });
    L.polyline([[244,1357], [244, 1305]]).addTo(this.map)
  }
  createMap() {
    const map = new SLUCanvasMapper2('.map', {
      /**基准点 baseXY对应画布的偏移量 */
      baseOffset: [1920/2, 850/2],
      mapping: (lng, lat) => {
        /**经纬度转为墨卡托坐标 */
        const { x: ox, z: oy } = latLngToMercator(lat, lng);
        return [ox, oy]
      },
      dragging: false,
      scaleCenter: true,
      /**基准点初始坐标 内部转墨卡托 然后再转像素坐标 */
      baseXY: [117.54782617092134, 39.74742506855425],
      /**墨卡托坐标 转 像素坐标 每180变化量距460像素 */
      baseProportionPixel: [180, 460],
    });
    map.resetMapper();
    const layer = new RadarLayer().addTo(map);
    let arcs = [];
    t.forEach(el => {
      const {lat, lng} = el;
      new FlashPoint({id: `${Math.random().toString(16).slice(2, 8)}`, info: `${Math.random()}`,lat: Number(lat), lng: Number(lng), radius: 5, time: 2000, flashMax: 4, flashMin: 2}).addTo(layer)
    })
    const a = new FlashPoint({
      lat: 39.74742506855425,
      lng: 117.54782617092134,
      id: '1',
      info: 'w'
    }).addTo(layer);
    layer.on('click', (e) =>{
      /**墨卡托转经纬度 经纬度转墨卡托坐标 */
      console.log(L.Projection.SphericalMercator.project(L.latLng(39.74742506855425, 117.54782617092134)))
      console.log(latLngToMercator(39.74742506855425, 117.54782617092134))
      console.log(this.webMercator2LngLat(13085364.1532032, 4829306.376164524), this.webMercator2LngLat(13070721.90830294, 4823902.4847763805))
    })
    /** 测试bnsv输水图 */
    // const map = new SLUCanvasMapper2('.map');
    // const layer = new PipeBackgroundLayer({bgWidth: 1920, bgHeight: 937, bgUrl: '/assets/images/map/test-bg.png'}).addTo(map);
    // setTimeout(() => {
    //   new Arc({latlng: [277, 277], radius: 2, color: '#00ff00'}).addTo(layer);
    //   new Arc({latlng: [271, 277], radius: 2, color: '#00ff00'}).addTo(layer);
    //   new Arc({latlng: [271, 977], radius: 2, color: '#00ff00'}).addTo(layer);
    //   new Arc({latlng: [277, 977], radius: 2, color: '#00ff00'}).addTo(layer);
    // }, 1000);
  }
  webMercator2LngLat(x: number, y: number) {
    //[12727039.383734727, 3579066.6894065146]  
    var lng = x / 20037508.34 * 180;  
    var lat = y / 20037508.34 * 180;      
    lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);  
    return [lng, lat]; //[114.32894001591471, 30.58574800385281]  
  }
}
