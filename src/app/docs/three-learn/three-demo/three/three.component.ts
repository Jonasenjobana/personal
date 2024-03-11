import { Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'three',
  templateUrl: './three.component.html',
  styleUrls: ['./three.component.less']
})
export class ThreeComponent {
  scene!: THREE.Scene;
  camera!: THREE.Camera;
  @ViewChild('threeContainer', { static: true })
  set threeContainer(value: ElementRef<HTMLDivElement>) {
    const el = value.nativeElement;
    const { width, height } = el.getBoundingClientRect();
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.set(0,0,10)
  }
  constructor() {}
  ngAfterViewInit() {}
}
