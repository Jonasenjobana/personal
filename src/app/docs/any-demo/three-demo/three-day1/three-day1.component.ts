import { Component, Renderer2 } from '@angular/core';
import gsap from 'gsap';
import {
  AxesHelper,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  Camera,
  Color,
  DirectionalLight,
  DoubleSide,
  MathUtils,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  PerspectiveCamera,
  Quaternion,
  Raycaster,
  Renderer,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  TextureLoader,
  Vector3,
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
      // this.creatVarifyGeometry();
      this.earthCreate();
    }, 1000);
    // this.createGLTF();
  }
  /**根据顶点颜色 创建渐变图案 */
  creatVarifyGeometry() {
    const material = new ShaderMaterial({
      vertexShader: `
      varying vec3 vPosition;//表示顶点插值后位置数据，与片元数量相同，一一对应
      void main(){
        vPosition = vec3(modelMatrix * vec4( position, 1.0 ));
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
      `,
      fragmentShader: `
      varying vec3 vPosition;//获取顶点着色器插值数据vPosition
      void main() {
        float per = vPosition.y /50.0;
        // Mesh y坐标50，颜色值：1  0  0(红色) 50 到 0 渐变
        // Mesh y坐标0，颜色值：0  1  0(绿色)
        gl_FragColor = vec4(per,1.0-per,0.0,1.0);
      }
      `,
      vertexColors: true
    });
    const geometry = new BufferGeometry(); //
    const vertices = new Float32Array([
      //类型数组创建顶点数据
      0,
      0,
      0, //顶点1坐标
      50,
      0,
      0, //顶点2坐标
      0,
      25,
      0 //顶点3坐标
    ]);
    geometry.attributes['position'] = new BufferAttribute(vertices, 3);
    const colors = new Float32Array([
      1,
      0,
      0, //顶点1颜色
      0,
      0,
      1, //顶点2颜色
      0,
      1,
      0 //顶点3颜色
    ]);
    geometry.attributes['color'] = new BufferAttribute(colors, 3);
    const mesh = new Mesh(geometry, material);
    this.scene.add(mesh);

    const anime = () => {
      this.render.render(this.scene, this.camera);
      requestAnimationFrame(anime);
    };
    anime();
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
    const camera = (this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000));
    camera.position.set(10, 10, 10);
    this.scene.add(camera);
    this.render = new WebGLRenderer({ canvas, alpha: false });
    this.render.setSize(window.innerWidth, window.innerHeight);
    const controls = new OrbitControls(camera, canvas);
    const helper = new AxesHelper(500);
    this.scene.add(helper);
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
    // 使几何体中心在z轴底部 否则默认在矩形中心 因此偏移0.5到z轴
    geometry.applyMatrix4(new Matrix4().makeTranslation(0, 0, 0.5));
    // 位置辅助器可以方便地在球面上定位
    // 经度辅助器可以在XZ平面的法向旋转
    const lonHelper = new Object3D();
    this.scene.add(lonHelper);
    // 纬度辅助器可以在XZ平面旋转
    const latHelper = new Object3D();
    lonHelper.add(latHelper);
    // 组合起来得到的位置辅助器可以在球面上定位
    const positionHelper = new Object3D();
    positionHelper.position.z = 10; // 地球 半径为10 要在表面生成得默认在地球表面 10
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
  earth: Mesh;
  uniforms: any;
  quaternion: Quaternion;
  // 创建地球
  earthCreate() {
    const loader = new TextureLoader();
    loader.load('assets/images/three/world.jpg', data => {
      const geometry = new SphereGeometry(10, 64, 32);

      this.uniforms = {
        fpsCount: { value: 0.0 }, // 帧数
        map: { value: data } // 传入贴图信息
      };
      // 不受光照影响的材质
      const a = new ShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        void main(){
          vUv = uv;// UV坐标插值计算
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
          vPosition = position;
        }
        `,
        // 扫描球体
        fragmentShader: `
        uniform sampler2D map;// 颜色贴图变量
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform float fpsCount;// uniform声明帧数变量fpsCount
        void main() {
            // 通过几何体的UV坐标从颜色贴图获取像素值
            gl_FragColor = texture2D( map, vUv );
            // 根据贴图坐标分类
            // if (vUv.y > 0.495 && vUv.y < 0.505) {
            //   gl_FragColor = vec4(0.89, 0.75, 0.30, 1.0); // 赤道地方绘制
            // }
            // 根据片元坐标分类
            // if (vPosition.y > 0.0 && vPosition.y < 2.0) {
            //   gl_FragColor = vec4(0.89, 0.75, 0.30, fpsCount); // 赤道地方绘制
            // }
            // 根据像素颜色分类
            if (gl_FragColor.r + gl_FragColor.g + gl_FragColor.b == 0.0) {
              gl_FragColor = vec4(0.89, 0.75, 0.30, fpsCount); // 完全黑的地方说明为陆地
            } else {
              gl_FragColor = vec4(0.066, 0.721, 0.839, 1.0); // 否则为海洋
            }
        }
        `
      });
      const material = new MeshBasicMaterial({ map: data, color: '#037a29', wireframe: true });
      this.earth = new Mesh(geometry, a);
      this.scene.add(this.earth);
      const helper = new AxesHelper(100000);
      this.earth.add(helper)
      // this.addBox();
    });
    let flag = 1;
    const control = new dat.GUI();
    const axis = new Vector3(0, 1, 0);
    control.add(axis, 'x', -1, 1, 0.01);
    control.add(axis, 'y', -1, 1, 0.01);

    const anime = () => {
      if (this.earth) {
        // this.earth.applyQuaternion(this.quaternion)
        this.earth.rotateOnAxis(axis.copy(axis), 0.01);
      }
      if (this.uniforms) {
        this.uniforms.fpsCount.value += 0.01 * flag;
        if (this.uniforms.fpsCount.value >= 1 || this.uniforms.fpsCount.value <= 0) {
          flag *= -1;
        }
      }
      this.render.render(this.scene, this.camera);
      requestAnimationFrame(anime);
    };
    anime();
  }
  // 自定义着色器
  createCustomShader() {
    return new ShaderMaterial({
      uniforms: {
        // 给透明度uniform变量opacity传值
        opacity: { value: 0.3 },
        // 给uniform同名color变量传值
        color: { value: new Color(0x037a29) },
        color2: { value: new Color(0xffff00) }
      },
      vertexShader: `
      
      varying vec3 vColor;// varying关键字声明一个变量表示顶点颜色插值后的结果
      void main() {
        vColor = color;// 顶点颜色数据进行插值计算
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); // 顶点位置 按照mesh自身的世界坐标
      }
      `, // 顶点着色器
      fragmentShader: `
        uniform vec3 color;// uniform声明透明度变量color
        uniform vec3 color2;// uniform声明透明度变量color2
        uniform float opacity;// uniform声明透明度变量opacity
        void main() {
          gl_FragColor = vec4(color, opacity);
        }
      `, // 片元着色器
      vertexColors: true, // 顶点颜色渲染,
      wireframe: true
    });
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
  raycaster: any;
  pickedObject: any;
  pickedObjectSavedColor: any;
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
      this.pickedObject.material.emissive.setHex((time * 8) % 2 > 1 ? 0xffff00 : 0xff0000);
    }
  }
}
