/**列配置 */
export interface ZqTableItem<T> {
  title: string;
  type?: TableType;
  property?: keyof T;
  width: number;
  align?: ContentAlign;
}
export type ItemKey<T> = {
  [key in keyof T]: key;
};
/**对齐方式 */
export type ContentAlign = 'left' | 'center' | 'right';
/**表格配置 */
export interface ZqTableOption {
  rowHeight: number;
}
export type TableType = 'select' | 'input' | 'rule' | '';

export type OnChangeType = (value: any) => any;
export type OnTouchedType = () => void;
