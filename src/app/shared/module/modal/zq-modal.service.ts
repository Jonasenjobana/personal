import { FlexibleConnectedPositionStrategy, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { Injectable, ElementRef } from '@angular/core';
import { ZqModalConfig, ZqPostionStrategy } from './type';
// 单例
@Injectable()
export class ZqModalService {
  constructor(private overlay: Overlay) {}
  open<T>(config: ZqModalConfig<T>) {
    const overlayRef = this.createOverlay(config)
  }
  createOverlay<T>(config: ZqModalConfig<T>) {
    const { overlayStrategy, origin, mask } = config;
    const strategy = this.getStrategy(overlayStrategy, origin);
    return this.overlay.create({
      positionStrategy: strategy,
      hasBackdrop: true,
      backdropClass: mask ? 'zq-modal-mask' : ''
    });
  }
  getStrategy(position: ZqPostionStrategy, origin?: ElementRef<any>) {
    if (position === 'global') {
      return this.overlay.position().global();
    }
    return this.overlay.position().flexibleConnectedTo(origin!);
  }
}
