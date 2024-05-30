import { Directive, ElementRef, Input, Optional, TemplateRef, ViewChild } from '@angular/core';
import { VxeColgroupComponent } from '../vxe-colgroup/vxe-colgroup.component';
import { VxeTableService } from '../vxe-table.service';

/**公用属性 */
@Directive()
export abstract class VxeColumnGroupBase {
  abstract readonly VXETYPE: 'vxe-column' | 'vxe-colgroup';
  @Input() field: string;
  @Input() width: number;
  @Input() fixed: 'left' | 'right';
  @Input() title: string;
  @Input() align: 'left' | 'right' | 'center' = 'center';
  @Input() hidden: boolean = false;
  @ViewChild('vxeTemplate') vxeColumnTemplate: TemplateRef<any>;
  /**自动计算宽度 */
  autoWidth: number
  parentComponent?: VxeColumnGroupBase;
  children: VxeColumnGroupBase[] = [];
  componentWidth: number;
  constructor(@Optional() protected vxeService: VxeTableService, public element: ElementRef) {}
  setFixedColumn() {
    this.fixed && this.vxeService.addFixed(this.fixed, this);
  }
  /** */
  abstract setWidth();
}
