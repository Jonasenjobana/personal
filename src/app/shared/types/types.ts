// -----------------------------------------------
// Button
export type ZqButtonType = 'primary' | 'default' | 'dangerous' | null
export type ZqButtonShape = 'circle' | 'round' | null
export type ZqButtonSize = 'large' | 'default' | 'small'
// -----------------------------------------------
// 选择器类型select
export type ZqSelectType = 'Tree' | 'Multiple' | null
export interface ZqSelectOption {
    key?: string
    title: string
    value?: string
    _hide?: boolean
    _checked?: boolean
    _disabled?: boolean
}

// 表格类型
export interface ZqTableItem<T> {
    property: keyof T
    title: string
}