export interface GridConfig {
  // 行划分
  row: number;
  // 列划分
  col: number;
}
export interface GridComponentInfo {
  // 区域编号
  gridAreaNumber: string[];
  // 大屏组件名
  componentName: string[]; // 根据权限 无权限优先级改变 替代方案
}
/**
 * 后台存大屏组件信息
 */
export interface GridComponent {
  componentName: string;
  authCode: string;
  title: string;
  // 根据角色划分 显示不同大屏
  roleId?: string;
}
// 默认6行6列划分 grid
export const GridConfigData: GridConfig = {
    row: 12,
    col: 12
    
}