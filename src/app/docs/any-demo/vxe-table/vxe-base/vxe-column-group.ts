import { Directive, ElementRef, Input, Optional, TemplateRef, ViewChild } from '@angular/core';
import { VxeTableService } from '../vxe-table.service';

/**公用属性 */
@Directive()
export abstract class VxeColumnGroupBase {
  abstract readonly VXETYPE: 'vxe-column' | 'vxe-colgroup';
  @Input() field: string;
  @Input() width: number;
  /**固定列位置需要在首尾 */
  @Input() fixed: 'left' | 'right';
  @Input() title: string;
  @Input() align: 'left' | 'right' | 'center' = 'center';
  /**控制是否隐藏 不建议使用*ngif进行控制 会导致vxe-table读取投影顺序出现错误 hidden仍然保留dom结构 */
  @Input() hidden: boolean = false;
  /**列排序 同层级比较 */
  @Input() sortNumber: number
  /**树节点 */
  @Input() treeNode: boolean
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
