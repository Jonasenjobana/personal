import { Component } from '@angular/core';
import { SLUCanvasMapper2, CanvasMapperLayer } from '../util/slu-canvas-mapper2';
import { latLngToMercator } from '../util/latlng.util';
import { Arc, PipeBackgroundLayer } from './draw';
import { t } from './mock';
@Component({
  selector: 'canvas-map',
  templateUrl: './canvas-map.component.html',
  styleUrls: ['./canvas-map.component.less']
})
export class CanvasMapComponent {
  width: string = '100%';
  height: string = '100%';
  ngAfterViewInit() {
    // const map = new SLUCanvasMapper2('.map', {
    //   /**基准点 baseXY对应画布的偏移量 */
    //   baseOffset: [1920/2, 850/2],
    //   mapping: (lng, lat) => {
    //     /**经纬度转为墨卡托坐标 */
    //     const { x: ox, z: oy } = latLngToMercator(lat, lng);
    //     return [ox, oy]
    //   },
    //   /**基准点初始坐标 内部转墨卡托 然后再转像素坐标 */
    //   baseXY: [117.54782617092134, 39.74742506855425],
    //   /**墨卡托坐标 转 像素坐标 每180变化量距460像素 */
    //   baseProportionPixel: [180, 460],
    // });
    // map.resetMapper();
    // const layer = new CanvasMapperLayer().addTo(map);
    // const layer2 = new CanvasMapperLayer().addTo(map);
    // const el = new Arc({latlng: [39.74742506855425, 117.54782617092134], radius: 5, color: '#00ff00'}).addTo(layer);
    // let arcs = [];
    // t.forEach(el => {
    //   const {lat, lng} = el;
    //   arcs.push(new Arc({latlng: [Number(lat), Number(lng)], radius: 5, color: '#0000ff'}).addTo(layer))
    // })
    // setTimeout(() => {
    //   map.setView(117.54810816847369, 39.74687519007546, 20);
    //   layer.off();
    // }, 3000);
    /** 测试bnsv输水图 */
    const map = new SLUCanvasMapper2('.map');
    const layer = new PipeBackgroundLayer({bgWidth: 1920, bgHeight: 937, bgUrl: '/assets/images/map/test-bg.png'}).addTo(map);
    setTimeout(() => {
      new Arc({latlng: [277, 277], radius: 2, color: '#00ff00'}).addTo(layer);
      new Arc({latlng: [271, 277], radius: 2, color: '#00ff00'}).addTo(layer);
      new Arc({latlng: [271, 977], radius: 2, color: '#00ff00'}).addTo(layer);
      new Arc({latlng: [277, 977], radius: 2, color: '#00ff00'}).addTo(layer);
    }, 1000);
  }
}
