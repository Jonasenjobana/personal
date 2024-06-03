import {
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  Renderer2,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { VxeTableService } from '../vxe-table.service';
import { VxeColumnComponent } from '../vxe-column/vxe-column.component';
import {
  VxeColumnConfig,
  VxeColumnGroups,
  VxeContentEvent,
  VxeGutterConfig,
  VxePageConfig,
  VxeRowConfig,
  VxeTableConfig,
  VxeTableModel,
  VxeTreeConfig,
  VxeVirtualConfig
} from '../vxe-model';
import { VxeColgroupComponent } from '../vxe-colgroup/vxe-colgroup.component';

@Component({
  selector: 'vxe-table',
  templateUrl: './vxe-table.component.html',
  styleUrls: ['./vxe-table.component.less']
})
export class VxeTableComponent {
  /**表格数据 */
  @Input() inData: any[] = [];
  /**接口 */
  @Input() inApi: string;
  @Input() columnConfig: Partial<VxeColumnConfig>;
  @Input() treeConfig: Partial<VxeTreeConfig>;
  @Input() mergeCell: any;
  @Input() rowConfig: Partial<VxeRowConfig>;
  @Input() minHeight: number = 300;
  @Input() maxHeight: number;
  /**表单模式 */
  @Input() formModel: boolean = false;
  // 分页配置
  @Input() pageConfig: Partial<VxePageConfig>;
  // 虚拟滚动
  @Input() virtualConfig: Partial<VxeVirtualConfig>;
  /**配置写法 动态生成vxe-column vxe-colgroup*/
  @Input() tableConfig: Partial<VxeTableConfig>;
  @Input() gutterConfig: VxeGutterConfig = {
    width: 8,
    height: 6
  };
  tableModel: VxeTableModel = 'normal';
  /**列 */
  @ContentChildren(VxeColumnComponent) set columnComponents(column: QueryList<VxeColumnComponent>) {
    this.columnComponentList = column.toArray();
    this.resetTable();
  };
  @ContentChildren(VxeColgroupComponent) set colgroupComponents(colgroup: QueryList<VxeColgroupComponent>) {
    this.colgroupComponentList = colgroup.toArray();
    this.resetTable();
  }
  columnComponentList: VxeColumnComponent[];
  colgroupComponentList: VxeColgroupComponent[];
  wraperWidth: number = 0;
  /**页脚 含分页 等 */
  @ViewChild('tableFooter') tableFooter: ElementRef<HTMLDivElement>;
  @Output() checkChange: EventEmitter<any> = new EventEmitter();
  public headCol: VxeColumnGroups;
  public contentCol: VxeColumnComponent[];
  public tableHeight: number;
  public scrollLeft: number;
  constructor(
    private elementRef: ElementRef<HTMLDivElement>,
    public vxeService: VxeTableService,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef
  ) {
    this.vxeService.contentEvent$.subscribe(($event: VxeContentEvent) => {
      this.contentEvent($event);
    })
  }
  ngOnChanges(changes: SimpleChanges) {
    const { inData, rowConfig, minHeight, maxHeight, gutterConfig, treeConfig } = changes;
    if (inData) {
      this.vxeService.dataChange$.next(this.inData);
    }
    if ((minHeight && !minHeight.isFirstChange()) || (maxHeight && !maxHeight.isFirstChange())) {
      this.setTableHeight();
    }
    if (treeConfig) {
      this.tableModel = 'tree';
    }
  }
  setTableHeight() {
    const { minHeight, maxHeight } = this;
    const { height } = this.elementRef.nativeElement.getBoundingClientRect();
    this.tableHeight = Math.max(height, minHeight);
    this.tableHeight = (maxHeight && Math.min(maxHeight, this.tableHeight)) || this.tableHeight;
    this.renderer.setStyle(this.elementRef.nativeElement, 'height', this.tableHeight + 'px');
  }
  ngAfterViewInit() {
    const el = this.elementRef.nativeElement;
    this.wraperWidth = el.offsetWidth
    this.vxeService.headHeight$.subscribe(height => {
      if (!height) return;
      this.setTableHeight();
    });
    this.vxeService.scrollLeft$.subscribe(scrollLeft => {
      this.scrollLeft = scrollLeft;
      this.cdr.detectChanges();
    });
  }
  contentEvent($event: VxeContentEvent) {
    const {type, event, row} = $event;
    switch(type) {
      case 'checkbox':
        this.checkChange.emit([event, row, this.inData.filter(el => el._check)]);
        break;
    }
  }
  onColumnChange(columns: VxeColumnGroups) {
    this.contentCol = columns.filter(el => el.VXETYPE == 'vxe-column' && !el.hidden) as VxeColumnComponent[];
    this.cdr.markForCheck();
  }
  resetTable() {
    const groups = this.colgroupComponentList || [];
    const columns = this.columnComponentList || [];
    // 保证节点顺序
    this.headCol = this.vxeService.getDomFlow([...groups, ...columns]);
    this.vxeService.tableInnerColumn$.next(this.headCol);
  }
}
