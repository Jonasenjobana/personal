// Select
export type ZqSelectType = 'Tag' | 'Default';
export interface ZqSelectOption {
  label: string | number | null
  value: any | null;
  disabled?: boolean;
  hide?: boolean;
}
export interface ZqSelectItem {
  label: string | number | null;
  value: any | null;
  disabled?: boolean;
  hide?: boolean;
  type?: string;
  key?: any;
}