import {
  ChangeDetectionStrategy,
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
  forwardRef
} from '@angular/core';
import { VxeTableService } from '../vxe-table.service';
import { VxeColumnComponent } from '../vxe-column/vxe-column.component';
import {
  VxeColumnConfig,
  VxeColumnGroups,
  VxeGutterConfig,
  VxePageConfig,
  VxeRowConfig,
  VxeTableConfig,
  VxeTreeConfig,
  VxeVirtualConfig
} from '../vxe-model';
import { VxeColgroupComponent } from '../vxe-colgroup/vxe-colgroup.component';
import { fromEvent } from 'rxjs';
import { group } from '@angular/animations';
import { VxeColumnGroupBase } from '../vxe-base/vxe-column-group';

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
  /**列 */
  @ContentChildren(VxeColumnComponent) set columnComponents(column: QueryList<VxeColumnComponent>) {
    this.columnComponentList = column.toArray();
    this.resetTable();
  };
  @ContentChildren(VxeColgroupComponent) set colgroupComponents(colgroup: QueryList<VxeColgroupComponent>) {
    this.colgroupComponentList = colgroup.toArray();
    this.resetTable();
  }
  columnComponentList: VxeColumnComponent[]
  colgroupComponentList: VxeColgroupComponent[]
  /**页脚 含分页 等 */
  @ViewChild('tableFooter') tableFooter: ElementRef<HTMLDivElement>;
  @Output() checkChange: EventEmitter<any> = new EventEmitter();
  public headCol: VxeColumnGroups;
  public contenCol: VxeColumnComponent[];
  public tableHeight: number;
  public headHeight: number;
  public headWidth: number;
  public scrollLeft: number;
  constructor(
    private elementRef: ElementRef<HTMLDivElement>,
    public vxeService: VxeTableService,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnChanges(changes: SimpleChanges) {
    const { inData, rowConfig, minHeight, maxHeight, gutterConfig } = changes;
    if (inData) {
      this.vxeService.data = this.inData;
    }
    if ((minHeight && !minHeight.isFirstChange()) || (maxHeight && !maxHeight.isFirstChange())) {
      this.setTableHeight();
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
    this.vxeService.headHeight$.subscribe(height => {
      if (!height) return;
      this.setTableHeight();
    });
    this.vxeService.headWidth$.subscribe(width => {
      this.headWidth = width;
    });
    this.vxeService.scrollLeft$.subscribe(scrollLeft => {
      this.scrollLeft = scrollLeft;
      this.cdr.detectChanges();
    });
  }
  ngAfterContentInit() {
  }
  onColumnChange(columns: VxeColumnGroups) {
    this.contenCol = columns.filter(el => el.VXETYPE == 'vxe-column' && !el.hidden) as VxeColumnComponent[];
  }
  resetTable() {
    const groups = this.colgroupComponentList || [];
    const columns = this.columnComponentList || [];
    // 保证节点顺序
    this.headCol = this.vxeService.getDomFlow([...groups, ...columns]);
    console.log(this.headCol)
    this.vxeService.allColumn = this.headCol;
    this.vxeService.tableColumn$.next(this.headCol);
  }
}
