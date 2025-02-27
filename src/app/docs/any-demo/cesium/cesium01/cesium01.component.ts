import { Component } from '@angular/core';
import {
  Cartesian3,
  viewerCesiumInspectorMixin,
  Ion,
  Math as CesiumMath,
  Viewer,
  HeadingPitchRoll,
  Transforms,
  Model,
  Color,
  ColorBlendMode,
  Primitive,
  GeometryInstance,
  MaterialAppearance,
  UniformType,
  Cartesian2,
  CallbackProperty,
  Cartographic,
  Ellipsoid
} from 'cesium';
import { CESIUM_TOKEN } from '../config/token';
import * as dat from 'dat.gui';
import { mod } from 'three/examples/jsm/nodes/Nodes';
import { Shader01 } from '../shader/shader01';

@Component({
  selector: 'cesium01',
  templateUrl: './cesium01.component.html',
  styleUrls: ['./cesium01.component.less']
})
export class Cesium01Component {
  constructor() {
    Ion.defaultAccessToken = CESIUM_TOKEN.ACCESS_TOKEN;
    this.gui = new dat.GUI();
  }
  gui: any;
  viewer: Viewer;
  guiModel: any = {
    color: 'red',
    alpha: 1,
    colorBlendMode: 'Highlight'
  };
  uTime: any = {
    type: UniformType.FLOAT,
    value: 0.0
  };
  getColor(colorName, alpha) {
    const color = Color[colorName.toUpperCase()];
    return Color.fromAlpha(color, parseFloat(alpha));
  }
  ngAfterViewInit() {
    // Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
    this.viewer = new Viewer('cesium-container', {
      shadows: true,
      shouldAnimate: true
    });
    viewerCesiumInspectorMixin(this.viewer);
    this.createModel('/assets/gltf/cesium/Cesium_Air.glb', 1000);
    // this.createModel('/assets/gltf/cesium/bmw.glb', 0);
    // this.createModel('/assets/gltf/cesium/fighter_jet.glb', 0);
    this.initGui();
    // this.update();
    document.querySelector('#cesium-container').addEventListener('click', (e: MouseEvent) => {
      const { x, y } = e;
      const picker = this.viewer.scene.pick(new Cartesian2(x, y));
      console.log(picker);
    });
  }
  update() {
    this.uTime.value += 0.1;
    this.entitys.forEach(item => {
      item.customShader = Shader01({ u_time: this.uTime });
    });
    requestAnimationFrame(() => {
      this.update();
    });
  }
  entitys: Model[] = [];
  createModel(url, height) {
    const scene = this.viewer.scene;
    this.viewer.entities.removeAll();

    const position = Cartesian3.fromDegrees(-123.0744619, 44.0503706, height);
    const heading = CesiumMath.toRadians(135);
    const pitch = 0;
    const roll = 0;
    const hpr = new HeadingPitchRoll(heading, pitch, roll);
    const orientation = Transforms.headingPitchRollQuaternion(position, hpr);
    const modelMatrix = Transforms.headingPitchRollToFixedFrame(position, hpr);
    const entity = this.viewer.entities.add({
      name: url,
      position: position,
      orientation: orientation,
      model: {
        uri: url,
        customShader: new CallbackProperty(this.updateShader.bind(this), false)
      }
    });
    this.entitys.push(entity.model as any);
    this.viewer.trackedEntity = entity;
  }
  updateShader(time, result) {
    this.uTime.value += 0.1;
    return Shader01({ u_time: this.uTime });
  }
  initGui() {
    this.gui.add(this.guiModel, 'color', ['red', 'green', 'blue']).onChange(color => {
      const a = this.getColor(color, this.guiModel.alpha);
      this.entitys.forEach(item => {
        item.color = a;
      });
    });
    this.gui.add(this.guiModel, 'alpha', 0, 1, 0.05).onChange(alpha => {
      const a = this.getColor(this.guiModel.color, alpha);
      this.entitys.forEach(item => {
        item.color = a;
      });
    });
    this.gui.add(this.guiModel, 'colorBlendMode', ['Highlight', 'Replace', 'Mix']).onChange(mode => {
      const blendmode: any = ColorBlendMode[mode.toUpperCase()];
      this.entitys.forEach(item => {
        item.colorBlendMode = blendmode;
      });
    });
  }
}
