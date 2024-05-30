import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Optional,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { VxeTableService } from '../vxe-table.service';
import { VxeColumnGroup, VxeColumnGroups, VxeGutterConfig } from '../vxe-model';
import { VxeColumnGroupBase } from '../vxe-base/vxe-column-group';
import { VxeTableComponent } from '../vxe-table/vxe-table.component';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'vxe-table-head',
  templateUrl: './vxe-table-head.component.html',
  styleUrls: ['./vxe-table-head.component.less']
})
export class VxeTableHeadComponent {
  @Input() headCol: VxeColumnGroups;
  @Input() fixed: 'left' | 'right';
  transformX: number = 0;
  tableHeaders: VxeColumnGroups[] = [];
  colgroupLeaf: VxeColumnGroups;
  /**列头变化 */
  @Output() columnChange: EventEmitter<VxeColumnGroups> = new EventEmitter();
  @ViewChild('tableRef') tableRef: ElementRef<HTMLTableElement>;
  @ViewChild('tableHead') tableHead: ElementRef<HTMLDivElement>;
  scrollWidth: number;
  scrollable: boolean;
  scrollLeft: number;
  /**预设宽度 */
  colWidth: number;
  /**实际宽度 */
  headWidth: number;
  get gutterWidth() {
    const { width } = this.gutterConfig;
    if (!this.colWidth) return width;
    if (this.colWidth < this.headWidth) {
      return width / (this.headWidth / this.colWidth);
    }
    return width;
  }
  get gutterConfig(): VxeGutterConfig {
    return this.vxeService.gutterConfig;
  }
  constructor(
    private vxeService: VxeTableService,
    private elementRef: ElementRef<HTMLDivElement>,
    private cdr: ChangeDetectorRef,
    @Optional() private parent: VxeTableComponent
  ) {
    const { headWidth$, tableHeaderLeafColumns$ } = this.vxeService;
    combineLatest([tableHeaderLeafColumns$, headWidth$]).subscribe(([columns, width]) => {
      // 自动分配宽度
      if (width !== 0) {
        this.headWidth = width;
        this.colWidth = columns.reduce((width, col) => col.width + width, 0);
        if (this.colWidth < width) {
          columns.forEach(col => {
            col.autoWidth = col.width * (width / this.colWidth);
          });
        }
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    const { headCol, fixed } = changes;
    if (headCol && headCol.currentValue) {
      setTimeout(() => {
        this.initHeadColumns();
      }, 50);
    }
  }
  initHeadColumns() {
    this.tableHeaders = [];
    this.transformTree(this.headCol);
    this.colgroupLeaf = this.tableHeaders
      .flat(1)
      .filter(el => el._isLeaf)
      .sort((a, b) => a._sortIndex - b._sortIndex);
    !this.fixed && this.vxeService.tableHeaderLeafColumns$.next(this.colgroupLeaf);
    console.log(this.tableHeaders, 'tableHeaders');
    console.log(this.colgroupLeaf, 'colgroupLeaf');
    this.columnChange.emit(this.colgroupLeaf);
    requestAnimationFrame(() => {
      this.updateDom();
    });
  }
  /**
   * 1、 无宽度按比例分配
   * 2、 父节点有宽度 子无 从剩余父分配
   * 3、 父节点无宽度 子有 则父宽度等于子宽度
   *
   */
  /**层级遍历 展开树形结构group */
  transformTree(root: VxeColumnGroups) {
    const queue = [...root];
    // 当前层级
    let currentLevel: number = 0;
    // 层级头部
    let levelRoot: VxeColumnGroups = [];
    let sortIndex: number = 0;
    while (queue.length > 0) {
      // 当前层级数量 标识每一层级的数量
      const levelCount: number = queue.length;
      for (let i = 0; i < levelCount; i++) {
        const column = queue.shift();
        !column.hidden && (sortIndex = this.updateSortIndex(column, sortIndex));
        if (column.VXETYPE == 'vxe-colgroup' && column.children.length > 0) {
          const width = column.width;
          (column.children as VxeColumnGroups).forEach(el => {
            el.fixed = column.fixed;
            el.hidden = column.hidden;
          });
          queue.push(...column.children);
        }
        if (column.hidden) continue;
        levelRoot.push({
          ...(column as any),
          _level: currentLevel,
          _colspan: this.getLeafCount(column),
          _isLeaf: column.VXETYPE == 'vxe-column'
        });
      }
      levelRoot.length > 0 && this.tableHeaders.push(levelRoot);
      levelRoot = [];
      currentLevel++;
    }
  }
  /**更新子节点宽度 */
  updateChildWidth() {}
  /**
   * 叶节点正确的顺序
   * 处理合并表头带来的顺序差异
   */
  updateSortIndex(root: VxeColumnGroup, idx: number) {
    let temp = idx;
    if (root.VXETYPE == 'vxe-column' && root._sortIndex == undefined) {
      root._sortIndex = temp++;
    }
    (root.children as VxeColumnGroups).forEach(el => {
      if (el.VXETYPE == 'vxe-colgroup') {
        temp = this.updateSortIndex(el, temp);
      } else if (el._sortIndex == undefined) {
        el._sortIndex = temp++;
      }
    });
    return temp;
  }
  /**获取节点下叶子总数 */
  getLeafCount(column: VxeColumnGroupBase) {
    if (column.VXETYPE == 'vxe-column') return 1;
    let count = 0;
    column.children.forEach(el => {
      count += this.getLeafCount(el);
    });
    return count;
  }
  ngAfterViewInit() {
    this.vxeService.scrollLeft$.subscribe(scrollLeft => {
      if (!this.fixed) {
        this.transformX = -scrollLeft;
      }
      this.scrollLeft = scrollLeft;
    });
    this.vxeService.headUpdate$.subscribe(() => {
      console.log('wtf');
      this.initHeadColumns();
    });
  }
  updateDom() {
    const tableEl = this.tableRef?.nativeElement;
    const headEl = this.tableHead?.nativeElement;
    if (!tableEl || !headEl) return;
    const { width } = tableEl.getBoundingClientRect();
    const { width: headWidth, height: headHeight } = headEl.getBoundingClientRect();
    this.scrollWidth = width;
    this.scrollable = headWidth <= width;
    // 滚动槽后续colgroup添加了 导致宽度变化不需要手动加上插槽宽度
    requestAnimationFrame(() => {
      if (this.scrollable) {
        const { width } = tableEl.getBoundingClientRect();
        this.scrollWidth = width;
      }
      if (this.fixed == 'right') {
        this.transformX = headWidth - this.scrollWidth;
      }
      if (!this.fixed) {
        this.vxeService.headHeight$.next(headHeight);
        this.vxeService.headWidth$.next(headWidth);
      }
    });
  }
}
