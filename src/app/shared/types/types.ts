// -----------------------------------------------
// Button
export type ZqButtonType = 'primary' | 'default' | 'dangerous' | null
export type ZqButtonShape = 'circle' | 'round' | null
export type ZqButtonSize = 'large' | 'default' | 'small'
// -----------------------------------------------
// Select
export type ZqSelectType = 'Tree' | 'Multiple' | null
export interface ZqSelectOption {
    key?: string
    label: string
    value?: string
    _checked?: boolean
    _disabled?: boolean
}
