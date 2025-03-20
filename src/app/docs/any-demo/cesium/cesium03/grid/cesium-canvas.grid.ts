import * as Cesium from 'cesium';
export class a extends Cesium.TileCoordinatesImageryProvider {}
export class CesiumCanvasGrid extends Cesium.GridImageryProvider {
  cachedImg: { [key in string]: HTMLImageElement } = {};
  constructor(options: Cesium.GridImageryProvider.ConstructorOptions) {
    super(options);
  }
  override requestImage(x: number, y: number, level: number, request?: Cesium.Request): Promise<HTMLCanvasElement> {
    // console.log(x, y, level, 'request', this.tilingScheme.tileXYToNativeRectangle(x, y, level));
    const {width, height} = this.tilingScheme.tileXYToNativeRectangle(x, y, level);
    const canvasEl = document.createElement('canvas');
    canvasEl.width = width, canvasEl.height = 256;
    const ctx = canvasEl.getContext('2d');
    new Array(20).fill(0).map(ship => {
      return { latlng: [Math.random() * 256, Math.random() * 256], type: Math.random() > 0.5 ? '1' : '2', rotate: Math.random() * 2 * Math.PI };
    }).forEach(el => {
        const { latlng, type, rotate } = el;
        const [x1, y1] = latlng;
        this.getImage(`/assets/map/ship/${type}.png`).then(res => {
          ctx.save();
          ctx.translate(x1, y1);
          ctx.rotate(rotate);
          ctx.translate(-x1, -y1);
          ctx.drawImage(res, x1 - 8, y1 - 8, 16, 16);
          ctx.restore();
        });
      });
    return Promise.resolve(canvasEl);
  }
  override pickFeatures(x: number, y: number, level: number, longitude: number, latitude: number): undefined {
    console.log(x, y, level, radainToDegree(longitude), radainToDegree(latitude), 'pick');
    super.pickFeatures(x, y, level, longitude, latitude);
  }
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
}
function radainToDegree(radian: number): number {
  return (radian * 180) / Math.PI;
}
// 经纬度转瓦片编号
function lon2tile(lon, zoom) {
  return Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));
}
function lat2tile(lat, zoom) {
  return Math.floor(((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2) * Math.pow(2, zoom));
}

// 瓦片编号转经纬度
function tile2long(x, z) {
  return (x / Math.pow(2, z)) * 360 - 180;
}
function tile2lat(y, z) {
  var n = Math.PI - (2 * Math.PI * y) / Math.pow(2, z);
  return (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
}
