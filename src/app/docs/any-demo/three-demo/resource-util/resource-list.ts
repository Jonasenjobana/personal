import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
export abstract class LoaderResource<T = any, R = any> {
  sourcePromise: Promise<T|null>;
  sourceUrl: string;
  orginSource: T | null;
  initResource: (loader: R) => Promise<T|null>;
}
/**厄运小姐资源导入 */
export class MissFortuneGLTF extends LoaderResource<GLTF, GLTFLoader>{
  static sourcePromise: Promise<GLTF|null>;;
  static sourceUrl: string = '/assets/gltf/battle_queen_miss_fortune.glb';
  static orginSource: GLTF | null = null;
  static async initResource(loader: GLTFLoader = new GLTFLoader()): Promise<GLTF|null> {
    return new Promise(async (resolve, reject) => {
      MissFortuneGLTF.sourcePromise = loader.loadAsync(MissFortuneGLTF.sourceUrl).then(res => {
        MissFortuneGLTF.orginSource = res;
        resolve(res);
        return res;
      }).catch(err => {
        reject(err);
        return null;
      });
    });
  }
}
export const GLTFResources: LoaderResource<GLTF, GLTFLoader>[] = [MissFortuneGLTF];
