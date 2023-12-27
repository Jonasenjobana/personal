import { PlotType } from './base';
import { LeafletCanvasLayer } from './leaflet-canvas';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class CanvasBaseService {
  layerGroup: Map<string, LeafletCanvasLayer> = new Map();
  imageMap: Map<string, {imgDOM: HTMLImageElement, info: any}> = new Map();
  constructor(private http_: HttpClient) {}
  getShipInfo(): Promise<any> {
    return this.http_.get('assets/json/test.json').toPromise();
  }
  setLayer(layerOption: LayerOption) {
    const { id, plotType } = layerOption;
  }
  layerFactory(plotType: PlotType) {
    switch (plotType) {
      case 'Track':
        // return new
        break;
      case 'Ship':
        break;
    }
  }
  getBoundsData() {}
  initImage() {
    Object.keys(ImageMap).forEach((key: string) => {
      const {size, position, src} = ImageMap[key]
      const image = new Image(size[0], size[1])
      image.src = src
      this.imageMap.set(key, {
        imgDOM: image,
        info: ImageMap[key]
      })
    })
  }
  getImage(imgKey: string) {
    return this.imageMap.get(imgKey);
  }
}
export type LayerOption = {
  id: string;
  plotType: PlotType;
};
const ImageMap: {[key in string]: {size: [number, number], src: string, position: [number, number]}} = {
  '0102': {
   size: [16, 16], src: '/src/assets/images/icon-16.png', position: [5, 7]
  },
  '0106': {
    size: [16, 16], src: '/src/assets/images/icon-16.png', position: [5, 14]
  },
  '0303': {
    size: [16, 16], src: '/src/assets/images/icon-16.png', position: [5, 13]
  },
  '0305': {
    size: [16, 16], src: '/src/assets/images/icon-16.png', position: [5, 12]
  }
}