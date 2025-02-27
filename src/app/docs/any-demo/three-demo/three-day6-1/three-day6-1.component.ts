import { Component } from '@angular/core';
import { ThreeBase } from '../three.base';
import { Mesh, MeshBasicMaterial, PlaneGeometry, TextureLoader } from 'three';
import * as dat from 'dat.gui';
import * as Three from 'three';
/**场景布置 光线 */
@Component({
  selector: 'three-day6',
  templateUrl: '../three.base.html',
  styleUrls: ['../three.base.less']
})
export class ThreeDay61Component extends ThreeBase {
  constructor() {
    super();
  }
  control:any
  override ngAfterViewInit() {
    super.ngAfterViewInit();
    this.tCamera.position.set(0, 10, 10);
    this.tCamera.lookAt(0, 0, 0);
    this.tScene.add(new Three.AxesHelper(100));
    // 开启阴影渲染
    this.tRender.shadowMap.enabled = true;
    this.control = new dat.GUI();
    this.createLight();
    this.createGround();
    this.createObject();
  }
  createLight() {
    const light = new Three.DirectionalLight(0xffffff);
    light.castShadow = true;
    light.shadow.radius = 10;
    light.shadow.mapSize.set(1024, 1024);
    this.tScene.add(light);
    this.control.add(light, 'intensity').min(0).max(5).step(0.01);
    this.control.add(light.position, 'x').min(-10).max(10).step(0.01);
    this.control.add(light.position, 'y').min(-10).max(10).step(0.01);
    this.control.add(light.position, 'z').min(-10).max(10).step(0.01);
    
    // const spotLightHelper = new Three.SpotLightHelper( light );
    // this.tScene.add( spotLightHelper );
  }
  /**地板 */
  createGround() {
    const ground = new PlaneGeometry(100, 100);
    const texture = new TextureLoader().load('assets/images/three/ground.png');
    texture.wrapS = Three.RepeatWrapping;
    texture.wrapT = Three.RepeatWrapping;
    texture.magFilter = Three.NearestFilter;
    texture.colorSpace = Three.SRGBColorSpace;
    const repeats = 20 / 2;
    texture.repeat.set(repeats, repeats);
    const material = new Three.MeshPhongMaterial({
      map: texture
    });
    const mesh = new Mesh(ground, material);
    mesh.rotateX(-Math.PI / 2);
    this.tScene.add(mesh);
    mesh.receiveShadow = true;
  }
  createObject() {
    const ball = new Three.SphereGeometry(1, 16, 16);
    const mesh = new Three.MeshPhongMaterial({ color: '#1b81a8' });
    const ballMesh = new Three.Mesh(ball, mesh);
    ballMesh.position.set(2, 4, 3);
    this.tScene.add(ballMesh);
    ballMesh.castShadow = true;
    this.control.add(ballMesh.position, 'y').min(-10).max(10).step(0.01);// 添加gui control y轴方向值调整以便于debug调试 后续的操作

  }
}
