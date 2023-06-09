// -----------------------------------------------
// Button
export type ZqButtonType = 'primary' | 'default' | 'dangerous' | null;
export type ZqButtonShape = 'circle' | 'round' | null;
export type ZqButtonSize = 'large' | 'default' | 'small';
// -----------------------------------------------
// Select
export type ZqSelectType = 'Tree' | 'Multiple' | 'Search' | null;
export type ControlMode = 'search' | 'tag' | null;
export interface ZqSelectOption {
  key?: string;
  label: string;
  value?: string;
  disabled?: boolean;
  hide?: boolean;
  checked?: boolean;
}

// 表格类型
export interface ZqTableItem<T> {
    property: keyof T
    title: string
}