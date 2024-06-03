import { VxeColumnGroupBase } from "./vxe-base/vxe-column-group"

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
    /**自动转树结构 默认true*/
    transform: boolean
    /**节点字段吗 默认id*/
    rowField: string
    /**如果不需要自动转树结构本身就是树结构  默认children*/
    childrenField: string
    /**父节点字段名 默认parentId*/
    parentField: string
    /**连接线 */
    showLine: boolean
    /**默认展开所有子孙节点 */
    expandAll: boolean
    /**默认展开指定树节点 */
    expandRowKeys: string[]
    /**树形序号 层级关系 1.1.1 ... 默认 按索引顺序*/
    treeSeq: boolean
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
export type VxeData = {
    _parent?: VxeData | null
    _children?: VxeData[],
    _expanded?: boolean,
    _index?: number
    _treeIndex?: number
    _hidden?: boolean
    _check?: boolean
    _level?: number
} & {[key in string]: any}
// 自定义样式
export type VxeRowStyle = (param: {row: any, col: VxeColumnGroup, rowIndex: number, columnIndex: number}) => Object
export type VxeCellStyle = (param: {row: any, col: VxeColumnGroup, rowIndex: number, columnIndex: number}) => Object
export interface MergeCell {
    
}