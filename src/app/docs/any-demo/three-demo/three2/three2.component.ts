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
import fs from './shader/water/fs';
import fs2 from './shader/water/fs2';
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
    this.tCamera.position.set(-78, 72, -20);
    // this.tControl.target.set(-78, 72, -20);
    this.tScene.add(new Three.DirectionalLight(0xffffff, 4));
    const ambiLight = new Three.AmbientLight(0xffffff, 2);
    this.tScene.add(ambiLight);
    this.initScene();
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
    arrowTexture: { value: new Three.TextureLoader().load('/assets/images/direction-arrow.png') }
  };
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
  raySelect() {
    const { width, height } = this.el.getBoundingClientRect();
    this.el.addEventListener('click', e => {
      // 初始化
      const cameraMover = new CameraAutoMover(this.tCamera, this.tControl);
      const { offsetX, offsetY } = e;
      const x = (offsetX / width) * 2 - 1;
      const y = -(offsetY / height) * 2 + 1;
      const pos = this.tCamera.position;
      const raycaster = new Three.Raycaster();
      raycaster.setFromCamera(new Three.Vector2(x, y), this.tCamera);
      const cross = raycaster.intersectObjects(this.pipeMeshes);
      if (cross?.length > 0) {
        cameraMover.moveToObject(cross[0].object);
        const mesh: Three.Mesh = cross[0].object as Three.Mesh;
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
        const box = new Three.Box3().setFromObject(mesh);
        const size = new Three.Vector3();
        box.getSize(size);
        const material = (mesh.material as Three.MeshStandardMaterial).clone();
        // material.wireframe = true;
        mesh.material = material;
        material.map = this.textureUniform.arrowTexture.value;
        material.map.wrapS = material.map.wrapT = Three.RepeatWrapping;
        material.map.rotation = Math.PI / 2;
        console.log(size)
        // 设置重复参数
        material.map.repeat.set(10, 1);
        gsap.to(material.map.offset, {
          ease: 'none',
          y: -10,
          duration: 5,
          repeat: -1
        });
        mesh.material.onBeforeCompile = shader => {
          shader.uniforms['uTime'] = this.textureUniform.iTime;
          shader.uniforms['iResolution'] = { value: new Three.Vector2(width, height) };
          shader.fragmentShader = shader.fragmentShader
            .replace(
              '#include <common>',
              `
            #include <common>
            uniform vec2 iResolution;
            uniform float uTime;
            ${fs}
            `
            )
            .replace(
              '#include <dithering_fragment>',
              `
            #include <dithering_fragment>
            // gl_FragColor = water(gl_FragCoord.xy/iResolution.xy);
            // gl_FragColor = texture2D(arrowTexture, gl_FragCoord.xy/iResolution.xy);
            `
            );
          console.log(shader, 'shaderpiep');
        };
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
