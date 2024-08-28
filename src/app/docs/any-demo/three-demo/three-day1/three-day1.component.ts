import { Component, Renderer2 } from '@angular/core';
import gsap from 'gsap';
import {
  AxesHelper,
  BoxGeometry,
  Camera,
  DirectionalLight,
  MathUtils,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  PerspectiveCamera,
  Raycaster,
  Renderer,
  Scene,
  SphereGeometry,
  TextureLoader,
  WebGLRenderer
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as dat from 'dat.gui';
@Component({
  selector: 'three-day1',
  templateUrl: './three-day1.component.html',
  styleUrls: ['./three-day1.component.less']
})
export class ThreeDay1Component {
  cube: Mesh;
  scene: Scene;
  render: Renderer;
  camera: Camera;
  fetchText: string = '';
  constructor(private renderer: Renderer2) {}
  ngOnInit() {
    this.getDemographicData();
  }
  ngAfterViewInit() {
    this.renderer.selectRootElement('.three').addEventListener('click', (e: MouseEvent) => {
      new Raycaster();
      // this.scene.raycast();
    });
    setTimeout(() => {
      this.createScene();
      this.earthCreate();
    }, 1000);
    // this.createGLTF();
  }
  // 加载模型
  loadGltf() {
    return new Promise(res => {
      const gltfLoader = new GLTFLoader();
      const url = '/assets/gltf/cartoon_lowpoly_small_city_free_pack/scene.gltf';
      gltfLoader.load(url, gltf => {
        const root = gltf.scene;
        res(root);
      });
    });
  }
  getDemographicData() {
    fetch('assets/files/gpw_v4_basic_demographic_characteristics_rev10_a000_014mt_2010_cntm_1_deg.asc').then(res => {
      res.text().then(text => {
        this.fetchText = text;
      });
    });
  }
  parseFetchData() {
    const data = [];
    const settings: any = { data };
    let max;
    let min;
    // 对每一行进行切分
    this.fetchText.split('\n').forEach(line => {
      // split the line by whitespace
      const parts = line.trim().split(/\s+/);
      if (parts.length === 2) {
        // 长度为2的必定是键值对
        settings[parts[0]] = parseFloat(parts[1]);
      } else if (parts.length > 2) {
        // 长度超过2的肯定是网格数据
        const values = parts.map(v => {
          const value = parseFloat(v);
          if (value === settings.NODATA_value) {
            return undefined;
          }
          max = Math.max(max === undefined ? value : max, value);
          min = Math.min(min === undefined ? value : min, value);
          return value;
        });
        data.push(values);
      }
    });
    return Object.assign(settings, { min, max });
  }
  createScene() {
    const canvas = this.renderer.selectRootElement('.three');
    this.scene = new Scene();
    const camera = (this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100));
    camera.position.set(0, 10, 0);
    this.scene.add(camera);
    this.render = new WebGLRenderer({ canvas });
    this.render.setSize(window.innerWidth, window.innerHeight);
    const controls = new OrbitControls(camera, canvas);
    // const helper = new AxesHelper(5);
    // this.scene.add(helper);
    const light = new DirectionalLight();
    light.intensity = 100;
    light.position.set(0, 100, 10);
    this.scene.add(light);
    this.render.render(this.scene, camera);
  }
  addBox() {
    const file = this.parseFetchData();
    const { min, max, data } = file;
    const range = max - min;
    // 新建一个box geometry
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new BoxGeometry(boxWidth, boxHeight, boxDepth);
    // 使几何体中心在z轴底部
    geometry.applyMatrix4(new Matrix4().makeTranslation(0, 0, 1));

    // 位置辅助器可以方便地在球面上定位
    // 经度辅助器可以在XZ平面的法向旋转
    const lonHelper = new Object3D();// 竖棍
    this.scene.add(lonHelper);
    // 纬度辅助器可以在XZ平面旋转
    const latHelper = new Object3D();// 横棍
    lonHelper.add(latHelper);
    // 组合起来得到的位置辅助器可以在球面上定位
    const positionHelper = new Object3D();
    positionHelper.position.z = 10;// 地球 半径为10 要在表面生成得默认在地球表面 10
    latHelper.add(positionHelper);

    const lonFudge = Math.PI * 0.5;
    const latFudge = Math.PI * -0.135;
    data.forEach((row, latNdx) => {
      row.forEach((value, lonNdx) => {
        if (value === undefined) {
          return;
        }
        const amount = (value - min) / range;
        const material = new MeshBasicMaterial();
        const hue = MathUtils.lerp(0.7, 0.3, amount);
        const saturation = 1;
        const lightness = MathUtils.lerp(0.1, 1.0, amount);
        material.color.setHSL(hue, saturation, lightness);
        const mesh = new Mesh(geometry, material);
        this.scene.add(mesh);

        // 调整辅助器使其指向经纬度
        lonHelper.rotation.y = MathUtils.degToRad(lonNdx + file.xllcorner) + lonFudge; // 绕y轴旋转 改变x轴位置
        latHelper.rotation.x = MathUtils.degToRad(latNdx + file.yllcorner) + latFudge; // 绕x轴旋转 改变Y轴位置

        // 使用world matrix来操作辅助器
        positionHelper.updateWorldMatrix(true, false); // 更新lon helper和lat helper
        mesh.applyMatrix4(positionHelper.matrixWorld); //mesh点更新到地球表面
        // 矩形点
        mesh.scale.set(0.05, 0.05, MathUtils.lerp(0.1, 5, amount));
      });
    });
  }
  // 创建地球
  earthCreate() {
    const loader = new TextureLoader();
    loader.load('assets/images/three/world.jpg', data => {
      const geometry = new SphereGeometry(10, 64, 32);
      // 不受光照影响的材质
      const material = new MeshBasicMaterial({ map: data, color: '#61afef' });
      this.scene.add(new Mesh(geometry, material));
      this.addBox();
    });

    const anime = () => {
      this.render.render(this.scene, this.camera);
      requestAnimationFrame(anime);
    };
    anime();
  }
  // 导入gltf模型
  async createGLTF() {
    const gltf = (await this.loadGltf()) as any;
    this.scene.add(gltf);
    const anime = () => {
      this.render.render(this.scene, this.camera);
      requestAnimationFrame(anime);
    };
    anime();
  }
}
class PickHelper {
  raycaster: any
  pickedObject: any
  pickedObjectSavedColor: any
  constructor() {
    this.raycaster = new Raycaster();
    this.pickedObject = null;
    this.pickedObjectSavedColor = 0;
  }
  pick(normalizedPosition, scene, camera, time) {
    // 恢复上一个被拾取对象的颜色
    if (this.pickedObject) {
      this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
      this.pickedObject = undefined;
    }
 
    // 发出射线
    this.raycaster.setFromCamera(normalizedPosition, camera);
    // 获取与射线相交的对象
    const intersectedObjects = this.raycaster.intersectObjects(scene.children);
    if (intersectedObjects.length) {
      // 找到第一个对象，它是离鼠标最近的对象
      this.pickedObject = intersectedObjects[0].object;
      // 保存它的颜色
      this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
      // 设置它的发光为 黄色/红色闪烁
      this.pickedObject.material.emissive.setHex((time * 8) % 2 > 1 ? 0xFFFF00 : 0xFF0000);
    }
  }
}