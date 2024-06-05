import {
  ContentChild,
  Directive,
  ElementRef,
  Input,
  Optional,
  Injector,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { VxeTableService } from '../vxe-table.service';
import { VxeDynamicTable } from './vxe-dynamic-table';

/**公用属性 */
@Directive()
export abstract class VxeColumnGroupBase extends VxeDynamicTable {
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
  /**默认模板 取决于 type*/
  @ViewChild('vxeTemplate') defaultTemplate: TemplateRef<any>;
  /**自定义模板 */
  @ContentChild('columnTemplate') contentTemplate: TemplateRef<any>;
  vxeColumnTemplate: TemplateRef<any>;
  /**自动计算宽度 */
  autoWidth: number;
  parentComponent?: VxeColumnGroupBase;
  children: VxeColumnGroupBase[] = [];
  componentWidth: number;
  constructor(
    @Optional() protected override vxeService: VxeTableService,
    protected viewContaineRef: ViewContainerRef,
    protected override injector: Injector,
    public element: ElementRef
  ) {
    super(vxeService, viewContaineRef, injector);
  }
  setFixedColumn() {
    this.fixed && this.vxeService.addFixed(this.fixed, this);
  }
  ngAfterViewInit() {
    this.vxeColumnTemplate = this.contentTemplate || this.defaultTemplate;
  }
  /** */
  abstract setWidth();
}
