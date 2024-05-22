export interface VxeColumnConfig {
    
}
export interface VxeRowConfig {
    /**限制行高 */
    height: number
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