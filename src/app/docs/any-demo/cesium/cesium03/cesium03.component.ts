import { Component, ElementRef, ViewChild } from '@angular/core';
import { SlCesiumService } from '../sl-cesium/sl-cesium.service';
import * as Cesium from 'cesium';
import { loadShipImageSource } from '../resource';
import { SHIPS } from '../cesium02/mock';
import { number } from 'echarts';
import { mod, uniform, uniforms } from 'three/examples/jsm/nodes/Nodes';
import { Subject, fromEvent, takeUntil } from 'rxjs';
import { position } from 'html2canvas/dist/types/css/property-descriptors/position';
import { image } from 'html2canvas/dist/types/css/types/image';
import { a, b } from './ship.mock';

@Component({
  selector: 'cesium03',
  templateUrl: './cesium03.component.html',
  styleUrls: ['./cesium03.component.less'],
  providers: [SlCesiumService]
})
export class Cesium03Component {
  constructor(private slsCesium: SlCesiumService) {}
  latlng: number[] = [];
  @ViewChild('cesiumRef') cesiumRef!: ElementRef;
  data: { name: string; lat: string; lng: string; head: string; type: string }[] = [];
  ngOnInit() {
    this.getShips();
  }
  i = 0;
  ngAfterViewInit() {
    this.slsCesium.initCesium(this.cesiumRef.nativeElement);
    // this.slsCesium.mouseEvent$.subscribe(res => {
    //   const { target, bound, type } = res,
    //     { object, lng, lat, worldPosition, movePrev } = target;
    //   if (type == 'left_up') {
    //     this.slsCesium.cameraControl = true;
    //   }
    //   if (object && type == 'left_down') {
    //     this.slsCesium.cameraControl = false;
    //   }
    //   if (type == 'move' && !this.slsCesium.cameraControl) {
    //     const viewer = this.slsCesium.viewer;
    //     // this.generateShip(lat, lng);
    //   }
    //   if (type == 'move') {
    //     this.latlng = [lat, lng];
    //   }
    // });
    // this.generateShip();
    // this.shaderLearn();
    // this.loadWind();
    // this.canvasLayer();
    this.canvasMask();
  }
  get viewer() {
    return this.slsCesium.viewer;
  }
  getMtBounds(bounds) {
    const [sw, ne] = bounds,
      [slng, slat] = sw,
      [nlng, nlat] = ne;
    const wmp = new Cesium.WebMercatorProjection();
    const sdg = Cesium.Cartographic.fromDegrees(slng, slat);
    const ndg = Cesium.Cartographic.fromDegrees(nlng, nlat);
    const { x: sx, y: sy } = wmp.project(sdg);
    const { x: nx, y: ny } = wmp.project(ndg);
    return {
      west: sx,
      south: sy,
      east: nx,
      north: ny
    };
  }
  /**
   * 经纬度转画布坐标
   * @param latlng
   * @parma factor 墨卡托 像素比例
   */
  transformLatlngToLayerPoint(latlng, factor, offsetX, offsetY, height) {
    const wmp = new Cesium.WebMercatorProjection();
    const [lat, lng] = latlng;
    const dg = Cesium.Cartographic.fromDegrees(lng, lat);
    // 墨卡托坐标
    const { x, y } = wmp.project(dg);
    return {
      x: (x - offsetX) * factor,
      y: height - (y - offsetY) * factor
    };
  }
  cachedImg: { [key in string]: HTMLImageElement } = {};
  getImage(url: string): Promise<HTMLImageElement> {
    return new Promise(res => {
      if (this.cachedImg[url]) return res(this.cachedImg[url]);
      const img = new Image();
      img.src = url;
      img.onload = () => {
        this.cachedImg[url] = img;
        res(img);
      };
    });
  }
  canvasLayer() {
    const bounds = [
      [110, 33],
      [120, 37]
    ];
    const size = 1000;
    // 转化为墨卡托边界
    const { west, south, east, north } = this.getMtBounds(bounds);
    let deltaX = east - west;
    let deltaY = north - south;
    let canvasx,
      canvasy,
      factor = 1;
    if (deltaX > deltaY) {
      canvasx = size;
      canvasy = (deltaY / deltaX) * size;
      factor = size / deltaX;
    } else {
      canvasy = size;
      canvasx = (deltaX / deltaY) * size;
      factor = size / deltaY;
    }
    const canvas = document.createElement('canvas');
    canvas.width = canvasx;
    canvas.height = canvasy;
    const ctx = canvas.getContext('2d');
    const data = [
      { latlng: [34, 113], type: '1', rotate: 0 }
      // { latlng: [34.5555, 114.123124], type: '2', rotate: Math.PI * 2 * Math.random() },
      // { latlng: [34.8888, 115.3453451], type: '3', rotate: Math.PI * 2 * Math.random() },
      // { latlng: [35.3463412, 116.3252423], type: '4', rotate: Math.PI * 2 * Math.random() },
      // { latlng: [36.4124901, 117.8934534123], type: '5', rotate: Math.PI * 2 * Math.random() },
      // { latlng: [36.34235236, 118.53412353], type: '6', rotate: Math.PI * 2 * Math.random() }
    ];
    data.forEach(el => {
      const { latlng, type, rotate } = el,
        [lat, lng] = latlng;
      const { x, y } = this.transformLatlngToLayerPoint(latlng, factor, west, south, canvasy);
      this.getImage(`/assets/map/ship/${type}.png`).then(res => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotate);
        ctx.translate(-x, -y);
        ctx.drawImage(res, x - 8, y - 8, 16, 16);
        ctx.restore();
      });
    });
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, canvasx, canvasy);
    setTimeout(() => {
      const image = new Cesium.ImageMaterialProperty({
        image: canvas,
        transparent: true
      });
      this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(80, 33, 200),
        rectangle: {
          coordinates: Cesium.Rectangle.fromDegrees(bounds[0][0], bounds[0][1], bounds[1][0], bounds[1][1]),
          material: image
        }
      });
    }, 5000);
  }
  loadWind() {
    fetch('/assets/json/flow-global.json')
      .then(e => e.json())
      .then(e => {});
  }
  canvasMask() {
    const canvas = document.createElement('canvas');
    const { width, height } = this.viewer.canvas;
    canvas.width = width;
    canvas.height = height;
    canvas.className = 'sl-cesium-test';
    Object.assign(canvas.style, {
      position: 'absolute',
      left: 0,
      top: 0,
      pointerEvents: 'none',
      userSelect: 'none'
    });
    const ctx = canvas.getContext('2d');
    // 添加cesium画布
    this.viewer.canvas.parentNode.appendChild(canvas);
    let prevTime = 0;
    let time = 0;
    const data = b.map(el => {
      const [,lng, lat, rotate] = el.split(',')
      return {
        latlng: [Number(lng), Number(lat)],
        type: Math.ceil(Math.random() * 8),
        rotate: Number(rotate)
      }
    })
    const anime = (time?: number) => {
      cancelAnimationFrame(time);
      ctx.clearRect(0, 0, width, height);
      if (!prevTime) {
        prevTime = time;
      } else if (time && time - prevTime > 16) {
        prevTime = time;
        data.forEach(el => {
          const { latlng, type, rotate } = el;
          const occluder = new Cesium['EllipsoidalOccluder'](Cesium.Ellipsoid.WGS84, this.viewer.camera.position)
          const visible = occluder.isPointVisible(Cesium.Cartesian3.fromDegrees(el.latlng[1], el.latlng[0]))
          if (!visible) return;
          const p = this.projectToCanvas(latlng[0], latlng[1]);
          this.getImage(`/assets/map/ship/${type}.png`).then(res => {
            // console.log(p);
            ctx.beginPath();
            ctx.fillStyle = 'red';
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(rotate);
            ctx.translate(-p.x, -p.y);
            ctx.drawImage(res, p.x - 8, p.y - 8, 16, 16);
            ctx.restore();
            ctx.fill();
            ctx.closePath();
          });
        });
      }
      // time = requestAnimationFrame(anime);
    };
    setTimeout(() => {
    anime();
      
    }, 3000)
  }
  projectToCanvas(lat, lng) {
    const position = Cesium.Cartesian3.fromDegrees(lng, lat, 0);
    const scene = this.viewer.scene;
    const window = Cesium.SceneTransforms.worldToWindowCoordinates(scene, position);
    return {
      x: window.x,
      y: window.y
    };
  }
  shaderLearn() {
    let time = 0;
    // this.viewer.entities.add({
    //   position: Cesium.Cartesian3.fromDegrees(123, 33, 200),
    //   billboard: {
    //     image: '/assets/map/ship/1.png'
    //   },
    //   polygon: {
    //     hierarchy: new Cesium.CallbackProperty(() => {
    //       return {
    //         positions: Cesium.Cartesian3.fromDegreesArray([110.0, 37.0, 120.0, 37.0, 120.0, 33.0, 110.0, 33.0])
    //       };
    //     }, false),
    //     material: new Cesium.ImageMaterialProperty({
    //       image: '/assets/map/ship/1.png'
    //     })
    //   }
    // });
    // const {x, y} = Cesium.Cartesian3.normalize(Cesium.Cartesian3.fromDegrees(110, 33), new Cesium.Cartesian3())
    // console.log(x,y)
    // // 弧度表示经纬度
    // const ne = Cesium.Cartographic.fromDegrees(110, 33);
    // console.log(ne)
    // // 转换为墨卡托工具
    // const wmp = new Cesium.WebMercatorProjection()
    // // 弧度转墨卡托坐标
    // const pj = wmp.project(ne)
    const primitive = new Cesium.Primitive({
      geometryInstances: new Cesium.GeometryInstance({
        geometry: new Cesium.RectangleGeometry({
          // 包围整个地球
          rectangle: Cesium.Rectangle.fromDegrees(-180, -90, 180, 90)
        }),
        attributes: {},
        id: 'shipLayer'
      }),
      appearance: new Cesium.MaterialAppearance({
        material: new Cesium.Material({
          fabric: {
            type: 'Image2',
            uniforms: {
              speed: 0,
              image: `/assets/map/ship/1.png`,
              image2: `/assets/map/ship/2.png`
            },
            source: `
            czm_material czm_getMaterial(czm_materialInput materialInput) {
              czm_material material = czm_getDefaultMaterial(materialInput);
              // 获取纹理坐标
              vec2 st = materialInput.st;
              if (distance(st, vec2(0.7896569181118664, 0.28734788556634544)) < .01) {
                material.alpha = .5;
                material.diffuse = vec3(0, 1, 0);
                material.emission = vec3(1.0, 0, 0);
              } else {
                material.alpha = 0.1;
                material.diffuse = vec3(0, 1, 0);
                material.emission = vec3(0, 1.0, 0);
              }
              // vec4 colorImage = texture(image2, vec2(fract((st.t - speed * czm_frameNumber * 0.005)), st.t));
              // vec4 fragColor;
              // fragColor.rgb = colorImage.rgb;
              // fragColor = czm_gammaCorrect(fragColor); // 伽马校正

              // material.alpha = colorImage.a;
              // material.diffuse = (colorImage.rgb) / 2.0;
              // material.emission = fragColor.rgb;
              return material;
            }
            `
          }
        })
      })
    });
    this.viewer.scene.primitives.add(primitive);
  }
  createRectBound(bound: any) {
    this.slsCesium.viewer.entities.removeAll();
    this.slsCesium.viewer.entities.add({
      rectangle: {
        coordinates: Cesium.Rectangle.fromDegrees(bound.minX, bound.minY, bound.maxX, bound.maxY),
        height: 4000,
      }
    });
  }
  getShips() {
    this.data = SHIPS.map(el => {
      const [name, lng, lat, head] = el.split(',');
      return {
        name,
        lat,
        lng,
        head,
        type: Math.floor(1 + Math.random() * 8) + ''
      };
    });
  }
  ballonsModel: Cesium.Entity[] = [];
  ballons() {
    const url = '/assets/glb/CesiumBalloon.glb';
    const numberOfBalloons = 13;
    const lonIncrement = 0.00025;
    const initialLon = -122.99875;
    const lat = 44.0503706;
    const height = 100.0;
    const target = Cesium.Cartesian3.fromDegrees(initialLon + lonIncrement, lat, height + 7.5);
    const offset = new Cesium.Cartesian3(-37.048378684557974, -24.852967044804245, 4.352023653686047);
    const viewer = this.slsCesium.viewer;
    const createModel = (url, x, y, height) => {
      const position = Cesium.Cartesian3.fromDegrees(x, y, height);
      this.ballonsModel.push(
        viewer.entities.add({
          name: url,
          position: position,
          model: {
            uri: url
          }
        })
      );
    };

    for (let i = 0; i < numberOfBalloons; ++i) {
      const lon = initialLon + i * lonIncrement;
      createModel(url, lon, lat, height);
    }
    viewer.entities.add({
      position: target,
      billboard: {
        image: '/assets/map/ship/1.png'
      }
    });
    viewer.scene.camera.lookAt(target, offset);
  }
  /**自定义生成3D */
  customShip3D() {}
  shipGeometryInstances: Cesium.GeometryInstance[] = [];
  /**2d平铺 */
  async generateShip(lat: number = 23, lng: number = 123) {
    const viewer = this.slsCesium.viewer;
    /**load all source */
    const img = await loadShipImageSource('1');
    const instance = new Cesium.GeometryInstance({
      geometry: new Cesium.RectangleGeometry({
        rectangle: Cesium.Rectangle.fromDegrees(lng, lat, lng + 2, lat + 4)
      }),
      id: '139sdkklawdjs1'
    });
    const appearance = new Cesium.MaterialAppearance({
      material: new Cesium.Material({
        fabric: {
          type: 'Grid'
          // uniforms: {
          //   image: '/assets/map/ship/1.png'
          // }
        }
      })
      // fragmentShaderSource: `
      // in vec2 v_st;
      // in vec3 v_positionEC;
      // uniform sampler2D image;
      // in vec3 v_normalEC;
      // czm_material getMaterial(czm_materialInput materialInput){
      //         czm_material material = czm_getDefaultMaterial(materialInput);
      //         return material;
      // }
      // void main()  {
      //   vec3 positionToEyeEC = -v_positionEC;
      //   vec3 normalEC = normalize(v_normalEC);
      //   czm_materialInput materialInput;
      //   materialInput.normalEC = normalEC;
      //   materialInput.positionToEyeEC = positionToEyeEC;
      //   materialInput.st = v_st;
      //   vec4 color = texture(image, v_st);
      //   out_FragColor = color;
      // }
      // `,
      // vertexShaderSource: `
      // in vec3 position3DHigh;
      // in vec3 position3DLow;
      // in float batchId;
      // in vec2 st;
      // in vec3 normal;
      // out vec2 v_st;
      // out vec3 v_positionEC;
      // out vec3 v_normalEC;
      // void main() {
      //     v_st = st;
      //     vec4 p = czm_computePosition();
      //     v_positionEC = (czm_modelViewRelativeToEye * p).xyz;      // position in eye coordinates
      //     v_normalEC = czm_normal * normal;                         // normal in eye coordinates
      //     gl_Position = czm_modelViewProjectionRelativeToEye * p;
      // }
      // `
    });
    let primitive = viewer.scene.primitives.add(
      new Cesium.Primitive({
        geometryInstances: instance,
        appearance: appearance
      })
    );
  }
}
