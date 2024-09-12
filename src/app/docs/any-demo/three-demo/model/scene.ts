import {
  CameraHelper,
  DirectionalLight,
  DirectionalLightHelper,
  DoubleSide,
  HemisphereLight,
  Light,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  MeshPhysicalMaterial,
  Object3D,
  PlaneGeometry,
  Scene,
  SphereGeometry,
  SpotLight,
  SpotLightHelper
} from 'three';

/**召唤师峡谷地图 */
export class CanyonScene {
  sun: DirectionalLight;
  constructor() {}
  setLight(scene: Scene) {
    const hesLight = new HemisphereLight(0xffffff, 0x444444, 2);
    scene.add(hesLight);

    const dirLight = new DirectionalLight();
    dirLight.position.set(5, 5, 5);
    dirLight.intensity = 2
    scene.add(dirLight);
    //聚光灯
    const sportLight = new SpotLight(0xffffff, 122);
    sportLight.angle = Math.PI / 8; //散射角度，跟水平线的夹角
    sportLight.penumbra = 0.1; // 聚光锥的半影衰减百分比
    sportLight.decay = 2; // 纵向：沿着光照距离的衰减量。
    sportLight.distance = 30;
    sportLight.shadow.radius = 10;
    // 阴影映射宽度，阴影映射高度
    sportLight.shadow.mapSize.set(4096, 4096);

    sportLight.position.set(-5, 5, 1);
    // 光照射的方向
    sportLight.target.position.set(0, 0, 0);
    sportLight.castShadow = true; //开启阴影
    const helper = new SpotLightHelper(sportLight);
    scene.add(sportLight);
    scene.add(helper);
  }
  setScene(scene: Scene) {
    const planeGeometry = new PlaneGeometry(10, 10);
    const planeMesh = new MeshPhongMaterial({
      color: 0x808080,
      side: DoubleSide,
    });
    const plane = new Mesh(planeGeometry, planeMesh);
    plane.rotateX(-Math.PI / 2);
    plane.receiveShadow = true;
    scene.add(plane);
    this.setLight(scene);
    this.debuggerLight(scene)
  }
  debuggerLight(scene: Scene) {
    const sphere = new SphereGeometry(1, 36);
    const planeMesh = new MeshPhongMaterial({
      color: 0x808080,
      side: DoubleSide,
    });
    const plane = new Mesh(sphere, planeMesh);
    plane.castShadow = true;
    plane.position.set(3,0,0)
    scene.add(plane)
  }
}
