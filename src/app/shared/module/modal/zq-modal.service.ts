import { FlexibleConnectedPositionStrategy, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType, TemplatePortal } from '@angular/cdk/portal';
import { Injectable, ElementRef, TemplateRef, Inject, Injector, SkipSelf, Optional } from '@angular/core';
import { ZqModalConfig, ZqPostionStrategy } from './type';
import { ZqModalConfirmComponent } from './zq-modal-confirm.component';
import { ZqBaseModalComponent } from './zq-modal.directive';
export type ContentType<T> = ComponentType<T> | TemplateRef<T> ;
// 单例
@Injectable()
export class ZqModalService {
  constructor(private overlay: Overlay, private injector: Injector, @Optional() @SkipSelf() private parentModal: ZqModalService,) {}
  open<T>(config: ZqModalConfig<T>) {
    const mergeConfig = this.mergeOption(config || {});
    const overlayRef = this.createOverlay(mergeConfig);
    const modalContainer = this.attachContainer(overlayRef, config);
    this.attachModalContent(config.zqContent as ContentType<T>, modalContainer, overlayRef, mergeConfig);
  }
  createOverlay<T>(config: ZqModalConfig<T>) {
    const { overlayStrategy, origin, mask } = this.mergeOption(config || {});
    const strategy = this.getStrategy(overlayStrategy!, origin);
    return this.overlay.create({
      positionStrategy: strategy,
      hasBackdrop: true,
      backdropClass: mask ? 'zq-modal-mask' : ''
    });
  }
  mergeOption(config: ZqModalConfig, defaultConfig: ZqModalConfig = new ZqModalConfig()) {
    return { ...defaultConfig, ...config };
  }
  getStrategy(position: ZqPostionStrategy, origin?: ElementRef<any>) {
    if (position === 'global') {
      return this.overlay.position().global();
    }
    return this.overlay.position().flexibleConnectedTo(origin!);
  }
  /** 模态框布局模板
   *  confirm 带有确认框
   *  custom 自定义模板
   */
  attachContainer(overlayRef: OverlayRef, config: ZqModalConfig) {
    const userInjector = config && config.zqContainerRef && config.zqContainerRef.injector;
    // 服务创建模态框，需要相同服务单例，因此要注入到布局模板当中
    const injector = Injector.create([
      { provide: OverlayRef, useValue: overlayRef },
      { provide: 'ModalOptions', useValue: config }
    ],  userInjector || this.injector);
    const containerComponent = config.zqModalType === 'confirm' ? ZqModalConfirmComponent : ZqModalConfirmComponent;
    // 布局模板 Portal 实例
    const containerRef = new ComponentPortal(containerComponent, config.zqContainerRef, injector);
    // 将Portal实例添加到浮层上 返回组件实例
    return overlayRef.attach(containerRef).instance;
  }
  /**
   * 将用户定义组件插入模态框中
   * @param componentOrTemplateRef 
   * @param modalContainer 
   * @param overlayRef 
   * @param config 
   */
  attachModalContent<T>(
    componentOrTemplateRef: ContentType<T>,
    modalContainer: ZqBaseModalComponent,
    overlayRef: OverlayRef,
    config: ZqModalConfig<T>
  ) {
    if (componentOrTemplateRef instanceof TemplateRef) {
      modalContainer.attachTemplatePortal(new TemplatePortal<T>(componentOrTemplateRef, null!, {
        $implict: config.zqComponentParams,
      } as any))
    } else if (componentOrTemplateRef !== null && componentOrTemplateRef !== undefined) {
      modalContainer.attachComponentPortal(new ComponentPortal<T>(componentOrTemplateRef, config.zqContainerRef,))
    }
  }

  createInjector() {
    // return Injector.create()
  }
}
