import { ZqModalConfig } from './type';
import { Subject, takeUntil } from 'rxjs';
import { ZqBaseModalComponent } from './zq-modal.directive';
import { OverlayRef } from '@angular/cdk/overlay';
export class ZqModalRef<T = any> {
    containerInstance: ZqBaseModalComponent
    overlayRef: OverlayRef
    componentInstance: T | null = null
    destroy$: Subject<void> = new Subject()
    constructor(overlayRef: OverlayRef, containerInstance: ZqBaseModalComponent, config: ZqModalConfig<T>) {
        this.overlayRef = overlayRef
        this.containerInstance = containerInstance
        containerInstance.closeModal.pipe(takeUntil(this.destroy$)).subscribe(() => { 
            if (typeof config.zqAfterClose === 'function') {
                config.zqAfterClose(this.componentInstance)
            }
            this.onCloseModal()
        })
        overlayRef.backdropClick().pipe(takeUntil(this.destroy$)).subscribe(() => {  
            if (config.outsideClose) {
                this.onCloseModal()
            }
        })
        containerInstance.okModal.pipe(takeUntil(this.destroy$)).subscribe(() => { 
            if (typeof config.zqAfterClose === 'function') {
                config.zqAfterClose(this.componentInstance)
            }
            this.onOkModal(config)
        })
    }
    onCloseModal() {
        this.destroy$.next()
        this.overlayRef.detachBackdrop()
        this.overlayRef.dispose()   
    }
    onOkModal(config: ZqModalConfig<T>) {
        if (typeof config.zqOkCb === 'function') {
            config.zqOkCb()
        }
        this.onCloseModal()
    }
}