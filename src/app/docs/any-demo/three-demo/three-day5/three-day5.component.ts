import { Component } from '@angular/core';
import { ThreeBase } from '../three.base';
import * as Three from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { gsap, Back } from 'gsap';
import { fromEvent } from 'rxjs';
import { vec2 } from 'three/examples/jsm/nodes/Nodes';
/**模型加载 pick取色 */
@Component({
  selector: 'three-day5',
  templateUrl: '../three.base.html',
  styleUrls: ['../three.base.less']
})
export class ThreeDay5Component extends ThreeBase {
  /**缓存拾取颜色 */
  private cachedColor: Three.Color;
  constructor() {
    super();
  }
  override ngAfterViewInit() {
    super.ngAfterViewInit();
    this.tCamera.position.set(1000, 1000, 1000);
    this.tCamera.lookAt(0, 0, 0);
    /**环境光 全局光亮 */
    const light = new Three.AmbientLight();
    light.intensity = 1;
    this.tScene.add(light);
    this.createModel();
    this.initEvent();
  }
  async createModel() {
    const gltf = await this.loadGltf();
    this.tScene.add(gltf);
  }
  // 载入gltf模型
  loadGltf(): Promise<Three.Group> {
    /**修正模型坐标系与世界坐标系一致 */
    const fixes = [
      { prefix: 'Car_08', rot: [Math.PI * 0.5, 0, Math.PI * 0.5] },
      { prefix: 'CAR_03', rot: [0, Math.PI, 0] },
      { prefix: 'Car_04', rot: [0, Math.PI, 0] }
    ];
    const cars: any[] = [];
    return new Promise(res => {
      const gltfLoader = new GLTFLoader();
      const url = '/assets/gltf/cartoon_lowpoly_small_city_free_pack/scene.gltf';
      gltfLoader.load(url, gltf => {
        const root = gltf.scene;
        // 获取所有cars节点
        const loadedCars = root.getObjectByName('Cars');
        // 车辆沿自身坐标系y轴旋转
        loadedCars.children.slice().forEach(car => {
          const fix = fixes.find(fix => car.name.startsWith(fix.prefix));
          const obj = new Three.Object3D();
          // 将汽车世界坐标复制到Obj
          car.getWorldPosition(obj.position);
          car.position.set(0, 0, 0);
          car.rotation.set(...(fix.rot as [number, number, number]));
          obj.add(new Three.AxesHelper(1000))
          obj.add(car);
          this.tScene.add(obj);
          cars.push(obj);
        });
        // cars.forEach(car => {
        //   gsap.to(car.rotation, {
        //     duration: 3,
        //     y: '+=10',
        //     repeat: -1,
        //   });
        // });
        res(root);
      });
    });
  }
  dumpObject(obj, lines = [], isLast = true, prefix = '') {
    const localPrefix = isLast ? '└─' : '├─';
    lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
    const newPrefix = prefix + (isLast ? '  ' : '│ ');
    const lastNdx = obj.children.length - 1;
    obj.children.forEach((child, ndx) => {
      const isLast = ndx === lastNdx;
      this.dumpObject(child, lines, isLast, newPrefix);
    });
    return lines;
  }

  initEvent() {
    this.pick();
  }
  // 3d拾取
  pick() {
    const el = this.threeBase.nativeElement;
    const { width, height } = el.getBoundingClientRect();
    const caster = new Three.Raycaster();
    fromEvent(el, 'click').subscribe((event: MouseEvent) => {
      const { offsetX: px, offsetY: py } = event;
      /**归一化处理 */
      const x = (px / width) * 2 - 1;
      const y = -(py / height) * 2 + 1;
      caster.setFromCamera(new Three.Vector2(x, y), this.tCamera);
      const target = caster.intersectObjects(this.tScene.children);
      if (target.length > 0) {
        console.log(target);
      }
    });
  }
  /**
   * list
   * 1: 射线法取3d Object物体拾取 ✔
   * 2: 天空盒背景载入
   * 3: 材质uv坐标
   * 4: 按需渲染
   * 5: gsap动画
   * 6: 第一人称人物移动
   * 7: 着色器特效: 扫描\渐变\动画
   * 8: animationclip结合 模型动画
   */
  /**
   * list
   * cesium
   * 1: 官方api 基础功能 取点;
   */
}
