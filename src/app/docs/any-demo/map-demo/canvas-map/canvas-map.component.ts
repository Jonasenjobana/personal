import { Component } from '@angular/core';
import { SLUCanvasMapper2, CanvasMapperLayer } from '../util/slu-canvas-mapper2';
import { latLngToMercator } from '../util/latlng.util';
import { t } from './mock';
import { RadarLayer } from '../radar-map/radar-layer';
import { FlashPoint } from '../radar-map/flash-point';
@Component({
  selector: 'canvas-map',
  templateUrl: './canvas-map.component.html',
  styleUrls: ['./canvas-map.component.less']
})
export class CanvasMapComponent {
  width: string = '100%';
  height: string = '100%';
  ngAfterViewInit() {
    this.createMap();
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
      console.log(e)
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
}
