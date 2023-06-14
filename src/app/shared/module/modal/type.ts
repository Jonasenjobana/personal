import { ElementRef, TemplateRef, Type } from '@angular/core';
export type CB = (...param: any) => any;
export type ZqModalType = 'confirm' | 'custom';
export interface ZqModalConfig<T> {
  overlayStrategy: ZqPostionStrategy;
  origin: ElementRef;
  mask?: boolean;
  width?: number;
  zqContent: string | TemplateRef<any> | Type<T>;
  zqAfterClose: CB;
  zqBeforeClose: CB;
}
export type ZqPostionStrategy = 'flex' | 'global';
