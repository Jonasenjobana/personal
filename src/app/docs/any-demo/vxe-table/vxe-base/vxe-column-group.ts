import {
  ContentChild,
  Directive,
  ElementRef,
  Input,
  TemplateRef,
  ViewChild,
} from '@angular/core';

/**公用属性 */
@Directive()
export abstract class VxeColumnGroupBase {
  abstract readonly VXETYPE: 'vxe-column' | 'vxe-colgroup';
  @Input() field: string;
  @Input() width: number;
  @Input() maxWidth: number;
  /**固定列位置需要在首尾 */
  @Input() fixed: 'left' | 'right';
  @Input() title: string;
  @Input() align: 'left' | 'right' | 'center' = 'center';
  /**控制是否隐藏 不使用*ngIf进行控制 会导致vxe-table读取投影顺序出现错误 hidden仍然保留dom结构 */
  @Input() hidden: boolean = false;
  /**列排序 同层级比较 */
  @Input() sortNumber: number;
  /**树节点 */
  @Input() treeNode: boolean;
  @Input() columnTemplate: TemplateRef<any>;
  /**默认模板 取决于 type*/
  @ViewChild('vxeTemplate') defaultTemplate: TemplateRef<any>;
  /**自定义模板 */
  @ContentChild('columnTemplate') contentTemplate: TemplateRef<any>;
  vxeColumnTemplate: TemplateRef<any>;
  /**自动计算宽度 */
  autoWidth: number;
  children: VxeColumnGroupBase[] = [];
  constructor(public element: ElementRef) {}
  /**模板优先级大于 投影 大于 默认 */
  ngAfterViewInit() {
    this.vxeColumnTemplate = this.columnTemplate || this.contentTemplate || this.defaultTemplate;
  }
}
