import { ZqModalRef } from './modal-ref';
import {
  FlexibleConnectedPositionStrategy,
  FlexibleConnectedPositionStrategyOrigin,
  GlobalPositionStrategy,
  Overlay,
  OverlayRef,
  PositionStrategy
} from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType, TemplatePortal } from '@angular/cdk/portal';
import { Injectable, ElementRef, TemplateRef, Inject, Injector, SkipSelf, Optional } from '@angular/core';
import { ZqFlexibleModalConfig, ZqModalConfig, ZqPostionStrategy, ZqGlobalModalConfig, ZqBaseModalConfig } from './type';
import { ZqModalConfirmComponent } from './zq-modal-confirm.component';
import { ZqBaseModalComponent } from './zq-modal.directive';
export type ContentType<T> = ComponentType<T> | TemplateRef<T>;
// 单例
@Injectable()
export class ZqModalService {
  constructor(
    private overlay: Overlay,
    private injector: Injector,
    @Optional() @SkipSelf() private parentModal: ZqModalService
  ) {
    console.log(injector, parentModal,'===========================')
  }
  open<T>(config: ZqModalConfig<T>) {
    const mergeConfig = this.mergeOption(config || {});
    const overlayRef = this.createOverlay(mergeConfig);
    const modalContainer = this.attachContainer(overlayRef, config);
    const modalRef = this.attachModalContent(
      config.zqContent as ContentType<T>,
      modalContainer,
      overlayRef,
      mergeConfig
    );
    return modalRef;
  }
  createOverlay<T>(config: ZqModalConfig<T>) {
    const { overlayStrategy, mask = true } = config;
    const strategy = this.getStrategy(overlayStrategy!, config);
    this.setPosition(strategy, config);
    return this.overlay.create({
      positionStrategy: strategy,
      hasBackdrop: true,
      backdropClass: mask ? 'zq-mask' : ''
    });
  }
  mergeOption<T>(config: ZqModalConfig<T>): ZqModalConfig<T> {
    let defaultConfig: ZqModalConfig<T>;
    if (config instanceof ZqGlobalModalConfig) {
      defaultConfig = new ZqGlobalModalConfig();
      return { ...defaultConfig, ...config } as ZqGlobalModalConfig<T>;
    }
    defaultConfig = new ZqFlexibleModalConfig();
    return { ...defaultConfig, ...config } as ZqFlexibleModalConfig<T>;
  }
  getStrategy<T>(position: ZqPostionStrategy, config: ZqModalConfig<T>) {
    if (position === 'global') {
      return this.overlay.position().global();
    }
    return this.overlay.position().flexibleConnectedTo(this.setOrigin(config as ZqFlexibleModalConfig<T>));
  }
  setOrigin<T>(config: ZqFlexibleModalConfig<T>) {
    const { originType, origin } = config;
    if (originType === 'ele') {
      return origin as HTMLElement;
    } else if (originType === 'event-el') {
      let event = origin as Event;
      return event.currentTarget as HTMLElement;
    } else {
      let event = origin as MouseEvent;
      return {
        x: event.x,
        y: event.y
      };
    }
  }
  /**
   * 设置浮层创建位置
   * @param strategy 
   * @param config 
   */
  setPosition<T>(strategy: PositionStrategy, config: ZqModalConfig<T>) {
    const { offsetX = undefined, offsetY = 100 } = config;
    if (strategy instanceof GlobalPositionStrategy) {
      const { horizonCenter = true, verticalCenter = false } = config as ZqGlobalModalConfig<T>;
      verticalCenter && strategy.centerVertically();
      horizonCenter && strategy.centerHorizontally();
      offsetX && strategy.left(offsetX + 'px');
      strategy.top(offsetY + 'px');
    } else if (strategy instanceof FlexibleConnectedPositionStrategy) {
      const { position = [] } = config as ZqFlexibleModalConfig<T>;
      // 设置连接点优先级 左下|左上 左上|左下
      strategy.withPositions(position);
      strategy.withDefaultOffsetX(offsetX || 0);
      strategy.withDefaultOffsetY(offsetY || 0);
    }
  }
  /**
   *  模态框布局模板
   *  confirm 带有确认框
   *  custom 自定义模板
   *
   * @param overlayRef
   * @param config
   * @returns
   */
  attachContainer<T>(overlayRef: OverlayRef, config: ZqModalConfig<T>) {
    const userInjector = config && config.zqContainerRef && config.zqContainerRef.injector;
    // 服务创建模态框，需要相同服务单例，因此要注入到布局模板当中
    const injector = Injector.create(
      {
        providers: [
          { provide: OverlayRef, useValue: overlayRef },
          { provide: ZqBaseModalConfig, useValue: config },
        ],
        parent: userInjector || this.injector
      }
    );
    console.log(injector, 'injector',userInjector,'userInjector');
    
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
    const modalRef = new ZqModalRef(overlayRef, modalContainer, config);
    if (componentOrTemplateRef instanceof TemplateRef) {
      modalContainer.attachTemplatePortal(
        new TemplatePortal<T>(componentOrTemplateRef, null!, {
          $implicit: config.zqComponentParams,
          modalRef: modalRef
        } as any)
      );
    } else if (componentOrTemplateRef !== null && componentOrTemplateRef !== undefined) {
      const componentRef = modalContainer.attachComponentPortal(new ComponentPortal<T>(componentOrTemplateRef, config.zqContainerRef));
      componentRef.setInput('zqComponentParams', config.zqComponentParams)
      modalRef.componentInstance = componentRef.instance
    }
    return modalRef;
  }

  createInjector() {
    // return Injector.create()
  }
}
