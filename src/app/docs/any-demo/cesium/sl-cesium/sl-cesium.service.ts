import { Inject, Injectable, InjectionToken, Injector, Optional } from '@angular/core';
import * as Cesium from 'cesium';
import { CESIUM_ACCESS_TOKEN } from 'src/app/config/inject';
import { environment } from 'src/environments/environment';
import CesiumUtil from './cesium.util';
import { Subject } from 'rxjs';
import { CESIUM_TOKEN } from '../config/token';
import { AMapImageryProvider, BaiduImageryProvider, GeoVisImageryProvider } from '@cesium-china/cesium-map';
import { t } from '../../map-demo/canvas-map/mock';
@Injectable()
export class SlCesiumService {
  viewer: Cesium.Viewer;
  camera: Cesium.Camera;
  scene: Cesium.Scene;
  eventHandler: Cesium.ScreenSpaceEventHandler;
  /**订阅事件 */
  mouseEvent$: Subject<CMouseEvent> = new Subject();
  zoom$: Subject<any> = new Subject();
  /**容器长宽 */
  containerSize: { width: number; height: number } = { width: 0, height: 0 };
  constructor(@Optional() @Inject(CESIUM_ACCESS_TOKEN) accessToken: string) {
    Cesium.Ion.defaultAccessToken = accessToken;
  }
  initCesium(el: HTMLElement) {
    const { width, height } = el.getBoundingClientRect();
    this.containerSize = { width, height };
    this.viewer = new Cesium.Viewer(el, {
      terrainProvider: new Cesium.EllipsoidTerrainProvider({}), //移除自带地形
      shadows: true,
      shouldAnimate: true,
      animation: false,
      timeline: true,
      fullscreenButton: false,
      navigationHelpButton: false,
      baseLayerPicker: true,
      geocoder: false,
      homeButton: false,
    });
    this.viewer.timeline.container['style'].display = 'none';
    this.camera = this.viewer.camera;
    this.scene = this.viewer.scene;
    this.eventHandler = new Cesium.ScreenSpaceEventHandler(this.scene.canvas);
    this.initBaseEvent();
    this.initTileLayer();
    this.debugger();
  }

  initTileLayer() {
    // const a = this.viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
    //   url: `http://t0.tianditu.gov.cn/vec_w/wmts?tk=${CESIUM_TOKEN['TIAN_BASE_TOKEN']}`,
    //   layer: "tdtVecBasicLayer",
    //   style: "default",
    //   format: "image/jpeg",
    //   tileMatrixSetID: "GoogleMapsCompatible",
    //   subdomains: ['0','1','2','3','4','5','6','7'],
    // }));
    const b = new Cesium.ImageryLayer(
      new AMapImageryProvider({
        style: 'img',
        crs: 'WGS84',
        url: `http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}`,
        minimumLevel: 3,
        maximumLevel: 18
      })
    );
    this.viewer.imageryLayers.add(b);
  }
  initBaseEvent() {
    const earthEllipsoid = this.scene.globe.ellipsoid;
    const { width, height } = this.containerSize;
    let prev
    const baseMoveEvent = (type: CEventType, event: Cesium.ScreenSpaceEventHandler.MotionEvent | Cesium.ScreenSpaceEventHandler.PositionedEvent | number) => {
      let sc2: Cesium.Cartesian2;
      let ec2: Cesium.Cartesian2;
      if (type == 'move') {
        ec2 = (event as Cesium.ScreenSpaceEventHandler.MotionEvent).endPosition;
        sc2 = (event as Cesium.ScreenSpaceEventHandler.MotionEvent).startPosition;
      } else if (type == 'wheel') {
        ec2 = new Cesium.Cartesian2(width / 2, height / 2);
      } else {
        ec2 = (event as Cesium.ScreenSpaceEventHandler.PositionedEvent).position;
      }
      const ray = this.camera.getPickRay(ec2);
      const caresian = this.scene.globe.pick(ray, this.scene);
      if (!caresian) return;
      const { latitude, longitude, height: height2} = earthEllipsoid.cartesianToCartographic(caresian);
      const result: CMouseEvent = {
        type,
        height: this.camera.positionCartographic.height,
        target: {
          object: this.scene.pick(ec2),
          lat: Cesium.Math.toDegrees(latitude),
          lng: Cesium.Math.toDegrees(longitude),
          worldPosition: caresian,
          movePrev: {
            worldPosition: (() => {
              if (sc2) {
                return this.scene.globe.pick(this.camera.getPickRay(sc2), this.scene);
              }
              return null
            })()
          }
        },
        bound: this.getViewerBound(),
        zoomLevel: CesiumUtil.getCameraMapLevel(this.viewer)
      };
      this.mouseEvent$.next(result);
      if (type == 'click') {
        // console.log(result);
        // console.log('damn', Cesium.SceneTransforms.worldToWindowCoordinates(this.scene, Cesium.Cartesian3.fromDegrees(cartographic.longitude, cartographic.latitude)));
        // console.log(CesiumUtil.getCameraMapLevel(this.viewer));
      }
    };
    this.eventHandler.setInputAction((e: number) => {
      baseMoveEvent('wheel', e);
    }, Cesium.ScreenSpaceEventType.WHEEL);
    this.eventHandler.setInputAction(e => {
      baseMoveEvent('click', e);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    this.eventHandler.setInputAction(e => {
      baseMoveEvent('move', e);
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    this.eventHandler.setInputAction(e => {
      baseMoveEvent('left_down', e);
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
    this.eventHandler.setInputAction(e => {
      baseMoveEvent('left_up', e);
    }, Cesium.ScreenSpaceEventType.LEFT_UP);
  }
  private cameraControlEnable: boolean = true;
  get cameraControl() {
    return this.cameraControlEnable;
  }
  set cameraControl(enable: boolean) {
    const screenSpaceCameraController = this.scene.screenSpaceCameraController;
    screenSpaceCameraController.enableRotate = screenSpaceCameraController.enableTranslate = screenSpaceCameraController.enableZoom = screenSpaceCameraController.enableTilt = enable;
    this.cameraControlEnable = enable;
  }
  debugger() {
    if (!environment.production) {
      /**添加坐标轴辅助 */
      // Cesium.viewerCesiumInspectorMixin(this.viewer);
    }
  }
  getViewerBound() {
    return CesiumUtil.getViewBound(this.viewer);
  }
}
export type CEventType = 'move' | 'wheel' | 'click' | 'left_down' | 'left_up';
export interface CMouseEvent {
  type: CEventType;
  bound: {
    maxX: number;
    minX: number;
    maxY: number;
    minY: number;
  };
  target: {
    object?: any;
    lat?: number;
    lng?: number;
    worldPosition?: Cesium.Cartesian3;
    movePrev?: CMouseEvent['target'];
  };
  height: number;
  zoomLevel?: number;
}
