import { Subject, filter, takeUntil } from 'rxjs';
import {
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
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

@Component({
  selector: 'vxe-table',
  templateUrl: './vxe-table.component.html',
  styleUrls: ['./vxe-table.component.less'],
  providers: [VxeTableService]
})
export class VxeTableComponent extends VxeDynamicTable {
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
  public headCol: VxeColumnGroups;
  public contentCol: VxeColumnComponent[];
  public tableHeight: number;
  /**深拷贝inData 防止污染原数据 */
  public vData: VxeData[] = [];
  private destroy$: Subject<void> = new Subject();
  /**缓存比对 相同不处理 */
  public headHeight: number;
  public scrollLeft: number;
  constructor(
    private elementRef: ElementRef<HTMLDivElement>,
    public override vxeService: VxeTableService,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    private router: Router,
    protected override viewContainerRef: ViewContainerRef,
    protected override injector: Injector
  ) {
    super(vxeService, viewContainerRef, injector);
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
  ngOnChanges(changes: SimpleChanges) {
    const { inData, rowConfig, minHeight, maxHeight, gutterConfig, treeConfig } = changes;
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
          this.transformTree(this.vData);
        } else {
          // 本身就是树节点
          this.handleTree(this.vData);
          this.vData = this.flatTree(this.vData);
        }
      }
    }
  }
  /**自动根据parentId转树结构 */
  transformTree(data: VxeData[], parentIndex: string = '', level: number = 0, children?: VxeData[]) {
    const { rowField, parentField, expandAll = true, expandRowKeys = [], treeSeq } = this.treeConfig;
    const iterate = children || data.filter(el => !el[parentField]);
    return iterate.map((el, index) => {
      const id = el[rowField];
      let children = data.filter(item => item[parentField] == id);
      let treeIndex = parentIndex ? `${parentIndex}.${index + 1}` : `${index + 1}`;
      children = this.transformTree(data, treeIndex, level + 1, children);
      Object.assign(el, {
        _children: children.map(child => {
          child._parent = el;
          return child;
        }),
        _level: level,
        _treeIndex: treeIndex,
        _expanded: expandAll || expandRowKeys.includes(el[rowField])
      });
      return el;
    });
  }
  /**树转树 并扁平化为数组 */
  handleTree(data: VxeData[], parentIndex: string = '', level: number = 0, parent?: VxeData) {
    const {
      childrenField = 'children',
      rowField = 'id',
      parentField = 'parentId',
      expandAll = true,
      expandRowKeys = [],
      treeSeq
    } = this.treeConfig;
    return data.map((el, index) => {
      const children = el[childrenField];
      let treeIndex = parentIndex ? `${parentIndex}.${index + 1}` : `${index + 1}`;
      Object.assign(el, {
        _treeIndex: treeIndex,
        _expanded: expandAll || expandRowKeys.includes(el[rowField]),
        _level: level,
        _parent: parent,
        _children: children ? this.handleTree(children, treeIndex, level + 1, el) : []
      });
      return el;
    });
  }
  /**扁平化树 */
  flatTree(data: VxeData[]) {
    let result: VxeData[] = [];
    data.forEach(el => {
      result.push(el);
      if (el._children) {
        result = result.concat(this.flatTree(el._children));
      }
    });
    return result;
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
      this.resetTableHeader()
      this.createDynamicHeader(this.gridConfig.columns)
    }
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
  resetTable() {
    // 保证节点顺序
    this.headCol = this.resetTableHeader();
    this.vxeService.tableInnerColumn$.next(this.headCol);
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
