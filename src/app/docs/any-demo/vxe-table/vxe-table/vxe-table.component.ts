import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, ElementRef, EventEmitter, Input, Output, QueryList, Renderer2, SimpleChanges, ViewChild, forwardRef } from '@angular/core';
import { VxeTableService } from '../vxe-table.service';
import { VxeColumnComponent } from '../vxe-column/vxe-column.component';
import { VxeColumnConfig, VxeColumnGroups, VxePageConfig, VxeRowConfig, VxeTreeConfig, VxeVirtualConfig } from '../vxe-model';
import { VxeColgroupComponent } from '../vxe-colgroup/vxe-colgroup.component';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'vxe-table',
  templateUrl: './vxe-table.component.html',
  styleUrls: ['./vxe-table.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VxeTableComponent {
  /**表格数据 */
  @Input() inData: any[] = [];
  /**接口 */
  @Input() inApi: string
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
  /**列 */
  @ContentChildren(VxeColumnComponent) columnComponents?: QueryList<VxeColumnComponent>;
  @ContentChildren(VxeColgroupComponent) colgroupComponents?: QueryList<VxeColgroupComponent>;
  /**表主体 */
  @ViewChild('tableWrapper') tableWrapper: ElementRef<HTMLDivElement>;
  /**表头 */
  @ViewChild('tableHeader') tableHeader: ElementRef<HTMLDivElement>;
  /**内容 除去表头 */
  @ViewChild('tableContent') tableContent: ElementRef<HTMLDivElement>;
  /**页脚 含分页 等 */
  @ViewChild('tableFooter') tableFooter: ElementRef<HTMLDivElement>;
  @Output() checkChange: EventEmitter<any> = new EventEmitter();
  /**垂直滚动距离 */
  scrollHeight: number = 0;
  /**水平滚动距离 */
  scrollLeft: number = 0;
  public containerHeight: number
  public headCol: VxeColumnGroups
  public contenCol: VxeColumnComponent[]
  contentHeight: number
  public tableHeight: number
  constructor(private elementRef: ElementRef<HTMLDivElement>, public vxeService: VxeTableService, private renderer: Renderer2, private cdr: ChangeDetectorRef) {  
  }
  ngOnChanges(changes: SimpleChanges) {
    const {inData, rowConfig, minHeight, maxHeight} = changes;
    if (inData) {
      this.vxeService.data = this.inData;
    }
    if (minHeight || maxHeight) {
      this.setTableHeight();
    }
  }
  setTableHeight() {
    const {minHeight, maxHeight, tableHeight} = this;
    const {height, width} = this.elementRef.nativeElement.getBoundingClientRect();
    this.tableHeight = Math.max(height, minHeight);
    this.tableHeight = maxHeight && Math.min(maxHeight, this.tableHeight) || this.tableHeight;
    this.renderer.setStyle(this.elementRef.nativeElement, 'height', this.tableHeight+'px')
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
    const content = this.tableContent.nativeElement;
    const header = this.tableHeader.nativeElement;
    const {width: headerWidth} = header.getBoundingClientRect();
    const {height: wraperHeight} = wraper.getBoundingClientRect();
    const {height: contentHeight} = content.getBoundingClientRect();
    console.log(headerWidth)
    this.setTableHeight();
    this.vxeService.tableWrapperHeight = wraperHeight;
    this.containerHeight = wraperHeight;
    this.contentHeight = contentHeight;
    fromEvent(content, 'scroll').subscribe((event: MouseEvent) => {
      const {scrollLeft} = content;
      this.scrollLeft = scrollLeft;
      this.cdr.markForCheck();
    })
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
      this.vxeService.tableColumn$.next(this.headCol);
      this.cdr.detectChanges();
    })
  }
}
