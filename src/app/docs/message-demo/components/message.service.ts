import { Injectable, Injector } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { MessageWarpComponent } from './message-warp/message-warp.component';
import { ComponentPortal } from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private container?: MessageWarpComponent;
  constructor(private overlay: Overlay, private injector: Injector) {
  }
  setCountTime(time: number = 1000) {
  }
  success(tip: string) {
    this.create().create()
  }
  create(): MessageWarpComponent {
    if (this.container) return this.container;
    const overlayRef = this.overlay.create({
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      positionStrategy: this.overlay.position().global()
    });
    const componentPortal = new ComponentPortal(MessageWarpComponent, null, this.injector);
    const componentRef = overlayRef.attach(componentPortal);
    const overlayPane = overlayRef.overlayElement;
    overlayPane.style.zIndex = '1010';
    this.container = componentRef.instance;
    return this.container;
  }
}