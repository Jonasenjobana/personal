import { Component } from '@angular/core';
import { ThreeBase } from '../three.base';
import * as Three from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';
import gsap from 'gsap';
@Component({
  selector: 'three2',
  templateUrl: '../three.base.html',
  styleUrls: ['../three.base.less']
})
export class Three2Component extends ThreeBase {
  raycaster = new Three.Raycaster();
  control: any;
  pointer: Three.Vector2 = new Three.Vector2();
  fpc: FirstPersonControls;
  hover: Three.Object3D;
  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.tCamera.position.set(1, 1, 10);
    this.tScene.add(new Three.DirectionalLight(0xffffff, 2));
    const ambiLight = new Three.AmbientLight(0xffffff, 0.5);
    this.tScene.add(ambiLight);
    this.initScene();
    this.control = new dat.GUI();
    this.el.addEventListener('mousemove', e => {
      const { clientX, clientY } = e;
      // 归一化
      this.pointer.x = (clientX / window.innerWidth) * 2 - 1;
      this.pointer.y = -(clientY / window.innerHeight) * 2 + 1;
    });
    this.el.addEventListener('click', e => {
      this.raycaster.setFromCamera(this.pointer, this.tCamera);
      const intersects = this.raycaster.intersectObjects(this.pipeMeshes);
      if (this.hover !== intersects[0].object) {
        (intersects[0].object as any).material = (intersects[0].object as any).material.clone();
        (intersects[0].object as any).material.color.set(0xffff00);
        (this.hover as any)?.material.color.set(0xffffff);
        this.hover = intersects[0].object;
        gsap.to(this.hover.rotation, {
          x: this.tClock.getElapsedTime(),
          duration: 10
        })
      }
      console.log(intersects, 'intersects');
    });
    this.fpc = new FirstPersonControls(this.tCamera, this.el);
    this.fpc.lookSpeed = 0.4; //鼠标移动查看的速度
    this.fpc.movementSpeed = 20; //相机移动速度
    console.log(this.fpc, 'fpc');
    // this.fpc.noFly = true;
    this.fpc.lookVertical = true;
    this.fpc.lookSpeed = 0.125;
    this.fpc.movementSpeed = 100;
    this.fpc.constrainVertical = true; //约束垂直
    this.fpc.verticalMin = 1.0;
    this.fpc.verticalMax = 2.0;
    // this.fpc.lon = -150; //进入初始视角x轴的角度
    // this.fpc.lat = 120; //初始视角进入后y轴的角度
    // this.control.add(this.tCamera.position, 'x').min(-100).max(100).step(0.01);
    // this.control.add(this.tCamera.position, 'y').min(-100).max(100).step(0.01);
    // this.control.add(this.tCamera.position, 'z').min(-100).max(100).step(0.01);
    // this.pathPipe();
  }
  groupMeshes: Three.Group = new Three.Group();
  pipeMeshes: Three.Mesh[] = [];
  pipe: Three.Mesh;
  initScene() {
    const loader = new GLTFLoader();
    const draco = new DRACOLoader();
    draco.setDecoderPath('/assets/js/draco/');
    loader.setDRACOLoader(draco);
    loader.loadAsync('/assets/gltf/bnsw/house.glb').then(gltf => {
      const model = SkeletonUtils.clone(gltf.scene);
      this.tScene.add(model);
      model.traverse(child => {
        if (child instanceof Three.Mesh) {
          if (child.name.includes('管道')) {
            // this.groupMeshes.add(child);
            this.pipeMeshes.push(child);
          }
        }
      });
      console.log(this.pipeMeshes);
      // this.tCamera.lookAt(new Three.Vector3(-31.2, 5.9, 78.3));
      // this.tControl.target.copy(this.tScene.localToWorld(mesh.position));
    });
    let i = 0;
  }
  override renderCb: (delta: number) => void = delta => {
    if (this.pipe && this.pipe.material && (this.pipe.material as any).map) (this.pipe?.material as Three.MeshBasicMaterial).map.offset.y -= delta;
    this.fpc?.update(delta);
  };
  /**选取管道高亮 */
  pickPipeLine() {}
  pathPipe() {
    const path = new Three.CatmullRomCurve3([new Three.Vector3(60, 60, 0), new Three.Vector3(-60, 60, 10), new Three.Vector3(-60, -60, 0), new Three.Vector3(60, -60, 10)]);
    const geo = new Three.TubeGeometry(path, 100, 2, 25, false);
    const tload = new Three.TextureLoader();
    const texture = tload.load('assets/images/direction-arrow.png');
    texture.rotation = Math.PI / 2;
    texture.repeat.set(3, 50);
    texture.wrapS = texture.wrapT = Three.RepeatWrapping;
    const material = new Three.MeshBasicMaterial({
      map: texture,
      transparent: false
    });
    const mesh = new Three.Mesh(geo, material);
    this.pipe = mesh;
    this.tCamera.lookAt(mesh.position);
    // this.tControl.target = mesh.position;
    this.tScene.add(mesh);
  }
}
