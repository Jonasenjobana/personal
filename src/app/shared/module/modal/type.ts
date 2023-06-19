import {
  ConnectionPositionPair,
  FlexibleConnectedPositionStrategyOrigin,
  HorizontalConnectionPos,
  VerticalConnectionPos
} from '@angular/cdk/overlay';
import { ElementRef, TemplateRef, Type, ViewContainerRef } from '@angular/core';
export type CallbackType = (...param: any) => any;
export type ZqModalType = 'confirm' | 'custom';
export type ZqModalConfig<T = any> = ZqGlobalModalConfig<T> | ZqFlexibleModalConfig<T>;
export class ZqBaseModalConfig<T = any> {
  overlayStrategy?: ZqPostionStrategy = 'global';
  mask?: boolean = true;
  width?: number = 800;
  zqIndex?: number = 1000;
  offsetX?: number = 0;
  outsideClose?: boolean = false;
  offsetY?: number = 0;
  zqModalType?: ZqModalType = 'confirm';
  zqContent?: TemplateRef<any> | Type<T>;
  zqFooter?: TemplateRef<any> | Type<T>;
  zqContainerRef?: ViewContainerRef;
  zqComponentParams?: Partial<T>;
  textClose?: string;
  textOk?: string;
  zqAfterClose?: CallbackType;
  zqBeforeClose?: CallbackType;
  zqOkCb?: CallbackType;
}
export class ZqGlobalModalConfig<T> extends ZqBaseModalConfig<T> {
  horizonCenter?: boolean = true;
  verticalCenter?: boolean = true;
}
export class ZqFlexibleModalConfig<T> extends ZqBaseModalConfig<T> {
  position?: ConnectionPositionPair[] = [
    new ZqPositionPair('start', 'bottom', 'start', 'top'),
    new ZqPositionPair('start', 'top', 'start', 'bottom')
  ];
  originType: 'ele' | 'event' | 'event-el' = 'event-el';
  origin?: ElementRef | Element | Event;
}
export type ZqPostionStrategy = 'flex' | 'global';
export class ZqPositionPair implements ConnectionPositionPair {
  constructor(
    originX: HorizontalConnectionPos,
    originY: VerticalConnectionPos,
    overlayX: HorizontalConnectionPos,
    overlayY: VerticalConnectionPos
  ) {
    this.originX = originX;
    this.originY = originY;
    this.overlayX = overlayX;
    this.overlayY = overlayY;
  }
  offsetX?: number | undefined;
  offsetY?: number | undefined;
  panelClass?: string | string[] | undefined;
  originX: HorizontalConnectionPos;
  originY: VerticalConnectionPos;
  overlayX: HorizontalConnectionPos;
  overlayY: VerticalConnectionPos;
}
