import { Component } from '@angular/core';
import { ThreeBase } from '../three.base';
import * as Three from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
@Component({
  selector: 'three2',
  templateUrl: '../three.base.html',
  styleUrls: ['../three.base.less']
})
export class Three2Component extends ThreeBase {
  control: any;
  tCamera2: Three.Camera;
  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.tCamera2 = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    this.tScene.add(this.tCamera2);
    this.tCamera2.position.set(10, 10, 10);
    this.tCamera2.lookAt(100, 0, -100);
    this.tCamera.position.set(0, 10, 10);
    const el = document.getElementById(this.canvasId);
    this.tControl = new OrbitControls(this.tCamera2, el);
    this.tCamera.lookAt(0, 0, 0);
    this.tScene.add(new Three.AxesHelper(100));
    const light = new Three.AmbientLight(0xffffff);
    this.tScene.add(light);
    this.initScene();
    this.control = new dat.GUI();
    this.tRender.setScissorTest(true);
  }
  override renderCb: (delta: number) => void = () => {
    if (!this.tCamera2) return;
    this.tRender.setScissor(100, 100, 1000, 1000);
    this.tRender.setViewport(0, 0, 1000, 1000);
    this.tRender.render(this.tScene, this.tCamera2);
  };
  initScene() {
    const loader = new GLTFLoader();
    const draco = new DRACOLoader();
    draco.setDecoderPath('/assets/js/draco/');
    loader.setDRACOLoader(draco);
    loader.loadAsync('/assets/gltf/bnsw/house.glb').then(gltf => {
      this.tScene.add(gltf.scene);
      this.control
        .add(gltf.scene.scale, 'x', 0, 1)
        .step(0.01)
        .onChange(() => {
          // this.tControl.update();
        });
      this.control
        .add(gltf.scene.scale, 'y', 0, 1)
        .step(0.01)
        .onChange(() => {
          // this.tControl.update();
        });
      this.control
        .add(gltf.scene.scale, 'z', 0, 1)
        .step(0.01)
        .onChange(() => {
          // this.tControl.update();
        });
    });
  }
}
