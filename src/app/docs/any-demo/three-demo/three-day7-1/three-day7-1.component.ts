import { Component, ElementRef, ViewChild } from '@angular/core';
import { ThreeBase } from '../three.base';
import * as Three from 'three';
// canvas贴图 保留canvas动画
@Component({
  selector: 'three-day7-1',
  templateUrl: './three-day7-1.component.html',
  styleUrls: ['./three-day7-1.component.less']
})
export class ThreeDay71Component extends ThreeBase {
  @ViewChild('anime') animeRef: ElementRef<HTMLCanvasElement>;
  constructor() {
    super();
  }
  material: any;
  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.tCamera.position.set(0, 10, 10);
    this.tCamera.lookAt(0, 0, 0);
    this.tScene.add(new Three.AxesHelper(100));
    const light = new Three.AmbientLight(0xffffff);
    this.tScene.add(light);
    this.drawAnime();
    this.createPlane();
  }
  createPlane() {
    const geometry = new Three.PlaneGeometry(4, 3);
    const texture = new Three.CanvasTexture(this.animeRef.nativeElement);
    this.material = new Three.MeshBasicMaterial({ map: texture });
    const cube = new Three.Mesh(geometry, this.material);
    this.tScene.add(cube);
  }
  drawAnime() {
    const el = this.animeRef.nativeElement;
    const { width, height } = el.getBoundingClientRect();
    let flag = 1;
    let move = 0;
    (el.width = width), (el.height = height);
    const ctx = el.getContext('2d');
    const anime = () => {
      requestAnimationFrame(anime);
      ctx.clearRect(0, 0, width, height);
      ctx.beginPath();
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, width, height);
      ctx.beginPath();
      ctx.fillStyle = '#000';
      ctx.arc(width / 2 + move + 30, height / 2 + move + 30, 3, 0, Math.PI * 2);
      ctx.fill();
      flag = move > 100 ? -1 : move < -100 ? 1 : flag;
      move += flag;
      if (this.material) this.material.map.needsUpdate = true;
    };
    anime();
  }
}
