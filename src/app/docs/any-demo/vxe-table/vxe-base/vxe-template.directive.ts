import { ContentChild, Directive, Input, TemplateRef } from '@angular/core';

/**模板锚点 */
@Directive({
  selector: 'vxe-template,[vxeTemplate]'
})
export class VxeTemplateDirective {
  @Input() templateName: string;
  @Input() type: 'row' | 'column'
  @ContentChild(TemplateRef) template: TemplateRef<any>;
  constructor() { }
}
