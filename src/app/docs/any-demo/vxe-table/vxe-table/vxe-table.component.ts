import { Subject, filter, takeUntil } from 'rxjs';
import {
  ChangeDetectorRef,
  Component,
  ComponentRef,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Inject,
  Injector,
  Input,
  Optional,
  Output,
  QueryList,
  Renderer2,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { VxeTableService } from '../vxe-table.service';
import { VxeColumnComponent } from '../vxe-column/vxe-column.component';
import {
  VxeColumnConfig,
  VxeColumnGroups,
  VxeContentEvent,
  VxeData,
  VxeGridColumn,
  VxeGridConfig,
  VxeGutterConfig,
  VxePageConfig,
  VxeRowConfig,
  VxeTableConfig,
  VxeTableModel,
  VxeTreeConfig,
  VxeVirtualConfig
} from '../vxe-model';
import { VxeColgroupComponent } from '../vxe-colgroup/vxe-colgroup.component';
import { NavigationEnd, Router } from '@angular/router';
import * as _ from 'lodash';
import { VxeDynamicTable } from '../vxe-base/vxe-dynamic-table';
import { createDynamicHeader } from '../vxe-base/vxe-mixin';

@Component({
  selector: 'vxe-table',
  templateUrl: './vxe-table.component.html',
  styleUrls: ['./vxe-table.component.less'],
  providers: [VxeTableService],
  host: {
    '[class.vxe-border-inner]': 'innerBorder',
  }
})
export class VxeTableComponent implements VxeDynamicTable {
  /**表格数据 */
  @Input() inData: any[] = [];
  @Input() columnConfig: Partial<VxeColumnConfig>;
  @Input() treeConfig: Partial<VxeTreeConfig>;
  @Input() mergeCell: any;
  @Input() rowConfig: Partial<VxeRowConfig>;
  @Input() minHeight: number = 300;
  @Input() maxHeight: number;
  @Input() pageIndex: number = 0;
  /**默认完整边框 */
  @Input() innerBorder: boolean = true
  /**加载中 */
  @Input() loading: boolean
  /**表头tr td额外classname */
  @Input() headerRowClassName: string
  @Input() headerCellClassName: string
  /**表内容tr td额外classname */
  @Input() cellClassName: string
  @Input() rowClassName: string
  /**表格配置模式 */
  @Input() inGrid: boolean = false;
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
  @Input() rowStyle: any;
  @Input() cellStyle: any;
  @Input() gridConfig: VxeGridConfig
  tableModel: VxeTableModel = 'normal';
  /**列 */
  @ContentChildren(VxeColumnComponent) contentColumns: QueryList<VxeColumnComponent>
  @ContentChildren(VxeColgroupComponent) contentGroups: QueryList<VxeColgroupComponent>
  wraperWidth: number = 0;
  /**页脚 含分页 等 */
  @ViewChild('tableFooter') tableFooter: ElementRef<HTMLDivElement>;
  @Output() checkChange: EventEmitter<any> = new EventEmitter();
  @Output() pageChange: EventEmitter<any> = new EventEmitter();

  public headCol: VxeColumnGroups;
  public contentCol: VxeColumnComponent[];
  public tableHeight: number;
  public wraperHeight: number;
  /**深拷贝inData 防止污染原数据 */
  public vData: VxeData[] = [];
  private destroy$: Subject<void> = new Subject();
  /**缓存比对 相同不处理 */
  public headHeight: number;
  public scrollLeft: number;
  constructor(
    private elementRef: ElementRef<HTMLDivElement>,
    public vxeService: VxeTableService,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    private router: Router,
    protected viewContainerRef: ViewContainerRef,
    protected injector: Injector
  ) {
    this.vxeService.contentEvent$.subscribe(($event: VxeContentEvent) => {
      this.contentEvent($event);
    });
    //切换路由时，滚动到上次位置
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(evt => {
        this.vxeService.virtualScrolReset$.next();
      });
  }
  contentColComponents: VxeColumnComponent[] = [];
  contentGroupComponents: VxeColgroupComponent[] = [];
  dynamicColComponents: VxeColumnComponent[] = [];
  dynamicGroupComponents: VxeColgroupComponent[] = [];
  ngOnChanges(changes: SimpleChanges) {
    const { inData, rowConfig, minHeight, maxHeight, gutterConfig, treeConfig, gridConfig } = changes;
    if ((minHeight && !minHeight.isFirstChange()) || (maxHeight && !maxHeight.isFirstChange())) {
      this.setTableHeight();
    }
    if (treeConfig && treeConfig.currentValue) {
      this.tableModel = 'tree';
      Object.assign(
        {
          rowField: 'id',
          parentField: 'parentId',
          transform: true
        },
        this.treeConfig
      );
    }
    if (inData) {
      this.vData = _.cloneDeep(this.inData);
      if (this.tableModel == 'tree') {
        const { transform } = this.treeConfig;
        if (transform) {
          this.vData.forEach(el => {
            this.transformTree(el);
          })
          this.vData = this.vData.filter(el => !el._parent)
          this.vData = this.flatTree(this.vData);
        } else {
          // 本身就是树节点
          this.handleTree(this.vData);
          this.vData = this.flatTree(this.vData);
        }
      }
    }
    if (gridConfig && !gridConfig.isFirstChange()) {
      this.createDynamicHeader(this.gridConfig.columns);
      this.resetTableHeader();
    }
  }
  /**自动根据parentId转树结构 调整顺序 */
  transformTree(current: VxeData, parentIndex: string = '') {
    const { rowField, parentField, expandAll = true, expandCb, treeSeq } = this.treeConfig;
    const id = current[rowField];
    const children = this.vData.filter(el => el[parentField] == id);
    if (children.length) {
      const expand = expandCb ? expandCb(current) : expandAll
      if (!current._parent) {
        current._hidden = false;
        current._level = 0;
      }
      current._expanded = expand;
      current._children = children.map((child, index) => {
        child._parent = current;
        child._hidden = current._hidden || !current._expanded
        child._level = current._level + 1;
        return child;
      })
    }
  }
  /**本身是树转vxe的树 并扁平化为数组 */
  handleTree(data: VxeData[], parentIndex: string = '', level: number = 0, parent?: VxeData) {
    const {
      childrenField = 'children',
      expandAll = true,
      expandCb,
    } = this.treeConfig;
    return data.map((el, index) => {
      const children = el[childrenField];
      let treeIndex = parentIndex ? `${parentIndex}.${index + 1}` : `${index + 1}`;
      el._level = level;
      el._treeIndex = treeIndex;
      el._parent = parent;
      el._hidden = parent ? (parent._hidden || !parent._expanded) : false;
      el._expanded = expandCb ? expandCb(el) : expandAll;
      el._children = children ? this.handleTree(children, treeIndex, level + 1, el) : []
      return el;
    });
  }
  /**扁平化树 */
  flatTree(data: VxeData[]) {
    let result: VxeData[] = [];
    data.forEach(el => {
      result.push(el);
      if (el._children && el._children.length > 0) {
        result = result.concat(this.flatTree(el._children));
      }
    });
    return result;
  }
  setTableHeight() {
    const { minHeight, maxHeight } = this;
    const { height } = this.elementRef.nativeElement.getBoundingClientRect();
    const { height: footerHeight} = this.tableFooter.nativeElement.getBoundingClientRect();
    console.log(height,'www')
    this.wraperHeight = Math.max(height, minHeight);
    this.wraperHeight = (maxHeight && Math.min(maxHeight, this.wraperHeight)) || this.wraperHeight;
    this.renderer.setStyle(this.elementRef.nativeElement, 'height', this.wraperHeight + 'px');
    this.tableHeight = this.wraperHeight - footerHeight;
  }
  ngAfterContentInit() {
    this.contentColComponents = this.contentColumns.toArray();
    this.contentGroupComponents = this.contentGroups.toArray();
    this.contentColumns.changes.subscribe(data => {
      this.contentColComponents = this.contentColumns.toArray();
      this.resetTableHeader();
    });
    this.contentGroups.changes.subscribe(data => {
      this.contentGroupComponents = this.contentGroups.toArray();
      this.resetTableHeader();
    });
  }
  ngAfterViewInit() {
    const el = this.elementRef.nativeElement;
    this.wraperWidth = el.offsetWidth;
    this.vxeService.headHeight$.subscribe(height => {
      if (!height || height == this.headHeight) return;
      this.headHeight = height;
      this.setTableHeight();
    });
    this.vxeService.scrollLeft$.subscribe(scrollLeft => {
      if (scrollLeft == this.scrollLeft) return;
      this.scrollLeft = scrollLeft;
      this.cdr.detectChanges();
    });
    // 表格配置
    if (this.inGrid) {
      this.createDynamicHeader(this.gridConfig.columns)
    }
    this.resetTableHeader()
  }
  resetTableHeader() {
    const groups = [...this.contentGroupComponents, ...this.dynamicGroupComponents];
    const columns = [...this.contentColComponents, ...this.dynamicColComponents];
    this.headCol = this.vxeService.getDomFlow([...groups, ...columns]);
    this.vxeService.tableInnerColumn$.next(this.headCol);
    this.cdr.detectChanges();
  }
  createDynamicHeader(vxeGridColumn: Partial<VxeGridColumn>[]) {
    const {dyColumns, dyGroups} = createDynamicHeader(vxeGridColumn, { viewContainerRef: this.viewContainerRef, injector: this.injector })
    this.dynamicColComponents = dyColumns;
    this.dynamicGroupComponents = dyGroups;
  }
  contentEvent($event: VxeContentEvent) {
    const { type, event, row } = $event;
    switch (type) {
      case 'checkbox':
        this.checkChange.emit([event, row, this.vData.filter(el => el._check)]);
        break;
      case 'expand':
        break;
    }
  }
  onColumnChange(columns: VxeColumnGroups) {
    this.contentCol = columns.filter(el => el.VXETYPE == 'vxe-column' && !el.hidden) as VxeColumnComponent[];
    this.cdr.markForCheck();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
