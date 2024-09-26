import { Inject, Injectable, InjectionToken, Injector, Optional } from '@angular/core';
import * as Cesium from 'cesium';
import { CESIUM_ACCESS_TOKEN } from 'src/app/config/inject';
import { environment } from 'src/environments/environment';
import CesiumUtil from './cesium.util';
import { Subject } from 'rxjs';

@Injectable()
export class SlCesiumService {
  viewer: Cesium.Viewer;
  camera: Cesium.Camera;
  scene: Cesium.Scene;
  eventHandler: Cesium.ScreenSpaceEventHandler;
  /**订阅事件 */
  mouseClick$: Subject<any> = new Subject();
  mouseMove$: Subject<any> = new Subject();
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
      shadows: true,
      shouldAnimate: true,
      animation: false,
      timeline: true,
      fullscreenButton: false,
      navigationHelpButton: false,
      baseLayerPicker: true,
      geocoder: false,
      homeButton: false
    });
    new Cesium.ImageryProvider()
    this.viewer.timeline.container['style'].display = 'none';
    this.camera = this.viewer.camera;
    this.scene = this.viewer.scene;
    this.eventHandler = new Cesium.ScreenSpaceEventHandler(this.scene.canvas);
    this.initBaseEvent();
    this.debugger();
  }
  initBaseEvent() {
    const earthEllipsoid = this.scene.globe.ellipsoid;
    const {width, height} = this.containerSize;
    const baseMoveEvent = (type: 'move' | 'wheel' | 'click', event: Cesium.ScreenSpaceEventHandler.MotionEvent | Cesium.ScreenSpaceEventHandler.PositionedEvent | number ) => {
      let c2: Cesium.Cartesian2;
      if (type == 'move') {
        c2 = (event as Cesium.ScreenSpaceEventHandler.MotionEvent).endPosition;
      } else if (type == 'wheel') { 
        c2 = new Cesium.Cartesian2(width/2, height/2);
      } else if (type == 'click') {
        c2 = (event as Cesium.ScreenSpaceEventHandler.PositionedEvent).position;
      }
      const ray = this.camera.getPickRay(c2);
      const caresian = this.scene.globe.pick(ray, this.scene);
      if (!caresian) return;
      const cartographic = earthEllipsoid.cartesianToCartographic(caresian);
      const result = {
        height: this.camera.positionCartographic.height,
        position: {
          lat: Cesium.Math.toDegrees(cartographic.latitude),
          lng: Cesium.Math.toDegrees(cartographic.longitude)
        },
        bound: this.getViewerBound()
      };
      type == 'move' && this.mouseMove$.next(result);
      type == 'click' && this.mouseClick$.next(result);
      type == 'wheel' && this.zoom$.next(result);
      if (type == 'click') {
        console.log(result)
      }
    };
    this.eventHandler.setInputAction((e: number) => {
      baseMoveEvent('wheel', e);
    }, Cesium.ScreenSpaceEventType.WHEEL);
    this.eventHandler.setInputAction((e) => {
      baseMoveEvent('click', e);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    this.eventHandler.setInputAction((e) => {
      baseMoveEvent('move', e);
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  }
  debugger() {
    if (!environment.production) {
      /**添加坐标轴辅助 */
      // Cesium.viewerCesiumInspectorMixin(this.viewer);
    }
  }
  getViewerBound() {
    return CesiumUtil.getViewBound(this.viewer.camera);
  }
}
