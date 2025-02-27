import { AnimationAction, AnimationMixer, Camera, Object3D, PerspectiveCamera } from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { MissFortuneGLTF } from '../resource-util/resource-list';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
/**
 * 厄运小姐类
 */
export class MissFortuneModel {
  private _scene: Object3D;
  private animeMixer: AnimationMixer;
  private clipAction: AnimationAction;
  scene: Object3D;
  model: Object3D;
  run: 'Run1' | 'Run2'; // 跑步动作 走 跑
  attack: 'Attack1' | 'Attack2'; // 攻击动作
  animeState: any; // 动画状态
  gltfOrgin: GLTF;
  headCamera: PerspectiveCamera;
  constructor() {
    this.headCamera = new PerspectiveCamera();
  }
  initResource: Promise<GLTF>;
  onLoad(cb?: (res: MissFortuneModel) => void): Promise<MissFortuneModel> {
    return new Promise(async resolve => {
      MissFortuneGLTF.sourcePromise.then(res => {
        const { scene, animations } = (this.gltfOrgin = res);
        this.scene = SkeletonUtils.clone(scene);
        this.scene.traverse(child => {
          child.castShadow = true;
        });
        this.model = this.scene.children[0];
        this.animeMixer = new AnimationMixer(this.model);
        console.log(this.gltfOrgin);
        this.clipAction = this.animeMixer.clipAction(animations[0]).setDuration(3).play();
        resolve(this);
        if (cb && typeof cb == 'function') {
          cb(this);
        }
      });
    });
  }
  updateAnime(delta: number) {
    if (this.animeMixer) {
      this.animeMixer.update(delta);
    }
  }
  changeView(camera: Camera) {
    this.model.add(camera);
    camera.position.set(0, 0, 0);
  }
  // play() {
  //   this.clipAction.play();
  // }
  // pause() {
  //   this.clipAction.stop();
  // }
}
