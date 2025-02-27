/**全局注册模型 */
import * as Three from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { GLTFResources } from './resource-list';
export const loader = new Three.LoadingManager();
export function RegisterResource() {
  const gltfLodaer = new GLTFLoader();
  GLTFResources.forEach(model => {
    model.initResource(gltfLodaer);
  })
}
