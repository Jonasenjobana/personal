
import * as Cesium from 'cesium';
/**获取屏幕经纬度边界 */
function getViewBound(camera: Cesium.Camera) {
    const bound = camera.computeViewRectangle(Cesium.Ellipsoid.WGS84);
    if (!bound) return null;
    return {
        maxX: Cesium.Math.toDegrees(bound.east),
        minX: Cesium.Math.toDegrees(bound.west),
        maxY: Cesium.Math.toDegrees(bound.north),
        minY: Cesium.Math.toDegrees(bound.south)
    }
}
function cartesianToLatlng() {
    
}
export default {
    getViewBound, 
}