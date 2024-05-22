import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, ElementRef, EventEmitter, Input, Output, QueryList, SimpleChanges, ViewChild } from '@angular/core';
import { VxeTableService } from '../vxe-table.service';
import { VxeColumnComponent } from '../vxe-column/vxe-column.component';
import { VxeColumnConfig, VxePageConfig, VxeRowConfig, VxeTreeConfig } from '../vxe-model';

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
  // 分页配置
  @Input() pageConfig: VxePageConfig;
  // 行
  @ContentChildren(VxeColumnComponent) columnComponents: QueryList<VxeColumnComponent>;
  @ViewChild('tableWrapper') tableWrapper: ElementRef<HTMLDivElement>;
  @Output() checkChange: EventEmitter<any> = new EventEmitter();
  //水平滚动距离
  horizenScroll: number = 0;
  public containerHeight: number
  public columns: VxeColumnComponent[]
  constructor(private elementRef: ElementRef, public vxeService: VxeTableService, private cdr: ChangeDetectorRef) {  
  }
  ngOnChanges(changes: SimpleChanges) {
    const {inData} = changes;
    if (inData) {
      this.vxeService.data = this.inData;
    }
  }
  ngAfterContentInit() {
    this.resetTable(this.columnComponents);
    this.columnComponents.changes.subscribe((observer: QueryList<VxeColumnComponent>) => {
      this.resetTable(observer);
    })
  }
  ngAfterViewInit() {
    const wraper = this.tableWrapper.nativeElement;
    const {height} = wraper.getBoundingClientRect();
    this.vxeService.tableWrapperHeight = height;
    this.containerHeight = height;
  }
  resetTable(observer: QueryList<VxeColumnComponent>) {
    this.columns = observer.toArray();
    this.vxeService.allColumn = this.columns;
  }
}
