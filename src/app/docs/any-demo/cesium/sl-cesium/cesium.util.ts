
import * as Cesium from 'cesium';
/**获取屏幕经纬度边界 */
function getViewBound(viewer: Cesium.Viewer) {
    const bound = viewer.camera.computeViewRectangle(Cesium.Ellipsoid.WGS84);
    if (!bound) {
        return null
    }
    return {
        maxX: Cesium.Math.toDegrees(bound.east),
        minX: Cesium.Math.toDegrees(bound.west),
        maxY: Cesium.Math.toDegrees(bound.north),
        minY: Cesium.Math.toDegrees(bound.south)
    }
}
function getCameraMapLevel(viewer: Cesium.Viewer) {
      // 获取地图层级
  return viewer.scene.globe['_surface']._tilesToRender[0].level;
}
/**
 * 获取 zoom、level 的几种方法
 * @source https://zhuanlan.zhihu.com/p/401514896
 */
function getZoomLevel(viewer: Cesium.Viewer) {
    let h = viewer.camera.positionCartographic.height
    if (h <= 100) {return 19 }
     else if (h <= 300) {return 18 }
     else if (h <= 660) {return 17 }
     else if (h <= 1300) {return 16 }
     else if (h <= 2600) {return 15 }
     else if (h <= 6400) {return 14 }
     else if (h <= 13200) {return 13 }
     else if (h <= 26000) {return 12 }
     else if (h <= 67985) {return 11 }
     else if (h <= 139780) {return 10 }
     else if (h <= 250600) {return 9 }
     else if (h <= 380000) {return 8 }
     else if (h <= 640000) {return 7 }
     else if (h <= 1280000) {return 6 }
     else if (h <= 2600000) {return 5 }
     else if (h <= 6100000) {return 4 }
     else if (h <= 11900000) {return 3 }
     else {return 2 }
}

// https://blog.csdn.net/Tmraz/article/details/113501692
const getzoom = (viewer: Cesium.Viewer) => {
    var tilesToRender = viewer.scene.globe['_surface']._tilesToRender
    var level
    if (tilesToRender.length != 0) {
        level = tilesToRender[0].level
    }
    return level
}

// https://blog.csdn.net/qq_48203828/article/details/116999619
function heightToZoom(viewer: Cesium.Viewer) {
    const height = Math.ceil(viewer.camera.positionCartographic.height)
    const A = 40487.57
    const B = 0.00007096758
    const C = 91610.74
    const D = -40467.74
    return Math.round(D + (A - D) / (1 + Math.pow(height / C, B)))
}
export default {
    getViewBound, 
    getCameraMapLevel,
    getZoomLevel,
    getzoom,
    heightToZoom
}