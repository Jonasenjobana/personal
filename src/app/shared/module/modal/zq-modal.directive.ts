import { ZqModalType, ZqModalConfig, ZqBaseModalConfig } from './type';
import { ComponentRef, Directive, Input, TemplateRef, Type, EventEmitter, Output } from '@angular/core';
import { CdkPortalOutlet, ComponentPortal, TemplatePortal } from '@angular/cdk/portal';

@Directive({
  selector: '[zqModal]'
})
export class ZqBaseModalComponent {
  @Input() zqType: ZqModalType = 'confirm';
  @Input() inCloseIcon: boolean = true
  @Output() closeModal: EventEmitter<void> = new EventEmitter()
  @Output() okModal: EventEmitter<void> = new EventEmitter() 
  contentPortal!: CdkPortalOutlet;
  constructor() {

  }
  attachComponentPortal<T>(portal: ComponentPortal<T>) {
    // console.log(this.contentPortal,'contentPortal');
    
    return this.contentPortal.attachComponentPortal(portal)
  }
  attachTemplatePortal<T>(portal: TemplatePortal<T>) {
    return this.contentPortal.attachTemplatePortal(portal)
  }
  onCloseModal() {
    this.closeModal.emit()
  }
  onOkModal() {
    this.okModal.emit()
  }
}
