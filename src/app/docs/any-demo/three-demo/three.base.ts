import { Directive, ElementRef, ViewChild } from '@angular/core';
import * as Three from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui';
@Directive()
export class ThreeBase {
  readonly canvasId: string = 'three-base';
  tCamera: Three.Camera;
  tRender: Three.WebGLRenderer;
  tScene: Three.Scene;
  animeFlag: number;
  tClock: Three.Clock;
  tControl: OrbitControls;
  uTime: {value: number} = {value: 0};
  gui: dat.gui;
  @ViewChild('threeBase') threeBase: ElementRef<HTMLCanvasElement>;
  @ViewChild('2dCanvas') tdCanvas: ElementRef<HTMLCanvasElement>;
  get el() {
    return this.threeBase.nativeElement;
  }
  constructor() {
    this.gui = new dat.GUI();
    this.tClock = new Three.Clock();
  }
  ngAfterViewInit() {
    this.initThree();
  }
  initThree() {
    const el = document.getElementById(this.canvasId);
    this.tRender = new Three.WebGLRenderer({
      canvas: el
    });
    /**设置画布大小 */
    this.tRender.setSize(window.innerWidth, window.innerHeight);
    /**透视相机 */
    this.tCamera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    this.tScene = new Three.Scene();
    this.tScene.add(this.tCamera);
    this.tScene.add(new Three.AxesHelper());
    /**控制器 */
    this.tControl = new OrbitControls(this.tCamera, el);
    this.renderThree();
  }
  renderThree = () => {
    const delta = this.tClock.getDelta();
    this.tRender.render(this.tScene, this.tCamera);
    this.uTime.value += delta;
    this.renderCb(delta);
    this.animeFlag = requestAnimationFrame(this.renderThree);
  };
  renderCb = (delta: number) => {};
  ngOnDestroy() {
    this.animeFlag && cancelAnimationFrame(this.animeFlag);
  }
}
