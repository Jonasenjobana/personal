import { Component, ElementRef, ViewChild } from '@angular/core';
import * as dat from 'dat.gui';
import * as Three from 'three';
import gsap from 'gsap';
import { ThreeBase } from '../three.base';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { TEvent } from './util/tEvent';
import shaderCommon from './shader/sl-shader-common';
import { CameraAutoMover } from './util/tBox';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutlinePass } from './js/pass/outlinepass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { SCENE_PIPE_CONFIG } from './config/pipe';
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer';
import { Line2 } from 'three/examples/jsm/lines/Line2';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';
import { fragementShaderEndReplace, shaderStartReplace, vertexShaderEndReplace } from './util/ShaderReplace';
import { InstancedInterleavedBuffer } from 'three';
import { LineMaterial } from './js/line2/LineMaterial';
@Component({
  selector: 'Three2',
  templateUrl: '../three.base.html',
  styleUrls: ['../three.base.less']
})
export class Three2Component extends ThreeBase {
  raycaster = new Three.Raycaster();
  control: any;
  pointer: Three.Vector2 = new Three.Vector2();
  fpc: FirstPersonControls;
  render2d: CSS2DRenderer = new CSS2DRenderer();
  hover: Three.Object3D;
  effectCom: EffectComposer;
  tEvent: TEvent = new TEvent();
  @ViewChild('tagRef') tagRef: ElementRef<HTMLDivElement>;
  constructor(private eleRef: ElementRef<HTMLElement>) {
    super();
  }
  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    const { width, height } = this.el.getBoundingClientRect();
    this.render2d.setSize(width, height);
    this.render2d.domElement.style.position = 'absolute';
    this.render2d.domElement.style.top = '0';
    this.eleRef.nativeElement.appendChild(this.render2d.domElement);
    this.tCamera.position.set(0, 0, -40);
    this.effectCom = new EffectComposer(this.tRender);
    // this.tControl.target.set(-78, 72, -20);
    this.tScene.background = new Three.Color(0xefefef);
    const dl = new Three.DirectionalLight(0xffffff, 4);
    dl.position.set(0, 10, 0);
    dl.lookAt(new Three.Vector3(0, 0, 0));
    this.tScene.add(dl);
    const ambiLight = new Three.AmbientLight(0xffffff, 4);
    ambiLight.position.set(0, 10, 0);
    ambiLight.lookAt(new Three.Vector3(0, 0, 0));
    this.tScene.add(ambiLight);
    // this.instancedBufferGeometry();
    this.pointBuffer();
    // this.initMc();
    // this.initTube();
    // this.waterPlane();
    // this.initScene();
    // this.sphere();
    // this.rain();
    // this.initCube();
    this.control = new dat.GUI();
    // this.tCamera.lookAt(new Three.Vector3(-180, 2.5, -249));
    // this.tControl.target.set(-180, 2.5, -249);
    // this.pathPipe();
    // this.crossHole();
  }
  groupMeshes: Three.Group = new Three.Group();
  pipeMeshes: Three.Mesh[] = [];
  pipe: Three.Mesh;
  houseMaterial;
  textureUniform = {
    progress: { value: 0 },
    edgeWidth: { value: 0.1 },
    edgeColor: { value: new Three.Color(0xff77ee) },
    iTime: { value: 0 },
    noiseTexture: { value: new Three.TextureLoader().load('/assets/images/texture/noise.png') },
    arrowTexture: { value: new Three.TextureLoader().load('/assets/images/direction-arrow.png') },
    waterTexture: { value: new Three.TextureLoader().load('/assets/images/texture/water2.png') },
    earthTexture: { value: new Three.TextureLoader().load('/assets/images/texture/world2.jpg') },
    ship1: { value: new Three.TextureLoader().load('/assets/map/ship/1.png') },
    ship2: { value: new Three.TextureLoader().load('/assets/map/ship/2.png') },
    ship3: { value: new Three.TextureLoader().load('/assets/map/ship/3.png') },
    repeat: { value: 1 }
  };
  repeatMap: { [key in string]: { value: number } } = {};
  initMc() {
    const cellSize = 256;
    const cell = new Uint8Array(cellSize * cellSize * cellSize);
    const box = new Three.BoxGeometry(1);
    const material = new Three.MeshPhongMaterial({ color: 'green' });
    for (let y = 0; y < cellSize; ++y) {
      for (let z = 0; z < cellSize; ++z) {
        for (let x = 0; x < cellSize; ++x) {
          const height = (Math.sin((x / cellSize) * Math.PI * 4) + Math.sin((z / cellSize) * Math.PI * 6)) * 20 + cellSize / 2;
          if (height < y + 1) {
            const offset = y * cellSize * cellSize + z * cellSize + x;
            cell[offset] = 1;
          }
        }
      }
    }
    for (let y = 0; y < cellSize; ++y) {
      for (let z = 0; z < cellSize; ++z) {
        for (let x = 0; x < cellSize; ++x) {
          const offset = y * cellSize * cellSize + z * cellSize + x;
          const block = cell[offset];
          const mesh = new Three.Mesh(box, material);
          mesh.position.set(x, y, z);
          this.tScene.add(mesh);
        }
      }
    }
  }
  pointBuffer() {
    const count = 1000;
    const pointType = new Float32Array(count);
    const pointPosition = new Float32Array(count * 3);
    const pointColor = new Float32Array(count * 3);
    const pointRadain = new Float32Array(count);
    const radius = 1.5;
    const earth = new Three.SphereGeometry(radius - 0.01, 64, 64);
    for (let i = 0; i < count * 3; i += 3) {
      const r = Math.random() * Math.PI * 2;
      const r2 = Math.random() * Math.PI;
      pointPosition[i] = radius * Math.cos(r) * Math.sin(r2);
      pointPosition[i + 1] = radius * Math.cos(r2);
      pointPosition[i + 2] = radius * Math.sin(r) * Math.sin(r2);
      pointColor[i] = Math.random();
      pointColor[i + 1] = Math.random();
      pointColor[i + 2] = Math.random();
      pointType[i / 3] = Math.floor(Math.random() * 3);
      pointRadain[i / 3] = Math.random() * Math.PI * 2;
    }
    const parital = new Three.BufferGeometry();
    parital.setAttribute('position', new Three.BufferAttribute(pointPosition, 3));
    parital.setAttribute('color', new Three.BufferAttribute(pointColor, 3));
    parital.setAttribute('type', new Three.BufferAttribute(pointType, 1));
    parital.setAttribute('radain', new Three.BufferAttribute(pointRadain, 1));
    const martial = new Three.PointsMaterial({
      size: 16,
      vertexColors: true,
      sizeAttenuation: false
    });
    martial.onBeforeCompile = shader => {
      shader.uniforms['ship1'] = this.textureUniform.ship1;
      shader.uniforms['ship2'] = this.textureUniform.ship2;
      shader.uniforms['ship3'] = this.textureUniform.ship3;
      shader.vertexShader = shader.vertexShader
        .replace(
          `#include <common>`,
          /*glsl*/ `
        attribute float type;
        attribute float radain;
        varying float vType;
        varying float vRadain;
        #include <common>
        `
        )
        .replace(
          `#include <fog_vertex>`,
          `#include <fog_vertex>
          vType = type;
          vRadain = radain;
        `
        );
      shader.fragmentShader = shader.fragmentShader
        .replace(
          `#include <common>`,
          /*glsl*/ `
        #include <common>
        uniform sampler2D ship1;
        uniform sampler2D ship2;
        uniform sampler2D ship3;
        varying float vType;
        varying float vRadain;
        `
        )
        .replace(
          `#include <premultiplied_alpha_fragment>`,
          /*glsl*/ `
          #include <premultiplied_alpha_fragment>
          vec4 tColor;
          vec2 uv = gl_PointCoord;
          uv.y = 1.0 - uv.y;
          uv -= vec2(.5);
          uv = vec2(uv.x * cos(vRadain) - uv.y * sin(vRadain), uv.x * sin(vRadain) + uv.y * cos(vRadain));
          uv += vec2(.5);
          if (vType == .0) {
            tColor = texture2D(ship1, uv);
          } else if (vType == 1.0) {
            tColor = texture2D(ship2, uv);
          } else {
            tColor = texture2D(ship3, uv);
          }
          if (tColor.a < .1) discard;
          gl_FragColor = tColor;
          `
        );
      console.log(shader);
    };
    const material2 = new Three.MeshPhongMaterial({
      map: this.textureUniform.earthTexture.value
    });
    const point = new Three.Points(parital, martial);
    const mesh = new Three.Mesh(earth, material2);
    this.tScene.add(point);
    this.tScene.add(mesh);
    this.flyLine(mesh);
  }
  /**环绕飞线 */
  flyLine(mesh: Three.Mesh) {
    const radius = 1.5;
    const alatlng: [number, number] = [39.3, 124];
    const blatlng: [number, number] = [33.4, 114];
    function latLonToPosition(lat, lon, radius) {
      const phi = ((90 - lat) * Math.PI) / 180; // 纬度转弧度
      const theta = ((lon + 180) * Math.PI) / 180; // 经度转弧度
      return new Three.Vector3(-radius * Math.sin(phi) * Math.cos(theta), radius * Math.cos(phi), radius * Math.sin(phi) * Math.sin(theta));
    }
    const aPos = latLonToPosition(...alatlng, radius);
    const bPos = latLonToPosition(...blatlng, radius);
    const middle = new Three.Vector3((aPos.x + bPos.x) / 2, (aPos.y + bPos.y) / 2 + 1, (aPos.z + bPos.z) / 2);
    const curve = new Three.CubicBezierCurve3(aPos, middle, middle, bPos);
    const lineGeo = new LineGeometry();
    const pp: any = curve.getPoints(30).reduce((arr, el) => {
      arr.push(...el);
      return arr;
    }, []); // 分成2片需要3个点 3*3 长度存3d坐标
    lineGeo.setPositions(pp);
    console.log(lineGeo, new InstancedInterleavedBuffer(pp, 6, 1));
    const lineMaterial: any = new LineMaterial({
      linewidth: 16,
      color: 0x000
    });
    lineMaterial.onBeforeCompile = shader => {
      shader.uniforms['map1'] = this.textureUniform.arrowTexture;
      shader.vertexShader = vertexShaderEndReplace(shader.vertexShader, 
        ``
      )
      shader.fragmentShader = shaderStartReplace(
        shader.fragmentShader,
        /*glsl*/ `
          uniform sampler2D map1;
        `
      );
      shader.fragmentShader = fragementShaderEndReplace(
        shader.fragmentShader,
        /*glsl*/ `
          vec2 mapUv = vUv;
          if (abs(vUv.y) > 1.0) {
            mapUv.y = mapUv.y > 0.0 ?  mapUv.y - 1.0 : 1.0 + mapUv.y;
            gl_FragColor = texture2D(map1, mapUv);
          }
          // if (gl_FragColor.g < .1) {
          //   // discard;
          // }
        `
      );
      console.log(shader);
    };
    const line = new Line2(lineGeo, lineMaterial);
    mesh.add(line);
  }
  instancedBufferGeometry() {
    // 创建基础几何体（例如一个单位立方体）
    const baseGeometry = new Three.BoxGeometry(1, 1, 1);

    // 转换为 InstancedBufferGeometry
    const instancedGeometry = new Three.InstancedBufferGeometry();
    instancedGeometry.index = baseGeometry.index; // 索引数据
    instancedGeometry.attributes = baseGeometry.attributes; // 顶点属性（position, normal, uv等）
    const instanceCount = 1000; // 实例数量

    // 实例位置偏移（每个实例3个浮点数：x, y, z）
    const positions = new Float32Array(instanceCount * 3);
    for (let i = 0; i < instanceCount; i++) {
      positions[i * 3] = Math.random() * 100 - 50; // x ∈ [-50, 50)
      positions[i * 3 + 1] = Math.random() * 100 - 50; // y
      positions[i * 3 + 2] = Math.random() * 100 - 50; // z
    }

    // 将位置数据添加为实例化属性
    instancedGeometry.setAttribute('instancePosition', new Three.InstancedBufferAttribute(positions, 3));
    const material = new Three.MeshStandardMaterial({
      color: 0x00ff00
      // 关键：标记材质支持实例化
    });
    material.onBeforeCompile = shader => {
      shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
        #include <common>
        attribute vec3 instancePosition; // 声明实例化属性
        `
      );
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
        // 将实例位置叠加到顶点坐标
        vec3 transformed = position + instancePosition;
        `
      );
    };
    const mesh = new Three.InstancedMesh(instancedGeometry, material, instanceCount);
    this.tScene.add(mesh);
  }
  spritGeo() {
    const spritMaterial = new Three.SpriteMaterial();
    const spirt = new Three.Sprite(spritMaterial);
    this.tScene.add(spirt);
  }
  initTube() {
    const tube = new Three.TubeGeometry(
      new Three.CatmullRomCurve3([new Three.Vector3(20, 10, 10), new Three.Vector3(10, 10, 10), new Three.Vector3(10, 10, 20), new Three.Vector3(20, 20, 30), new Three.Vector3(20, 20, 40)]),
      40,
      2,
      5
    );
    const material = new Three.MeshPhysicalMaterial({
      transmission: 1.0,
      ior: 1.5,
      color: 0x00ff00
    });
    material.onBeforeCompile = shader => {
      shader.uniforms['iTime'] = this.textureUniform.iTime;
      shader.uniforms['uRepeat'] = { value: new Three.Vector2(10, 3) };
      console.log(shader);

      // fragmentShader: wfs,
      // vertexShader: `
      //         // 顶点的Y坐标
      //   varying vec3 vPosition;
      //   varying vec2 vUv;
      //   void main() {
      //       vUv = uv;
      //       vPosition  = vec3( position.x , position.y, position.z );
      //       gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      //   }
      // `
    };
    // material.wireframe = true;
    const mesh = new Three.Mesh(tube, material);
    const plane = new Three.PlaneGeometry(100, 100);
    plane.rotateZ(Math.PI / 2);
    const planeMesh = new Three.MeshBasicMaterial({
      color: 0xefefef,
      side: Three.DoubleSide
    });
    this.tScene.add(new Three.Mesh(plane, planeMesh));
    this.tScene.add(mesh);
  }
  /**水波纹 波浪纹理 */
  waterPlane() {
    const circle = new Three.SphereGeometry(1);
    const circleMesh = new Three.Mesh(
      circle,
      new Three.MeshPhysicalMaterial({
        color: 0x000088
      })
    );
    circleMesh.position.set(-2, -2, -2);
    this.tScene.add(circleMesh);
    const waterPlane = new Three.PlaneGeometry(1, 1, 128, 128); // 细分多点
    const waterShader = new Three.ShaderMaterial({
      uniforms: {
        uTime: this.textureUniform.iTime
      },
      side: Three.DoubleSide,
      wireframe: true,
      vertexShader: /*glsl*/ `
      uniform float uTime;
      ${shaderCommon.simpleNoise}
      varying vec3 vNormal;
      varying vec3 vPosition;
    
      void main() {
        float x = position.x;
        float y = position.y;
        float delta = 0.001;
    
        // 计算Z值
        float z = cnoise(position + vec3(sin(uTime*.01),0,uTime*.01));
    
        // 计算x方向梯度
        float z_x_plus = cnoise(vec3(position.x+delta, position.yz));
        float z_x_minus = cnoise(vec3(position.x-delta, position.yz));
        float dz_dx = (z_x_plus - z_x_minus) / (2.0 * delta);
    
        // 计算y方向梯度
        float z_y_plus = cnoise(vec3(position.x, position.y + delta, position.z));
        float z_y_minus = cnoise(vec3(position.x, position.y - delta, position.z));
        float dz_dy = (z_y_plus - z_y_minus) / (2.0 * delta);
    
        // 法向量计算
        vec3 normal = normalize(vec3(-dz_dx, -dz_dy, 1.0));
    
        // 输出
        gl_Position = projectionMatrix * modelViewMatrix * vec4(x, y, z, 1.0);
        vNormal = normal;
      }
      `,
      fragmentShader: /*glsl*/ `
      varying vec3 vNormal;
      void main () {
        gl_FragColor = vec4(vNormal * 0.5 + 0.5, 1.0);
      }
      `
    });
    const mesh = new Three.Mesh(waterPlane, waterShader);
    mesh.rotateX(Math.PI / 2);
    this.tScene.add(mesh);
  }
  initCube() {
    const geometry = new Three.BoxGeometry(1, 1, 1, 10, 10, 10);
    const material = new Three.MeshNormalMaterial();
    // material.wireframe = true;
    const mesh = new Three.Mesh(geometry, material);
    material.onBeforeCompile = shader => {
      shader.uniforms['uTime'] = this.textureUniform.iTime;
      shader.vertexShader = shader.vertexShader
        .replace(
          `#include <displacementmap_vertex>`,
          `
          #include <displacementmap_vertex>
          float angle = sin(position.y+uTime) *0.5;
          mat2 A = mat2(cos(angle),-sin(angle),
                  sin(angle),cos(angle));
          transformed.xz = A * transformed.xz;
          // transformed.y += sin(position.x+uTime) *0.5;
        `
        )
        .replace(
          '#include <common>',
          `
        #include <common>
        uniform float uTime;`
        );
      // shader.fragmentShader = shader.fragmentShader.replace(
      console.log(shader.vertexShader);
      console.log(shader.fragmentShader);
      // )
    };
    this.tScene.add(mesh);
  }
  /**生成缓冲区材质*/
  passHandle() {
    const { width, height } = this.el.getBoundingClientRect();
    const renderBuffer = new Three.WebGLRenderTarget(512, 512);
    renderBuffer.texture.name = 'render-target-buffer';
    const rtFov = 75;
    const rtAspect = width / height;
    const rtNear = 0.1;
    const rtFar = 1000;
    const rtCamera = new Three.PerspectiveCamera(rtFov, rtAspect, rtNear, rtFar);
    rtCamera.position.z = 2;

    const rtScene = new Three.Scene();
    rtScene.background = new Three.Color('red');
    const color = 0xffffff;
    const intensity = 1;
    const light = new Three.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    light.lookAt(new Three.Vector3(0, 0, 0));
    rtScene.add(light);
    rtScene.add(rtCamera);
    const cube = new Three.BoxGeometry(1, 1, 1);
    const cube2 = cube.clone() as Three.BoxGeometry;
    const material = new Three.MeshBasicMaterial({ map: renderBuffer.texture });
    const material2 = new Three.MeshBasicMaterial({ color: 0x3dff00, wireframe: true });
    const mesh = new Three.Mesh(cube, material);
    const mesh2 = new Three.Mesh(cube2, material2);
    gsap.to(mesh2.rotation, {
      x: Math.PI * 2,
      y: Math.PI * 2,
      z: Math.PI * 2,
      repeat: -1,
      duration: 5
    });
    rtScene.add(mesh2);
    this.tScene.add(mesh);
    this.tEvent.on('tick', () => {
      this.tRender.setRenderTarget(renderBuffer);
      this.tRender.render(rtScene, rtCamera);
      this.tRender.setRenderTarget(null);
    });
    // this
  }
  override saveBuffer(): void {
    this.passHandle();
  }
  raySelect() {
    const { width, height } = this.el.getBoundingClientRect();
    const renderPass = new RenderPass(this.tScene, this.tCamera);
    // this.effectCom.addPass(renderPass);
    const v2 = new Three.Vector2(512, 512);
    const bloom = new UnrealBloomPass(v2, 1, 1, 0);
    // this.effectCom.addPass(bloom);
    const outlinePass = new OutlinePass(v2, this.tScene, this.tCamera);
    this.textureUniform.arrowTexture.value.center = new Three.Vector2(0.5, 0.5);
    this.textureUniform.arrowTexture.value.rotation = Math.PI / 2;
    this.el.addEventListener('click', e => {
      // 初始化
      const cameraMover = new CameraAutoMover(this.tCamera, this.tControl);
      const { offsetX, offsetY } = e;
      const x = (offsetX / width) * 2 - 1;
      const y = -(offsetY / height) * 2 + 1;
      const raycaster = new Three.Raycaster();
      raycaster.setFromCamera(new Three.Vector2(x, y), this.tCamera); // x y 点击
      const cross = raycaster.intersectObjects(this.pipeMeshes); // 获取与射线相交的对象
      if (cross?.length > 0) {
        cameraMover.moveToObject(cross[0].object); // 改变相机位置
        // const mesh: Three.Mesh = cross[0].object as Three.Mesh;
        // this.repeatMap[mesh.name] = this.repeatMap[mesh.name] ?? { value: SCENE_PIPE_CONFIG[mesh.name].repeat}
        // // this.textureUniform.repeat = this.repeatMap[mesh.name];
        // // mesh.material
        // // const meshPos = mesh.position.clone().applyMatrix4(mesh.matrixWorld);
        // // gsap.to(this.tCamera.position, {
        // //   duration: 3,
        // //   ease: 'none',
        // //   x: meshPos.x,
        // //   y: meshPos.y,
        // //   z: meshPos.z,
        // //   onUpdate: () => {
        // //     this.tCamera.lookAt(meshPos);
        // //     this.tControl.target.copy(meshPos);
        // //   }
        // // });
        // // gsap.to(this.tCamera.position)
        // // 获取物体的真实尺寸（考虑缩放）
        // const water = mesh.clone() as Three.Mesh;
        // mesh.parent.add(water);
        // const material = (mesh.material as Three.MeshStandardMaterial).clone();
        // mesh.material = new Three.MeshBasicMaterial({ color: 0x00008e, opacity: 0.6, transparent: true, depthWrite: false });
        // // material.wireframe = true;
        // water.material = new Three.ShaderMaterial({
        //   transparent: true,
        //   depthWrite: false,
        //   // blending: Three.CustomBlending,
        //   // blending: Three.NormalBlending,
        //   // blendEquation: Three.AddEquation,
        //   // blendSrc: Three.OneMinusDstAlphaFactor, // 特殊混合模式
        //   // blendDst: Three.DstAlphaFactor,
        //   uniforms: {
        //     uTime: this.textureUniform.iTime,
        //     tImage: this.textureUniform.waterTexture,
        //     arrowTexture: this.textureUniform.arrowTexture,
        //     repeat:  this.repeatMap[mesh.name]
        //   },
        //   vertexShader: /*glsl*/ `
        //       varying vec3 vPosition;
        //       varying vec2 vUv;
        //       void main() {
        //           vUv = uv;
        //           vec3 newPos = position + normal * -.02;
        //           gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
        //       }
        //     `,
        //   fragmentShader: /*glsl*/ `
        //     uniform sampler2D tImage;
        //     uniform float uTime;
        //     varying vec2 vUv;
        //     uniform float repeat;

        //     void main() {
        //       /** 使用 -uOffset 保证和 progress 动画方向一致*/

        //       vec2 p = fract(vUv * vec2(repeat, 1.0) - vec2(uTime * .1, .0));
        //       vec4 texture_color = vec4(0.112156862745098, 0.44527450980392157, 0.8733333333333333, 1.0);

        //       vec4 k = vec4(uTime)*0.8;
        //       k.xy = p * 7.0;
        //       float val1 = length(0.5-fract(k.xyw*=mat3(vec3(-2.0,-1.0,0.0), vec3(3.0,-1.0,1.0), vec3(1.0,-1.0,-1.0))*0.5));
        //       float val2 = length(0.5-fract(k.xyw*=mat3(vec3(-2.0,-1.0,0.0), vec3(3.0,-1.0,1.0), vec3(1.0,-1.0,-1.0))*0.2));
        //       float val3 = length(0.5-fract(k.xyw*=mat3(vec3(-2.0,-1.0,0.0), vec3(3.0,-1.0,1.0), vec3(1.0,-1.0,-1.0))*0.5));
        //       vec4 color = vec4 ( pow(min(min(val1,val2),val3), 7.0) * 3.0)+texture_color;
        //       gl_FragColor = vec4(color.rgb, 1.0);
        //     }
        //     `
        // });
        // const arrow = water.clone() as Three.Mesh;
        // arrow.material = new Three.ShaderMaterial({
        //   transparent: true,
        //   depthWrite: false,
        //   // blending: Three.NormalBlending,
        //   uniforms: {
        //     uTime: this.textureUniform.iTime,
        //     tImage: this.textureUniform.waterTexture,
        //     arrowTexture: this.textureUniform.arrowTexture,
        //     repeat: this.repeatMap[mesh.name]
        //   },
        //   opacity: 0.6,
        //   vertexShader: /*glsl*/ `
        //     varying vec3 vPosition;
        //     varying vec2 vUv;
        //     void main() {
        //         vUv = uv;
        //         vec3 newPos = position + normal * -.04;
        //         gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
        //     }
        //   `,
        //   fragmentShader: /*glsl*/ `
        //   uniform sampler2D arrowTexture;
        //   uniform float uTime;
        //   varying vec2 vUv;
        //   uniform float repeat;

        //   void main() {
        //     /** 使用 -uOffset 保证和 progress 动画方向一致*/
        //     vec2 uv = vUv.yx;
        //     vec2 p = fract(uv * vec2(1.0, repeat) + vec2(.0, -uTime * .1));
        //     vec4 color = texture2D(arrowTexture, p);
        //      // 硬边缘透明处理
        //     if(color.a < 0.1) discard;
        //     gl_FragColor = color;
        //   }
        //   `
        // });
        // mesh.parent.add(arrow);
        // material.map = this.textureUniform.arrowTexture.value;
        // material.map.wrapS = material.map.wrapT = Three.RepeatWrapping;
        // material.map.rotation = Math.PI / 2;
        // 设置重复参数
        // material.map.repeat.set(10, 1);
        // gsap.to(material.map.offset, {
        //   ease: 'none',
        //   y: -10,
        //   duration: 5,
        //   repeat: -1
        // });
        // mesh.material.onBeforeCompile = shader => {
        //   shader.uniforms['uTime'] = this.textureUniform.iTime;
        //   shader.uniforms['iResolution'] = { value: new Three.Vector2(width, height) };
        //   shader.uniforms['tImage'] = { value: this.textureUniform.watetTexture};
        //   shader.uniforms['arrowTexture'] = { value: this.textureUniform.arrowTexture };
        //   shader.fragmentShader = shader.fragmentShader
        //     .replace(
        //       '#include <common>',
        //       `
        //     #include <common>
        //     uniform sampler2D arrowTexture;
        //     uniform vec2 iResolution;
        //     varying vec2 vUv;
        //     ${fs}
        //     `
        //     )
        //     .replace(
        //       '#include <dithering_fragment>',
        //       `
        //     #include <dithering_fragment>
        //     gl_FragColor = water(gl_FragCoord.xy/iResolution.xy);
        //     gl_FragColor = texture2D(arrowTexture, gl_FragCoord.xy/iResolution.xy);
        //     `
        //     );
        //   shader.vertexShader = shader.vertexShader.replace(`#include <fog_vertex>`, `
        //     #include <fog_vertex>
        //     vec3 newPosition = position + normal * -0.02;
        //     // gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        //     vec2 vUv = uv;
        //     `).replace(`#include <common>`, `
        //       varying vec2 vUv;
        //       `)
        // };

        // outlinePass.visibleEdgeColor.set('#ff00ff');
        // this.effectCom.addPass(outlinePass);
        // this.isComposerRender = true;
      }
      console.log(cross);
    });
  }
  initRadarScan(group: Three.Group) {
    const circle = new Three.CircleGeometry(10);
    const material = new Three.ShaderMaterial({
      uniforms: {
        uTime: this.textureUniform.iTime
      },
      transparent: true,
      vertexShader: /*glsl*/ `
        varying vec2 vUv;
        void main() {
          vUv = uv -.5;// 原点平移至中心
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      // 待优化 雷达扫描过渡
      fragmentShader: /*glsl */ `
        varying vec2 vUv;
        uniform float uTime;
        #define PI 3.1415926
        #define PI2 3.1415926 * 2.0
        float range = PI* .3;
        void main() {
          // 角度 0 - 2PI
          float curr = mod(uTime * PI * 2.0 * .1, PI * 2.0); // 当前扫描角度
          float angle = atan(vUv.x, vUv.y); // 像素所在角度
          if (angle < 0.0) {
            angle += PI * 2.0; // 防止为负数
          }
          float maxRadain = curr; // 最大角
          float minRadain = curr - range; // 最小值
          if (minRadain < .0) {
            maxRadain = PI2 + curr;
            minRadain = maxRadain - range;
            if (angle < PI * 2.0) {
              angle += PI * 2.0;
            }
          }
          if (angle <= maxRadain && angle >= minRadain) {
            // float alpha = ((angle + range) - radian) / range;
            float alpha = max(1.0, 0.0);
            gl_FragColor = vec4(0.0, 1.0, 1.0, alpha);
          } else {
            discard;
          }
          // if (angle <= radian && angle + range >= radian) {
          //   float alpha = ((angle + range) - radian) / range;
          //   alpha = max(alpha, 0.0);
          //   gl_FragColor = vec4(0.0, 1.0, 1.0, alpha);
          // } else {
          //   discard;
          // }
        }
      `,
      side: Three.DoubleSide,
      depthTest: true,
      depthWrite: false
    });
    circle.rotateX(Math.PI / 2);
    const mesh = new Three.Mesh(circle, material);
    mesh.position.setY(0.01);
    group.add(mesh);
    group.add(new Three.AxesHelper());
  }
  // 精灵模型
  rain() {
    const spM = new Three.SpriteMaterial({
      // color: 0x00ffff,
      transparent: true,
      map: new Three.TextureLoader().load('/assets/images/direction-arrow.png')
    });
    spM.onBeforeCompile = shader => {
      shader.uniforms['uTime'] = this.textureUniform.iTime;
      shader.fragmentShader = shader.fragmentShader
        .replace(
          `#include <fog_fragment>`,
          /*glsl*/ `#include <fog_fragment>
           vec2 fuv = fract(vMapUv * 5.0);
           // 中心圆
          // //  float dist = length(fuv - vec2(.5));
          // float dist = fract((length(fuv - vec2(.5)) - uTime * .02) * 5.0);
          // vec3 color = vec3(step(.5, dist));
          // //  vec3 color = vec3(step(sin(uTime * .4 + vMapUv.x + vMapUv.y) * .5, dist));
          //  gl_FragColor = vec4(color, 1.0);
          // 渐变切换 
          //  vec3 color1 = vec3(1.0, 1.0, 0.0);
          //  vec3 color2 = vec3(0.0, 1.0, 1.0); 
          //  float mixer1 = vMapUv.x + vMapUv.y;// 0 - 2
          //  float mixer2 = 2.0 - (vMapUv.x + vMapUv.y); // 2 - 0
          //  float mixer = mixer1 / mixer2; 
          // //  float mixer = min(mixer1, mixer2);
          //  vec3 color3 = mix(color1, color2, mixer);
          //  gl_FragColor = vec4(color3, 1.0);
          vec3 mask1 = vec3(step(0.5, fract(vMapUv.x * 3.0)));
          vec3 mask2 = vec3(step(0.5, fract(vMapUv.y * 3.0)));
          vec3 color = abs(mask1 - mask2);
          gl_FragColor = vec4(color, 1.0);
         `
        )
        .replace(
          `#include <common>`,
          `#include <common>
         uniform float uTime;
        `
        );
    };
    const sp = new Three.Sprite(spM);
    this.tScene.add(sp);
    this.tEvent.on('tick', () => {
      // this.tRender.render(this.tScene, this.tCamera);
    });
  }
  sphere() {
    const cir = new Three.SphereGeometry(1, 64, 64);
    const matr = new Three.ShaderMaterial({
      uniforms: {
        uTime: this.textureUniform.iTime
      },
      // wireframe: true,
      fragmentShader: /*glsl*/ `
        ${shaderCommon.hsl2rgb}
        varying vec3 vNormal;
        varying float vNoise;
        uniform float uTime;
        void main() {
          vec3 hslColor = hsl2rgb(vNoise*.1 + .1, 1.0, 0.5);
          gl_FragColor = vec4(hslColor, 1.0);
        }
      `,
      vertexShader: /*glsl*/ `
        ${shaderCommon.random}
        ${shaderCommon.rotate}
        ${shaderCommon.simpleNoise}
        uniform float uTime;
        varying float vNoise;
        varying vec3 vNormal;
        void main() {
          float noise = cnoise(position* (sin(uTime * .1) + 1.0) * 4.0);
          vec3 vPosition = position + normal * noise; // 增强某一向量趋于另一个向量趋势
          vec3 vP = rotate(vPosition, vec3(.0, 1.0, .0), uTime + vPosition.x);// y轴旋转
          vNoise = noise;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(vP, 1.0);
          vNormal = normal;
        }
      `
    });
    const obj = new Three.Mesh(cir, matr);
    this.tScene.add(obj);
  }

  render2D() {
    const tagEl = this.tagRef.nativeElement;
    const tagObj = new CSS2DObject(tagEl);
    const obj = new Three.Object3D();
    obj.add(tagObj);
    tagObj.position.copy(new Three.Vector3(-180, 115, -249));
    // this.tScene.add(obj);
  }
  initScene() {
    const loader = new GLTFLoader();
    const draco = new DRACOLoader();
    draco.setDecoderPath('/assets/js/draco/');
    loader.setDRACOLoader(draco);
    loader.loadAsync('/assets/gltf/bnsw/管道.glb').then(gltf => {
      const model = SkeletonUtils.clone(gltf.scene);
      this.raySelect();
      const sceneg = new Three.Group();
      sceneg.add(model);
      this.tScene.add(sceneg);
      // this.initRadarScan(sceneg);
      this.render2D();
      console.log(model);
      let first = false;
      model.traverse(child => {
        if (child instanceof Three.Mesh) {
          if (child.name.includes('管道')) {
            // this.groupMeshes.add(child);
            this.pipeMeshes.push(child);
            const mesh: Three.Mesh = child as Three.Mesh;
            this.repeatMap[mesh.name] = this.repeatMap[mesh.name] ?? { value: SCENE_PIPE_CONFIG[mesh.name].repeat };
            // this.textureUniform.repeat = this.repeatMap[mesh.name];
            // mesh.material
            // const meshPos = mesh.position.clone().applyMatrix4(mesh.matrixWorld);
            // gsap.to(this.tCamera.position, {
            //   duration: 3,
            //   ease: 'none',
            //   x: meshPos.x,
            //   y: meshPos.y,
            //   z: meshPos.z,
            //   onUpdate: () => {
            //     this.tCamera.lookAt(meshPos);
            //     this.tControl.target.copy(meshPos);
            //   }
            // });
            // gsap.to(this.tCamera.position)
            // 获取物体的真实尺寸（考虑缩放）
            const water = mesh.clone() as Three.Mesh;
            mesh.parent.add(water);
            const material = (mesh.material as Three.MeshStandardMaterial).clone();
            mesh.material = new Three.MeshBasicMaterial({ color: 0x00008e, opacity: 0.6, transparent: true, depthWrite: false });
            // material.wireframe = true;
            water.material = new Three.ShaderMaterial({
              transparent: true,
              depthWrite: false,
              // blending: Three.CustomBlending,
              // blending: Three.NormalBlending,
              // blendEquation: Three.AddEquation,
              // blendSrc: Three.OneMinusDstAlphaFactor, // 特殊混合模式
              // blendDst: Three.DstAlphaFactor,
              uniforms: {
                uTime: this.textureUniform.iTime,
                tImage: this.textureUniform.waterTexture,
                arrowTexture: this.textureUniform.arrowTexture,
                repeat: this.repeatMap[mesh.name]
              },
              vertexShader: /*glsl*/ `
                  varying vec3 vPosition;
                  varying vec2 vUv;
                  void main() {
                      vUv = uv;
                      vec3 newPos = position + normal * -.02;
                      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
                  }
                `,
              fragmentShader: /*glsl*/ `
                uniform sampler2D tImage;
                uniform float uTime;
                varying vec2 vUv;
                uniform float repeat;
      
                void main() {
                  /** 使用 -uOffset 保证和 progress 动画方向一致*/
    
                  vec2 p = fract(vUv * vec2(repeat, 1.0) - vec2(uTime * .1, .0));
                  vec4 texture_color = vec4(0.112156862745098, 0.44527450980392157, 0.8733333333333333, 1.0);
        
                  vec4 k = vec4(uTime)*0.8;
                  k.xy = p * 7.0;
                  float val1 = length(0.5-fract(k.xyw*=mat3(vec3(-2.0,-1.0,0.0), vec3(3.0,-1.0,1.0), vec3(1.0,-1.0,-1.0))*0.5));
                  float val2 = length(0.5-fract(k.xyw*=mat3(vec3(-2.0,-1.0,0.0), vec3(3.0,-1.0,1.0), vec3(1.0,-1.0,-1.0))*0.2));
                  float val3 = length(0.5-fract(k.xyw*=mat3(vec3(-2.0,-1.0,0.0), vec3(3.0,-1.0,1.0), vec3(1.0,-1.0,-1.0))*0.5));
                  vec4 color = vec4 ( pow(min(min(val1,val2),val3), 7.0) * 3.0)+texture_color;
                  gl_FragColor = vec4(color.rgb, 1.0);
                }
                `
            });
            const arrow = water.clone() as Three.Mesh;
            arrow.material = new Three.ShaderMaterial({
              transparent: true,
              depthWrite: false,
              // blending: Three.NormalBlending,
              uniforms: {
                uTime: this.textureUniform.iTime,
                tImage: this.textureUniform.waterTexture,
                arrowTexture: this.textureUniform.arrowTexture,
                repeat: this.repeatMap[mesh.name]
              },
              opacity: 0.6,
              vertexShader: /*glsl*/ `
                varying vec3 vPosition;
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    vec3 newPos = position + normal * -.04;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
                }
              `,
              fragmentShader: /*glsl*/ `
              uniform sampler2D arrowTexture;
              uniform float uTime;
              varying vec2 vUv;
              uniform float repeat;
    
              void main() {
                /** 使用 -uOffset 保证和 progress 动画方向一致*/
                vec2 uv = vUv.yx;
                vec2 p = fract(uv * vec2(1.0, repeat) + vec2(.0, -uTime * .1));
                vec4 color = texture2D(arrowTexture, p);
                 // 硬边缘透明处理
                if(color.a < 0.1) discard;
                gl_FragColor = color;
              }
              `
            });
            mesh.parent.add(arrow);
          }
          if (child.name.includes('房') && child.material.map) {
            // 查看纹理贴图
            // if (!first) {
            //
            //   const el = this.tdCanvas.nativeElement
            //   const {width, height} = this.el.getBoundingClientRect()
            //   el.width = width;
            //   el.height = height;
            //   const ctx = el.getContext('2d');
            //   console.log(child.material.map.source.data)
            //   ctx.drawImage(child.material.map.source.data, 0, 0, 1024, 1024)
            //   first = true;
            // }
            // child.material.wireframe = true;
            child.material.onBeforeCompile = shader => {
              shader.uniforms.uTime = this.textureUniform.iTime;
              shader.vertexShader = shader.vertexShader
                .replace(
                  '#include <common>',
                  `
                #include <common>
                uniform float uTime;
                varying vec2 vUv;
                `
                )
                .replace(
                  '#include <uv_vertex>',
                  `
                  #include <uv_vertex>
                  vUv = uv;
                `
                );
              shader.fragmentShader = shader.fragmentShader
                .replace(
                  '#include <dithering_fragment>',
                  `
                  #include <dithering_fragment>
                  // 原始贴图加滤镜
                  // gl_FragColor = gl_FragColor * vec4(.1 * vUv.x, .7 * sin(uTime), 1.0, 1.0);
                  float diff = sin(uTime * .1) - vUv.g;
                  if (diff < .05 && diff > -.05) {
                    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
                  }
                `
                )
                .replace(
                  '#include <common>',
                  `
                #include <common>
                uniform float uTime;
                varying vec2 vUv;
                `
                );
              // shader.uniforms.noiseTexture = this.textureUniform.noiseTexture;
              // shader.uniforms.iTime = this.textureUniform.iTime;
              // shader.uniforms.mainTexture = child.material.map;
              // shader.vertexShader = `
              //   varying vec2 vUv;
              //   void main() {
              //     vUv = uv;
              //     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              //   }`;
              // shader.fragmentShader = `
              //   varying vec2 vUv;
              //   uniform sampler2D noiseTexture;
              //   uniform sampler2D mainTexture;
              //   uniform float iTime;
              //   void main() {
              //     float r = texture2D(noiseTexture, vUv).r;
              //     float g = texture2D(noiseTexture, vUv).g;
              //     gl_FragColor = texture2D(mainTexture, vUv);
              //   }
              // `;
            };
            // child.material = new Three.ShaderMaterial({
            //   vertexShader: vs,
            //   fragmentShader: fs,
            //   uniforms: {
            //     progress: this.textureUniform.progress,
            //     edgeWidth: this.textureUniform.edgeWidth,
            //     edgeColor: this.textureUniform.edgeColor,
            //     noiseTexture: this.textureUniform.noiseTexture,
            //     mainTexture: { value: child.material.map }
            //   }
            // })
          }
        }
      });
      console.log(this.pipeMeshes);
      // this.tCamera.lookAt(new Three.Vector3(-31.2, 5.9, 78.3));
      // this.tControl.target.copy(this.tScene.localToWorld(mesh.position));
    });
    // let i = 0;
  }
  override renderCb: (delta: number) => void = delta => {
    this.textureUniform.iTime.value += 0.1;
    this.tEvent.fire('tick');
    this.render2d.render(this.tScene, this.tCamera);
    if (this.isComposerRender) {
      this.effectCom.render();
    }
    // if (this.pipe && this.pipe.material && (this.pipe.material as any).map) (this.pipe?.material as Three.MeshBasicMaterial).map.offset.y -= delta;
    // this.fpc?.update(delta);
  };
  /**选取管道高亮 */
  pickPipeLine() {}
  pathPipe() {
    const path = new Three.CatmullRomCurve3([new Three.Vector3(60, 60, 0), new Three.Vector3(-60, 60, 10), new Three.Vector3(-60, -60, 0), new Three.Vector3(60, -60, 10)]);
    const geo = new Three.TubeGeometry(path, 100, 2, 25, false);
    const tload = new Three.TextureLoader();
    const texture = tload.load('assets/images/texture/hole.png');
    texture.rotation = Math.PI / 2;
    texture.repeat.y = 50;
    texture.wrapT = Three.RepeatWrapping;
    const material = new Three.MeshBasicMaterial({
      map: texture,
      transparent: false
    });
    const mesh = new Three.Mesh(geo, material);
    this.pipe = mesh;
    this.tCamera.lookAt(mesh.position);
    // this.tControl.target = mesh.position;
    this.tScene.add(mesh);
  }
  /**穿越虫洞模拟 */
  crossHole() {
    // this.tControl.enabled = false;
    // 贝塞尔曲线生成管道几何
    const curvePath = new Three.CatmullRomCurve3([
      new Three.Vector3(-50, 20, 90),
      new Three.Vector3(-10, 40, 40),
      new Three.Vector3(0, 0, 0),
      new Three.Vector3(60, -60, 0),
      new Three.Vector3(90, -40, 60),
      new Three.Vector3(120, 30, 30)
    ]);
    const geo = new Three.TubeGeometry(curvePath, 100, 2, 25, false);
    const tload = new Three.TextureLoader();
    const texture = tload.load('assets/images/texture/hole.png');
    const material = new Three.MeshBasicMaterial({
      // color: 0xffff00,
      map: texture,
      transparent: false,
      side: Three.DoubleSide
      // wireframe: true
    });
    material.map.repeat.set(10, 1);
    material.map.wrapS = material.map.wrapT = Three.RepeatWrapping;
    // 管道几何 + 材质
    const mesh = new Three.Mesh(geo, material);
    this.tScene.add(mesh);
    // 曲线等距点 50
    const pathPoints = curvePath.getSpacedPoints(50);
    this.tControl.enabled = false;
    this.tEvent.on('tick', () => {
      const progress = (this.tClock.getElapsedTime() % 20) / 20;
      const curr = curvePath.getPoint(progress);
      const next = curvePath.getPoint(Math.min(progress + 0.01, 1.0));
      this.tCamera.position.copy(curr);
      this.tCamera.lookAt(next);
    });
    // 增加明亮对比度
    material.onBeforeCompile = shader => {
      shader.fragmentShader = shader.fragmentShader.replace(
        `#include <dithering_fragment>`,
        /*glsl*/ `
        #include <dithering_fragment>
        vec3 adj = clamp((gl_FragColor.rgb - 0.5) * 2.0 + 0.5, 0.0, 1.0);
        gl_FragColor.rgb = adj;
        `
      );
    };
    const tl = gsap.timeline();
    for (let i = 0; i < pathPoints.length - 1; i++) {
      tl.to(
        this.tCamera.position,
        {
          duration: 1,
          x: pathPoints[i].x,
          y: pathPoints[i].y,
          z: pathPoints[i].z,
          onUpdate: () => {
            this.tCamera.lookAt(pathPoints[i + 1]);
          }
        },
        '>'
      );
    }
  }
}
