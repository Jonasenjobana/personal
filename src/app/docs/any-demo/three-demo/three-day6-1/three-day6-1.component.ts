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

  override ngAfterViewInit() {
    super.ngAfterViewInit();
    this.tCamera.position.set(0, 10, 10);
    this.tCamera.lookAt(0, 0, 0);
    this.tScene.add(new Three.AxesHelper(100));
    this.createLight();
    this.createGround();
    this.createObject();
  }
  createLight() {
    const control = new dat.GUI();
    const light = new Three.HemisphereLight(0xb1e1ff, 0xb97a20, 1);
    this.tScene.add(light);
    control.add(light, 'intensity').min(0).max(1).step(0.01);
    control.add(light.position, 'x').min(-10).max(10).step(0.01);
    control.add(light.position, 'y').min(-10).max(10).step(0.01);
    control.add(light.position, 'z').min(-10).max(10).step(0.01);
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
  }
  createObject() {
    const ball = new Three.SphereGeometry(1, 16, 16);
    const mesh = new Three.MeshPhongMaterial({ color: '#1b81a8' });
    const ballMesh = new Three.Mesh(ball, mesh);
    ballMesh.position.set(2, 4, 3);
    this.tScene.add(ballMesh);
  }
}
