import { Component } from '@angular/core';
import { ThreeBase } from '../../three.base';
import * as THREE from 'three';
import gsap from 'gsap';

@Component({
  selector: 'three-demo1',
  templateUrl: '../../three.base.html',
  styleUrls: ['../../three.base.less']
})
export class ThreeDemo1Component extends ThreeBase {
  constructor() {
    super();
  }
  override ngAfterViewInit() {
    super.ngAfterViewInit();
    this.tCamera.position.set(1000, 1000, 1000);
    this.tCamera.lookAt(0, 0, 0);
    this.drawPlane();
  }
  drawPlane() {
    let planeGeom = new THREE.PlaneGeometry(1000, 1000, 100, 100);
    let uniforms = {
      time: {
        value: 0
      }
    };
    let planeMate = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.DoubleSide,
      uniforms: uniforms,
      vertexShader: `
        uniform float time;
        varying vec2 vuv;
        void main() {
            vuv = uv;
            float y = sin(position.x / 50.0 + time) * 10.0 + sin(position.y / 50.0 + time) * 10.0;
            vec3 newPosition = vec3(position.x, position.y, y * 2.0 );
            gl_PointSize = 10.0 + y / 20.0 * 10.0;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
        }
    `,
      fragmentShader: `
        varying vec2 vuv;// 归一化坐标
        void main() {
            float r = distance(gl_PointCoord, vec2(0.5, 0.5));
            if(r < 0.5) {
                gl_FragColor = vec4(0.0,1.0,1.0,1.0);
            }
        }
    `
    });
    var planeMesh = new THREE.Points(planeGeom, planeMate);
    planeMesh.rotation.x = -Math.PI / 2;
    this.tScene.add(planeMesh);
    gsap.to(uniforms.time, {
      value: 10,
      duration: 10,
      repeat: -1,
      yoyo: false
    });
  }
  loadObj() {
    let loader = new THREE.Loader();
  }
}
