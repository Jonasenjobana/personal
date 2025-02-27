import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from 'three';
import { TScene } from "./tScene";
export class TCamera {
    camera: THREE.Camera
    fpCtr: FirstPersonControls 
    orbitCtr: OrbitControls
    constructor(config: TCameraConfig) {
        const {el} = config;
        const {width, height} = el.getBoundingClientRect();
        this.camera = new THREE.PerspectiveCamera(50, width / height, .0001, 5000);
        this.fpCtr = new FirstPersonControls(this.camera, el);
        this.orbitCtr = new OrbitControls(this.camera, el);
    }
    changeMode(mode: 'orbit' | 'fp' | 'none') {

    }
}
export interface TCameraConfig {
    el: HTMLElement
    tScene: TScene
}