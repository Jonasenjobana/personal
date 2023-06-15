import { ZqModalType } from './type';
import { ComponentRef, Directive, Input, TemplateRef, Type } from '@angular/core';
import { CdkPortalOutlet, ComponentPortal, TemplatePortal } from '@angular/cdk/portal';

@Directive({
  selector: '[zqModal]'
})
export class ZqBaseModalComponent {
  @Input() zqType: ZqModalType = 'confirm';
  contentPortal!: CdkPortalOutlet;
  constructor() {

  }
  attachComponentPortal<T>(portal: ComponentPortal<T>) {
    console.log(this.contentPortal,'contentPortal');
    
    return this.contentPortal.attachComponentPortal(portal)
  }
  attachTemplatePortal<T>(portal: TemplatePortal<T>) {
    return this.contentPortal.attachTemplatePortal(portal)
  }
}
