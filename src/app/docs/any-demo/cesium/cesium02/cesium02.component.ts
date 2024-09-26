import { Component, ElementRef, ViewChild } from '@angular/core';
import { SlCesiumService } from '../sl-cesium/sl-cesium.service';
import { CESIUM_ACCESS_TOKEN } from 'src/app/config/inject';
import { SHIPS } from './mock';
import * as Cesium from 'cesium';
import { head } from 'lodash';
import { uniforms } from 'three/examples/jsm/nodes/Nodes';
import { image } from 'html2canvas/dist/types/css/types/image';

@Component({
  selector: 'cesium02',
  templateUrl: './cesium02.component.html',
  styleUrls: ['./cesium02.component.less'],
  providers: [SlCesiumService]
})
export class Cesium02Component {
  constructor(private slsCesium: SlCesiumService) {}
  @ViewChild('cesiumRef') cesiumRef!: ElementRef;
  @ViewChild('mapRef') mapRef!: ElementRef;
  data: { name: string; lat: string; lng: string; head: string }[] = [];
  getShips() {
    this.data = SHIPS.map(el => {
      const [name, lng, lat, head] = el.split(',');
      return {
        name,
        lat,
        lng,
        head
      };
    });
  }
  ngAfterViewInit() {
    this.getShips();
    this.slsCesium.initCesium(this.cesiumRef.nativeElement);
    this.slsCesium.zoom$.subscribe(res => {
      const {bound} = res
      // this.shipLayer.rectangle.material = new Cesium.ImageMaterialProperty({
      //   image: this.getCanvasTexture(),
      //   transparent: true
      // })
    });
    this.generateShip();
  }
  generate2D() {
    const entitys = [];
    this.data.slice(0, 10).forEach(el => {
      const position = Cesium.Cartesian3.fromDegrees(Number(el.lng), Number(el.lat), 500);
      const entity = this.slsCesium.viewer.entities.add({
        name: el.name,
        position: position,
        orientation: Cesium.Transforms.headingPitchRollQuaternion(position, new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(Number(el.head)), 0, 0)),
        billboard: {
          image: '/assets/map/ship/1.png',
          height: 28,
          width: 28,
          verticalOrigin: Cesium.VerticalOrigin.CENTER
        }
      });
      entitys.push(entity);
    });
    this.slsCesium.viewer.trackedEntity = entitys[0];
    this.getCanvasTexture();
    console.log(entitys[0]);
  }
  shipCollects: Cesium.PrimitiveCollection
  shipLayer: Cesium.Entity
  generateShip() {
    this.shipLayer = this.slsCesium.viewer.entities.add({
      name: 'ship-layer',
      rectangle: {
        coordinates: Cesium.Rectangle.fromDegrees(-180, -90, 180, 90),
        material: new Cesium.ImageMaterialProperty({
          image: this.getCanvasTexture(),
          transparent: true
        })
      }
    })
    this.slsCesium.viewer.trackedEntity = this.shipLayer;
  }
  getCanvasTexture(bound?: any) {
    const canvas = this.mapRef.nativeElement as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const {width, height} = this.slsCesium.containerSize;
    // ctx.clearRect(0,0, width, height);
    canvas.width = width;
    canvas.height = height;
    const scaleX = width / 360;
    const scaleY = height / 180; 
    ctx.fillStyle = '#ef0203'
    // ctx.fillRect(0, 0, width, height);
    ctx.lineWidth = 10
    ctx.strokeStyle = '#0c0c0c';
    ctx.strokeRect(0, 0, width, height);
    this.data.forEach(el => {
      const {lat, lng, head} = el
      ctx.arc((Number(lng) + 180) * scaleX, (Number(lat) + 30) * scaleY, 5, 0, Math.PI * 2);
      ctx.fill();
    })
    return canvas.toDataURL('image/png');
  }
  generate3D() {
    const entitys = [];
    this.data.slice(0, 10).forEach(el => {
      console.log(el);
      const position = Cesium.Cartesian3.fromDegrees(Number(el.lng), Number(el.lat), 500);
      const entity = this.slsCesium.viewer.entities.add({
        name: '/assets/gltf/cesium/Cesium_Air.glb',
        position: position,
        orientation: Cesium.Transforms.headingPitchRollQuaternion(position, new Cesium.HeadingPitchRoll(Cesium.Math.toRadians(Number(el.head)), 0, 0)),
        model: {
          uri: '/assets/gltf/cesium/Cesium_Air.glb',
          minimumPixelSize: 50
        }
      });
      entitys.push(entity);
    });
    this.slsCesium.viewer.trackedEntity = entitys[0];
  }
}
