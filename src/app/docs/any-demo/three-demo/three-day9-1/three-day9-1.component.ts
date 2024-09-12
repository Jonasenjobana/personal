import { Component } from '@angular/core';
import { ThreeBase } from '../three.base';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { AnimationAction, AnimationMixer, AxesHelper, BufferGeometry, Camera, CanvasTexture, LineBasicMaterial, LoopRepeat, Mesh, MeshBasicMaterial, MeshLambertMaterial, MeshPhongMaterial, Object3D, PCFSoftShadowMap, PerspectiveCamera, PointsMaterial, ShaderMaterial, SkeletonHelper, SkinnedMesh } from 'three';
import gsap from 'gsap';
import { RegisterResource } from '../resource-util/load-util';
import { MissFortuneGLTF } from '../resource-util/resource-list';
import { MissFortuneModel } from '../model/missfortune';
import { CanyonScene } from '../model/scene';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls';
import * as SceneUtils from 'three/examples/jsm/utils/SceneUtils';
/**
 * SkeletonUtils.clone() 骨架与mesh id绑定， Object3D自带的clone会将uuid全部随机 把关联都取消了 导致各种变化都失效
 * 阴影 光源设置castShadow 渲染器开启shadowMap 物体设置castShadow 投影物体设置receiveShadow
 * 导入女枪模型
 * 封装女枪类
 * TODO 女枪纹理替换 增加特效 片元着色器处理
 * 坐标系调整 模型与世界坐标系
 * TODO 摄像头绑定女枪头部切换人称 wasd鼠标交互
 */
@Component({
  selector: 'three-day9-1',
  templateUrl: '../three.base.html',
  styleUrls: ['../three.base.less']
})
export class ThreeDay91Component extends ThreeBase {
  constructor() {
    super();
    RegisterResource();
  }
  mixer: AnimationMixer;
  missfortune: MissFortuneModel;
  firstControl: FirstPersonControls;
  headCamera: Camera;

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.tRender.shadowMap.enabled = true;
    this.tCamera.position.set(0, 10, 10);
    this.tCamera.lookAt(0, 0, 0);
    this.tScene.add(new AxesHelper(500));
    new CanyonScene().setScene(this.tScene);
    new MissFortuneModel().onLoad(model => {
      this.missfortune = model;
      console.log(model)
      this.missfortune.model.traverse((child: Object3D) => {
        if ((child as SkinnedMesh).isMesh && child.name == 'mesh_0_1') {
          let mesh = child as SkinnedMesh;
          // child.material = new MeshLambertMaterial({
          //   color:0xffffff,
          //   wireframe: true
          // });
          const el = this.tdCanvas.nativeElement;
          const ctx = el.getContext('2d');
          const clone = (mesh.material as MeshBasicMaterial).clone();
          const bit: ImageBitmap = clone.map.source.data
          ctx.drawImage(bit, 0, 0);
          // SceneUtils.createMeshesFromMultiMaterialMesh(mesh, [clone, new MeshBasicMaterial({ map: new CanvasTexture(el) })]);
          const mesh2 = new Mesh(mesh.geometry, new ShaderMaterial({
            uniforms: {
              uTime: this.uTime
            },
            vertexShader: ``,
            fragmentShader: ``
          }))
          this.tScene.add(mesh2)
          // mesh.material = new MeshBasicMaterial({ map: new CanvasTexture(el) });
          console.log(mesh, mesh.geometry)
        }
      })
      this.missfortune.model.add(new AxesHelper(500))
      this.tScene.add(new SkeletonHelper(model.scene));
      this.tScene.add(model.scene);
    });
  }
  override renderCb: (delta: number) => void = delta => {
    if (this.missfortune) {
      this.missfortune.updateAnime(delta);
    }
  };
}
