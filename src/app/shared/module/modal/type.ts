import { ElementRef, TemplateRef, Type, ViewContainerRef } from '@angular/core';
export type CallbackType = (...param: any) => any;
export type ZqModalType = 'confirm' | 'custom';
export class ZqModalConfig<T = any> {
  overlayStrategy?: ZqPostionStrategy = 'global';
  origin?: ElementRef;
  mask?: boolean = true;
  width?: number = 800;
  zqIndex?: number = 1000;
  zqModalType?: ZqModalType = 'confirm'
  zqContent?: TemplateRef<any> | Type<T>;
  zqFooter?: TemplateRef<any> | Type<T>;
  zqContainerRef?: ViewContainerRef;
  zqComponentParams?: Object = {}
  zqAfterClose?: CallbackType;
  zqBeforeClose?: CallbackType;
}
export type ZqPostionStrategy = 'flex' | 'global';
