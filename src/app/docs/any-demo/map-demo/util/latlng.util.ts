/**
 * 经纬度转 像素坐标
 * @param currentLatlng 当前经纬度 坐标
 * @param orginLatlng 原点所在经纬度 默认左上角
 * @param boundMeter  原点到边界距离多少m
 * @param boundPixel  原点到边界距离多少像素
 * @param offsetX 原点左上角pixel 偏移到某个位置
 * @param offsetY 原点左上角pixel 偏移到某个位置（比如 圆心距离左上角偏移
 * 计算 像素和经纬度之间的比例
 */
function latlngToPixel(currentLatlng: [number, number], orginLatlng: [number, number], boundMeter: number, boundPixel: number, offsetX: number = 0, offsetY: number = 0) {
    const [orglat, orglng] = orginLatlng;
    const [curlat, curlng] = currentLatlng;
    const { x: ox, z: oy } = latLngToMercator(orglat, orglng);
    const { x: cx, z: cy } = latLngToMercator(curlat, curlng);
    const scale = boundPixel / boundMeter;// 每米对应多少像素;
    const dx = cx - ox; const dy = cy - oy;
    return [scale * dx + offsetX, scale * dy + offsetY];
}
// 将经纬度转换为墨卡托投影坐标
export function latLngToMercator(latitude: number, longitude: number): {x: number, y: number, z: number} {
    const earthRadius = 6371000; // 地球半径（米）
    // 将纬度从度转换为弧度
    const latRad = latitude * Math.PI / 180;
    // 计算墨卡托坐标的X、Y值
    const x = earthRadius * longitude * Math.PI / 180;
    const z = earthRadius * Math.log(Math.tan((Math.PI / 4) + (latRad / 2)));
    return {x, y: 0, z: -z};
}