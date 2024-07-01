// canvas mapper 基础配置
export interface CanvasMapperConfig {
    /**默认缩放等级 默认 1 原始比例 */
    scale?: number;
    /**默认 20*/
    maxScale?: number;
    /**默认 0.2 */
    minScale?: number;
    /**缩放变化量 默认 0.2*/
    scaleDelta?: number;
    /**允许缩放 默认 true */
    boxScale?: boolean;
    /**允许拖动 默认 true */
    dragging?: boolean;
    /**像素比例 */
    pixelRatio?: number;
    /**设置边界 不允许再拖动 */
    // 默认不填则认为坐标和像素是一比一关系
    /**坐标A 计算方式 映射成坐标B 根据坐标B的位置和给定的比例映射到最终的画布像素位置*/
    mapping?: (x: number, y: number) => [number, number];
    /**基点坐标 可自定义参考系 比如经纬度*/
    baseXY?: [number, number];
    /**基点 与 canvas默认原点 像素偏移 */
    baseOffset?: [number, number];
    /**基点参考系下 对应像素 比例 */
    baseProportionPixel?: [number, number];
  }
  interface CanvasMapperLayerConfig {
    zIndex?: number;
    hidden?: boolean;
  }
  export interface CanvasAnimeState {
    id: string
    /**动画进度 */
    progress: number;
    /**动画阶段 */
    stage?: number
  }
  export type CanvasMapperEvent = 'click' | 'moveend' | 'zoom' | 'render'