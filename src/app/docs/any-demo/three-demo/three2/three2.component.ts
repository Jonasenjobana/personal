import { Component } from '@angular/core';
import * as dat from 'dat.gui';
import * as Three from 'three';
import gsap from 'gsap';
import { ThreeBase } from '../three.base';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import vs from './shader/disappear/vs.glsl';
import fs from './shader/disappear/fs.glsl';
import { TEvent } from './util/tEvent';
@Component({
  selector: 'Three2',
  templateUrl: '../Three.base.html',
  styleUrls: ['../Three.base.less']
})
export class Three2Component extends ThreeBase {
  raycaster = new Three.Raycaster();
  control: any;
  pointer: Three.Vector2 = new Three.Vector2();
  fpc: FirstPersonControls;
  hover: Three.Object3D;
  tEvent: TEvent = new TEvent();
  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.tCamera.position.set(-183, 160, -233);
    // this.tCamera.lookAt(new Three.Vector3(-180, 2.5, -249));
    this.tScene.add(new Three.DirectionalLight(0xffffff, 2));
    const ambiLight = new Three.AmbientLight(0xffffff, 0.5);
    this.tScene.add(ambiLight);
    // this.initScene();
    this.control = new dat.GUI();
    // this.tControl.target.set(-180, 2.5, -249);
    this.control.add(this.textureUniform.progress, 'value').min(0).max(1).step(0.01);
    this.control.add(this.textureUniform.edgeWidth, 'value').min(0).max(1).step(0.01);
    // this.el.addEventListener('mousemove', e => {
    //   const { clientX, clientY } = e;
    //   // 归一化
    //   this.pointer.x = (clientX / window.innerWidth) * 2 - 1;
    //   this.pointer.y = -(clientY / window.innerHeight) * 2 + 1;
    // });
    // this.el.addEventListener('click', e => {
    //   console.log(this.tCamera.position, 'get camera position');
    //   this.raycaster.setFromCamera(this.pointer, this.tCamera);
    //   const intersects = this.raycaster.intersectObjects(this.pipeMeshes);
    //   if (this.hover !== intersects[0].object) {
    //     (intersects[0].object as any).material = (intersects[0].object as any).material.clone();
    //     (intersects[0].object as any).material.color.set(0xffff00);
    //     (this.hover as any)?.material.color.set(0xffffff);
    //     this.hover = intersects[0].object;
    //     // gsap.to(this.hover.rotation, {
    //     //   x: this.tClock.getElapsedTime(),
    //     //   duration: 10
    //     // })
    //   }
    //   console.log(intersects, 'intersects');
    // });
    // this.fpc = new FirstPersonControls(this.tCamera, this.el);
    // this.fpc.lookSpeed = 0.4; //鼠标移动查看的速度
    // this.fpc.movementSpeed = 20; //相机移动速度
    // console.log(this.fpc, 'fpc');
    // this.fpc.noFly = true;
    // this.fpc.lookVertical = true;
    // this.fpc.lookSpeed = 0.125;
    // this.fpc.movementSpeed = 100;
    // this.fpc.constrainVertical = true; //约束垂直
    // this.fpc.verticalMin = 1.0;
    // this.fpc.verticalMax = 2.0;
    // this.fpc.lon = -150; //进入初始视角x轴的角度
    // this.fpc.lat = 120; //初始视角进入后y轴的角度
    // this.control.add(this.tCamera.position, 'x').min(-100).max(100).step(0.01);
    // this.control.add(this.tCamera.position, 'y').min(-100).max(100).step(0.01);
    // this.control.add(this.tCamera.position, 'z').min(-100).max(100).step(0.01);
    // this.pathPipe();
    this.crossHole()
  }
  groupMeshes: Three.Group = new Three.Group();
  pipeMeshes: Three.Mesh[] = [];
  pipe: Three.Mesh;
  houseMaterial;
  textureUniform = {
    progress: { value: 0 },
    edgeWidth: { value: 0.1 },
    edgeColor: { value: new Three.Color(0xff77ee) },
    iTime: {value: 0},
    noiseTexture: { value: new Three.TextureLoader().load('/assets/images/texture/noise.png') }
  };
  initScene() {
    const loader = new GLTFLoader();
    const draco = new DRACOLoader();
    draco.setDecoderPath('/assets/js/draco/');
    loader.setDRACOLoader(draco);
    loader.loadAsync('/assets/gltf/bnsw/house.glb').then(gltf => {
      const model = SkeletonUtils.clone(gltf.scene);
      this.tScene.add(model);
      console.log(model);
      model.traverse(child => {
        if (child instanceof Three.Mesh) {
          if (child.name.includes('管道')) {
            // this.groupMeshes.add(child);
            this.pipeMeshes.push(child);
          }
          if (child.name.includes('房') && child.material.map) {
            // 改变材质
            // child.material.wireframe = true;
            child.material.onBeforeCompile = shader => {
              console.log(shader)
              shader.uniforms.uTime = this.textureUniform.iTime
              shader.vertexShader = shader.vertexShader.replace(
                '#include <common>',
                `
                #include <common>
                uniform float uTime;
                varying vec2 vUv;
                `
              ).replace('#include <uv_vertex>',
                `
                #include <uv_vertex>
                vUv = uv;
                `
              )
              shader.fragmentShader = shader.fragmentShader.replace('#include <dithering_fragment>', `
                  #include <dithering_fragment>
                  // 原始贴图加滤镜
                  gl_FragColor = gl_FragColor * vec4(.1 * vUv.x, .7 * sin(uTime), 1.0, 1.0);
                `).replace('#include <common>',
                `
                #include <common>
                uniform float uTime;
                varying vec2 vUv;
                `)
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
    this.textureUniform.iTime.value += .1;
    this.tEvent.fire('tick');
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
    texture.repeat.set(10, 1);
    texture.wrapS = texture.wrapT = Three.RepeatWrapping;
    const material = new Three.MeshBasicMaterial({
      // color: 0xffff00,
      map: texture,
      transparent: false,
      side: Three.DoubleSide,
      // wireframe: true
    });
    // 管道几何 + 材质
    const mesh = new Three.Mesh(geo, material);
    this.tScene.add(mesh);
    // 曲线等距点 100个
    const pathPoints = curvePath.getSpacedPoints(50);
    this.tEvent.on('tick', () => {
      
    });
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
