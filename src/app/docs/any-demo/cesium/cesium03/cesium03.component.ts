import { Component, ElementRef, ViewChild } from '@angular/core';
import { SlCesiumService } from '../sl-cesium/sl-cesium.service';
import * as Cesium from 'cesium';
import { loadShipImageSource } from '../resource';
import { SHIPS } from '../cesium02/mock';
import { number } from 'echarts';
import { mod, uniform, uniforms } from 'three/examples/jsm/nodes/Nodes';
import { Subject, fromEvent, takeUntil } from 'rxjs';
import { position } from 'html2canvas/dist/types/css/property-descriptors/position';
import { image } from 'html2canvas/dist/types/css/types/image';
import { a, b } from './ship.mock';
import { CesiumCanvasGrid } from './grid/cesium-canvas.grid';

@Component({
  selector: 'cesium03',
  templateUrl: './cesium03.component.html',
  styleUrls: ['./cesium03.component.less'],
  providers: [SlCesiumService]
})
export class Cesium03Component {
  constructor(private slsCesium: SlCesiumService) {}
  latlng: number[] = [];
  @ViewChild('cesiumRef') cesiumRef!: ElementRef;
  data: { name: string; lat: string; lng: string; head: string; type: string }[] = [];
  ngOnInit() {
    this.getShips();
  }
  ngAfterViewInit() {
    this.slsCesium.initCesium(this.cesiumRef.nativeElement);
    // this.billboardShip();
    // this.imageGridLayer();
  }
  billboardShip() {
    // const shipsCollect = new Cesium.BillboardCollection({
    //   scene: this.viewer.scene
    // });
    // const ships = new Array(30000).fill(0).map(() => {
    //   const ship = this.viewer.entities.add({
    //     position: Cesium.Cartesian3.fromDegrees(Math.random() * 180, Math.random() * 90, 0),
    //     billboard: {
    //       image: `/assets/map/ship/${Math.max(1,Math.ceil(Math.random() * 8))}.png`, // 或使用 Canvas
    //       width: 16,
    //       height: 16,
    //       rotation: Math.random() * Math.PI * 2,
    //       show: new Cesium.CallbackProperty((e) => {
    //         return !this.isNearGlobeEdge(ship.position.getValue(e), 10);
    //       }, false),
    //       heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    //       verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
    //     }
    //   });
    //   return ship;
    //   });
    // this.viewer.scene.primitives.add(shipsCollect);
    const handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas)
    handler.setInputAction((e) => {
      const pick = this.viewer.scene.pick(e.position)
      console.log(pick);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }
  // 判断地球边缘轮廓线边界
  isNearGlobeEdge(position, thresholdAngle) {
    const ellipsoid = this.viewer.scene.globe.ellipsoid;
    const cameraPosition = this.viewer.camera.positionWC;
  
    // Step 1: 获取地球表面法线方向
    const surfaceNormal = new Cesium.Cartesian3();
    Cesium.Ellipsoid.WGS84.geodeticSurfaceNormal(position, surfaceNormal);
  
    // Step 2: 计算相机到物体的向量
    const cameraToPosition = Cesium.Cartesian3.subtract(
      position,
      cameraPosition,
      new Cesium.Cartesian3()
    );
    const cameraToPositionDir = Cesium.Cartesian3.normalize(
      cameraToPosition,
      new Cesium.Cartesian3()
    );
  
    // Step 3: 计算视线与地球表面的切线夹角
    const cosTheta = Cesium.Cartesian3.dot(surfaceNormal, cameraToPositionDir);
    const angle = Cesium.Math.toDegrees(Math.acos(cosTheta));
  
    // 当夹角接近90度时，物体位于地球轮廓线附近
    return Math.abs(90 - angle) <= thresholdAngle;
  }
  async imageGridLayer() {
    const grid = await Promise.resolve(new CesiumCanvasGrid({}));
    const layer = new Cesium.ImageryLayer(grid);
    this.viewer.imageryLayers.add(layer);
  }
  get viewer() {
    return this.slsCesium.viewer;
  }
  cachedImg: { [key in string]: HTMLImageElement } = {};
  getImage(url: string): Promise<HTMLImageElement> {
    return new Promise(res => {
      if (this.cachedImg[url]) return res(this.cachedImg[url]);
      const img = new Image();
      img.src = url;
      img.onload = () => {
        this.cachedImg[url] = img;
        res(img);
      };
    });
  }
  loadWind() {
    fetch('/assets/json/flow-global.json')
      .then(e => e.json())
      .then(e => {});
  }

  getShips() {
    this.data = SHIPS.map(el => {
      const [name, lng, lat, head] = el.split(',');
      return {
        name,
        lat,
        lng,
        head,
        type: Math.floor(1 + Math.random() * 8) + ''
      };
    });
  }
}
