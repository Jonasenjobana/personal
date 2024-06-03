import { VxeColumnGroupBase } from "./vxe-base/vxe-column-group"
import { VxeColgroupComponent } from "./vxe-colgroup/vxe-colgroup.component"
import { VxeColumnComponent } from "./vxe-column/vxe-column.component"

export interface VxeColumnConfig {
    
}
export interface VxeRowConfig {
    /**限制行高 */
    height: number
    /**移入高亮 */
    isHover: boolean
    /**TODO 移入显示详情 上右下左*/
    toolBar: boolean
}
export interface VxePageConfig {
    pageSize: number
    pageRecord: number
    pageCount: number
    /**手动分页 */
    auto: boolean
}
export interface VxeTreeConfig {
    /**自动转树结构 */
    transform: boolean
    /**节点字段吗 默认id*/
    rowField: string
    /**父节点字段名 默认parentId*/
    parentField: string
}
export interface VxeVirtualConfig {
    /**是否开启虚拟滚动 */
    enabled: boolean
    /**虚拟滚动行高度 */
    itemHeight: number
    /**最小缓冲 */
    minBuffer: number
    /**最大缓冲 */
    maxBuffer: number
}

export type VxeColumnGroups = VxeColumnGroup[]
export type VxeColumnGroup = VxeColumnGroupBase & {
    /**树层级 */
    _level?: number;
    /**跨列 */
    _colspan?: number;
    /**叶节点 */
    _isLeaf?: boolean,
    /**列排序 */
    _sortIndex?: number
    /**隐藏 */
    _hidden?: boolean
}
export interface VxeTableConfig {
    
}
export type VxeTableModel = 'tree' | 'normal'
export interface VxeGutterConfig {
    width: number
    height: number
}
export interface VxeHeadEvent {
    type: 'checkbox' | 'radio' | 'expand' | 'sort'
    column: VxeColumnGroup
    event: any;
}
export interface VxeContentEvent {
    type: 'checkbox' | 'radio' | 'expand' | 'sort'
    column: VxeColumnGroup
    event: any;
    row: any;
}