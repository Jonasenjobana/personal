import { Component, ElementRef, ViewChild } from '@angular/core';
import { ThreeBase } from '../three.base';
import * as Three from 'three';
// canvas贴图 保留canvas动画
/**
 * Three Shape路径绘制形状 2d转变3d
 * 
 * ExtrudeGeometry(shape, { depth: 0.2, bevelEnabled: false, steps: 1 }); 2d挤压3d形状
 */
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
    // this.drawAnime();
    this.getShenzhenGeoJson();
  }
  createPlane() {
    const geometry = new Three.PlaneGeometry(4, 3);
    const texture = new Three.CanvasTexture(this.animeRef.nativeElement);
    this.material = new Three.MeshBasicMaterial({ map: texture });
    const cube = new Three.Mesh(geometry, this.material);
    cube.rotateX(-Math.PI / 2);
    this.tScene.add(cube);
    console.log(this.material, 'wtf');
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
    };
    anime();
  }
  shenzhenGeo: { geometry: { coordinates: number[][][][] }; properties: { center: number[] } } = null;

  getShenzhenGeoJson() {
    fetch('https://geo.datav.aliyun.com/areas_v3/bound/440300.json').then(res => {
      res.text().then(text => {
        const obj = JSON.parse(text);
        this.shenzhenGeo = obj.features[0];
        this.drawShenzhen();
        // this.createPlane();
        console.log(this.shenzhenGeo);
      });
    });
  }
  drawShenzhen() {
    const { geometry, properties } = this.shenzhenGeo,
      { center } = properties,
      { coordinates } = geometry;
    const canvasEl = this.animeRef.nativeElement;
    const { width, height } = canvasEl.getBoundingClientRect();
    (canvasEl.width = width), (canvasEl.height = height);
    const ctx = canvasEl.getContext('2d');
    // 获取边界
    const bound = this.getBound(coordinates[0][0]);
    const difflng = bound[1][0] - bound[0][0];
    const difflat = bound[1][1] - bound[0][1];
    //缩放
    const scale = Math.min(width / difflng, height / difflat) - 200;
    this.drawLine(coordinates[0][0], ctx, scale, bound[0]);
    this.drawShape(coordinates[0][0], 1, bound[0]);
  }
  /**
   * 绘制 GeoJson 中的 LineString
   * @param coordinates LineString 的坐标数组
   * @param ctx canvas 的 2d 上下文
   * @param scale 缩放比例
   * @param boundmin 经纬度的最小值
   */
  drawLine(coordinates: number[][], ctx: CanvasRenderingContext2D, scale: number, boundmin: number[]) {
    ctx.beginPath();
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = 'red';
    ctx.moveTo((coordinates[0][0] - boundmin[0]) * scale, (coordinates[1][1] - boundmin[1]) * scale);
    coordinates.slice(1).forEach(point => {
      ctx.lineTo((point[0] - boundmin[0]) * scale, (point[1] - boundmin[1]) * scale);
    });
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
    if (this.material) this.material.map.needsUpdate = true;
  }
  /**
   * 获取 GeoJson 中的边界
   * @param coordinates GeoJson 中的 LineString 的坐标数组
   * @returns 一个包含两个数组的数组，第一个是左上角经纬度，第二个是右下角经纬度
   */
  getBound(coordinates: number[][]): [number[], number[]] {
    let lt = coordinates[0],
      rb = coordinates[0];
    for (let i = 0; i < coordinates.length; i++) {
      const [lng, lat] = coordinates[i];
      lt = [Math.min(lt[0], lng), Math.min(lt[1], lat)];
      rb = [Math.max(rb[0], lng), Math.max(rb[1], lat)];
    }
    return [lt, rb];
  }
  drawShape(coordinates: number[][], scale: number, boundmin: number[]) {
    const shape = new Three.Shape();
    shape.moveTo((coordinates[0][0] - boundmin[0]) * scale, (coordinates[1][1] - boundmin[1]) * scale);
    coordinates.slice(1).forEach(point => {
      shape.lineTo((point[0] - boundmin[0]) * scale, (point[1] - boundmin[1]) * scale);
    });
    const geometry = new Three.ExtrudeGeometry(shape, { depth: 0.2, bevelEnabled: false, steps: 1 });
    const mesh = new Three.Mesh(geometry, [new Three.MeshPhongMaterial({ color: 0x00ff00 }), new Three.MeshPhongMaterial({ color: '#ff9921' })]);
    mesh.rotateZ(Math.PI);
    mesh.rotateX(0.5 * Math.PI);
    this.tScene.add(mesh);
  }
}
