import { Component } from '@angular/core';
import { ThreeBase } from '../three.base';
import * as Three from 'three';
import { cnoise } from '../glsl/glsl.util';
/**uv着色器练习 */
@Component({
  selector: 'three-day7-2',
  templateUrl: '../three.base.html',
  styleUrls: ['../three.base.less']
})
export class ThreeDay72Component extends ThreeBase {
  constructor() {
    super();
  }
  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.tCamera.position.set(0, 10, 10);
    this.tCamera.lookAt(0, 0, 0);
    this.tScene.add(new Three.AxesHelper(100));
    const light = new Three.AmbientLight(0xffffff);
    this.tScene.add(light);
    this.createShaderPlane();
    this.genPoints();
  }
  material: Three.ShaderMaterial;
  /**创建着色器平面 */
  createShaderPlane() {
    const plane = new Three.SphereGeometry(1, 36);
    const material = (this.material = new Three.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 }
      },
      vertexShader: `
        attribute float aSize;
        attribute vec4 aShift;
        uniform float uTime;
        varying vec3 vColor;
        const float PI = 3.1415925;

        void main() {
          vec3 color1 = vec3(227., 155., 0.);
          vec3 color2 = vec3(100., 50., 255.);

          float d = length(abs(position) / vec3(40., 10., 40.));
          d = clamp(d, 0., 1.);
          vColor = mix(color1, color2, d) / 255.;

          vec3 transformed = position;
          float theta = mod(aShift.x + aShift.z * uTime, PI * 2.); // 根据初始角度变化
          float phi = mod(aShift.y + aShift.z * uTime, PI * 2.);
          transformed += vec3(sin(phi) * cos(theta), cos(phi), sin(phi) * sin(theta)); // 随机位移

          // vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
          gl_PointSize = aSize * 50.0 / -mvPosition.z;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: ` 
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform float uTime;
        varying float vNoise;
        varying vec3 vNormal;
        void main() {
          float len = length(distance(gl_PointCoord, vec2(0.5)));
          float mask = step(length(gl_PointCoord - 0.5), 0.5);
          if(len > 0.5) discard;
          gl_FragColor = vec4(vec3(mask), 1.0);
        }
      `,
      wireframe: true
    }));
    const planeMesh = new Three.Points(plane, material);
    // this.tScene.add(planeMesh);
  }
  genPoints() {
    const geometry = new Three.BufferGeometry();
    const sizes = [];
    const shifts = [];
    const radius = 20;
    const diff = 0.4; // 最大粒子变化范围
    const positions = [];
    for (let i = 0; i < 5000; i++) {
      const theta = Math.random() * Math.PI * 2; // 随机夹角
      const phi = Math.acos(Math.random() * 2 - 1); // 随机夹角
      const r = radius + Math.random() * diff * Math.random() > 0.5 ? -1 : 1; // 随机所在半径
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.cos(phi);
      const z = r * Math.sin(phi) * Math.sin(theta);
      let angle = (Math.random() * 0.9 + 0.1) * Math.PI * 0.1;
      let strength = Math.random() * 0.9 + 0.1; // 0.1-1
      shifts.push(theta, phi, angle, strength);
      positions.push(x, y, z);
      let size = Math.random() * 1.5 + 0.5;
      sizes.push(size);
    }
    // 生成球体表面粒子
    geometry.setAttribute('position', new Three.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('aShift', new Three.Float32BufferAttribute(shifts, 4));
    const points = new Three.Points(geometry, this.material);
    this.tScene.add(points);
  }
  override renderCb: () => void = () => {
    if (this.material) this.material.uniforms['uTime'].value += 0.05;
  };

}
