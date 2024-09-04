import { Component } from '@angular/core';
import { ThreeBase } from '../three.base';
import * as Three from 'three';
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
  }
  material: Three.ShaderMaterial;
  /**创建着色器平面 */
  createShaderPlane() {
    const plane = new Three.PlaneGeometry(3, 3);
    const material = (this.material = new Three.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 }
      },
      vertexShader: `
        varying vec3 vPosition;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
          vPosition = position;
        }
      `,
      fragmentShader: ` 
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform float uTime;
        void main() {
          vec3 color1 = vec3(230.0 / 255.0, 252.0 / 255.0, 225.0 / 255.0);
          vec3 color2 = vec3(23.0 / 255.0, 135.0 / 255.0, 247.0 / 255.0);
          gl_FragColor = vec4(mix(color1, color2, ((vUv.x + vUv.y)/2.0 - 0.5) * sin(uTime)), 1.0);
        }
      `
    }));
    const planeMesh = new Three.Mesh(plane, material);
    this.tScene.add(planeMesh);
  }
  scanShader() {
    return new Three.ShaderMaterial({
      uniforms: {
        uTime: {
          value: 0
        }
      },
      vertexShader: `
        varying vec3 vPosition;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
          vPosition = position;
        }
      `,
      fragmentShader: ` 
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform float uTime;
        void main() {
          
          gl_FragColor = vec4(sin(vUv.x + uTime),sin(vUv.x + vUv.y),sin(vUv.x + vUv.y), vUv.y/1.0);
        }
      `,
      side: Three.DoubleSide
    });
  }
  override renderCb: () => void = () => {
    if (this.material) this.material.uniforms['uTime'].value += 0.05;
  };
}
