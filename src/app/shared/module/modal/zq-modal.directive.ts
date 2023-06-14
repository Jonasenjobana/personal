import { ZqModalType } from './type';
import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[zqModal]'
})
export class ZqModalDirective {
  @Input() zqType: ZqModalType = 'confirm'
  @Input() inTemplate?: TemplateRef<any> | null = null
  constructor() { }

}
