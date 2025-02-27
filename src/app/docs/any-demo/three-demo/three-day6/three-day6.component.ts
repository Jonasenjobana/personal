import { Component } from '@angular/core';
import * as Three from 'three';
import { ThreeBase } from '../three.base';
// 参考系轨道旋转
@Component({
  selector: 'three-day6',
  templateUrl: '../three.base.html',
  styleUrls: ['../three.base.less']
})
export class ThreeDay6Component extends ThreeBase {
  constructor() {
    super();
  }
  rotateA: number = 0;
  rotateB: number = 0;
  rotateC: number = 0;
  sunMesh: Three.Mesh;
  earthMesh: Three.Mesh;
  moonMesh: Three.Mesh;
  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.tCamera.position.set(100, 100, 100);
    this.tCamera.lookAt(0, 0, 0);
    this.sun();
    this.earth();
    this.moon();
  }
  override renderCb: () => void = () => {
    this.rotateA += 0.01;
    this.rotateB += 0.02;
    this.rotateC += 0.03;
    if (this.sunMesh) {
      this.sunMesh.rotation.z = this.rotateA;
    }
    if (this.earthMesh) {
      this.earthMesh.rotation.z = this.rotateB / 2;
    }
    if (this.moonMesh) {
      this.moonMesh.rotation.z = this.rotateC / 2;
    }
  };
  sun() {
    this.sunMesh = this.createSphere(10, 0xffff00, true);
    const light = new Three.AmbientLight(0xffffff, 3);
    this.sunMesh.add(new Three.AxesHelper(100));
    // light.position.set( 50, 50, 50 );
    this.sunMesh.add(light);
    this.tScene.add(this.sunMesh);
  }
  earth() {
    this.earthMesh = this.createSphere(2, 0x88ff99);
    this.earthMesh.position.set(30, 0, 0);
    this.sunMesh.add(this.earthMesh);
  }
  moon() {
    this.moonMesh = this.createSphere(1, 0xff0000);
    this.moonMesh.position.set(10, 0, 0);
    this.earthMesh.add(this.moonMesh);
  }
  createSphere(r: number, color: number = 0xffff00, ifEmissive: boolean = false) {
    const radius = r;
    const widthSegments = 36;
    const heightSegments = 36;
    const sphereGeometry = new Three.SphereGeometry(radius, widthSegments, heightSegments);
    const sunMaterial = new Three.MeshPhongMaterial({ color, emissive: ifEmissive ? color : undefined });
    const mesh = new Three.Mesh(sphereGeometry, sunMaterial);
    return mesh;
  }
}
