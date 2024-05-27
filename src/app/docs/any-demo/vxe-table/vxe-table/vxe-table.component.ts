import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, ElementRef, EventEmitter, Input, Output, QueryList, SimpleChanges, ViewChild } from '@angular/core';
import { VxeTableService } from '../vxe-table.service';
import { VxeColumnComponent } from '../vxe-column/vxe-column.component';
import { VxeColumnConfig, VxeColumnGroups, VxePageConfig, VxeRowConfig, VxeTreeConfig, VxeVirtualConfig } from '../vxe-model';
import { VxeColgroupComponent } from '../vxe-colgroup/vxe-colgroup.component';

@Component({
  selector: 'vxe-table',
  templateUrl: './vxe-table.component.html',
  styleUrls: ['./vxe-table.component.less'],
  providers: [VxeTableService],
})
export class VxeTableComponent {
  /**表格数据 */
  @Input() inData: any[] = [];
  @Input() columnConfig: VxeColumnConfig;
  @Input() treeConfig: VxeTreeConfig;
  @Input() mergeCell: any;
  @Input() rowConfig: VxeRowConfig;
  @Input() minHeight: number = 300;
  @Input() maxHeight: number;
  /**表单模式 */
  @Input() formModel: boolean = false;
  // 分页配置
  @Input() pageConfig: VxePageConfig;
  // 虚拟滚动
  @Input() virtualConfig: VxeVirtualConfig;
  /**列 */
  @ContentChildren(VxeColumnComponent) columnComponents?: QueryList<VxeColumnComponent>;
  @ContentChildren(VxeColgroupComponent) colgroupComponents?: QueryList<VxeColgroupComponent>;
  @ViewChild('tableWrapper') tableWrapper: ElementRef<HTMLDivElement>;
  @Output() checkChange: EventEmitter<any> = new EventEmitter();
  //水平滚动距离
  horizenScroll: number = 0;
  public containerHeight: number
  public headCol: VxeColumnGroups
  public contenCol: VxeColumnComponent[]
  constructor(private elementRef: ElementRef, public vxeService: VxeTableService, private cdr: ChangeDetectorRef) {  
  }
  ngOnChanges(changes: SimpleChanges) {
    const {inData} = changes;
    if (inData) {
      this.vxeService.data = this.inData;
    }
  }
  ngAfterContentInit() {
    this.resetTable();
    this.columnComponents.changes.subscribe((observer: QueryList<VxeColumnComponent>) => {
      this.resetTable();
    })
    this.colgroupComponents.changes.subscribe((observer: QueryList<VxeColgroupComponent>) => {
      this.resetTable();
    })
  }
  ngAfterViewInit() {
    const wraper = this.tableWrapper.nativeElement;
    const {height} = wraper.getBoundingClientRect();
    this.vxeService.tableWrapperHeight = height;
    this.containerHeight = height;
  }
  onColumnChange(columns: VxeColumnGroups) {
    this.contenCol = columns.filter(el => el.VXETYPE == 'vxe-column') as VxeColumnComponent[];
  }
  resetTable() {
    requestAnimationFrame(() => {
      const groups = this.colgroupComponents.toArray() || [];
      const columns = this.columnComponents.toArray() || [];
      // 保证节点顺序
      this.headCol = this.vxeService.getDomFlow([...groups, ...columns]);
      this.vxeService.allColumn = this.headCol;
    })
  }
}
