import { group } from '@angular/animations';
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
import { head } from 'lodash';

/**含表头合并处理 */
@Component({
  selector: 'vxe-table-head',
  templateUrl: './vxe-table-head.component.html',
  styleUrls: ['./vxe-table-head.component.less']
})
export class VxeTableHeadComponent {
  @Input() wraperWidth: number;
  @Input() headCol: VxeColumnGroups;
  @Input() fixed: 'left' | 'right';
  /**同步滚动 */
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
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    const { headCol, wraperWidth } = changes;
    if (headCol && headCol.currentValue) {
      requestAnimationFrame(() => {
        this.initHeadColumns();
      });
    }
  }
  initHeadColumns() {
    this.tableHeaders = [];
    this.transformTree(this.headCol);
    this.updateAutoWidth(this.tableHeaders[0], this.wraperWidth);
    this.colgroupLeaf = this.tableHeaders
      .flat(1)
      .filter(el => el._isLeaf)
      .sort((a, b) => a._sortIndex - b._sortIndex);
    !this.fixed && this.vxeService.tableHeaderLeafColumns$.next(this.colgroupLeaf);
    console.log(this.tableHeaders, this.fixed);
    this.columnChange.emit(this.colgroupLeaf);
    setTimeout(() => {
      this.updateDom();
    });
  }
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
        let hiddenColumn: boolean = false;
        const column = queue.shift();
        !column.hidden && (sortIndex = this.updateSortIndex(column, sortIndex));
        if (column.VXETYPE == 'vxe-colgroup' && column.children.length > 0) {
          const width = column.width;
          const children = column.children as VxeColumnGroups;
          children.forEach(el => {
            el.fixed = column.fixed;
            el._hidden = el.hidden || column.hidden;
          });
          const filterChildren = children.filter(el => !el._hidden);
          /**子项总宽度 */
          const total = filterChildren.reduce((width, child) => child.width + width, 0);
          hiddenColumn = filterChildren.length == 0;
          queue.push(...filterChildren);
        }
        if (column.hidden || hiddenColumn) continue;
        Object.assign(column, {
          _level: currentLevel,
          _colspan: this.getLeafCount(column),
          _isLeaf: column.VXETYPE == 'vxe-column'
        });
        levelRoot.push(column);
      }
      levelRoot.length > 0 && this.tableHeaders.push(levelRoot);
      levelRoot = [];
      currentLevel++;
    }
  }
  /**
   * 1、 无宽度按比例分配
   * 2、 父节点有宽度 子无 从剩余父分配
   * 3、 父节点无宽度 子有 则父宽度等于子宽度
   *
   * 更新自动宽度
   * @param header 表头
   * @param wraperWidth 表头宽
   */
  updateAutoWidth(header: VxeColumnGroups, wraperWidth: number) {
    if (header.length == 0) return 0;
    // assign 已经分配了宽度的header
    const assignChild = header.filter(el => el.width);
    const assigWidth = assignChild.reduce((width, el) => el.width + width, 0);
    const diff = wraperWidth - assigWidth;
    // 当前集合的平均宽度 已经分配则是剩余宽度 若不够剩余宽度则仍然默认平均宽度
    const avgWidth = (diff > 0 ? diff : wraperWidth) / (diff > 0 ?  header.length - assignChild.length : header.length);
    header.forEach(td => {
      td.autoWidth = td.width || avgWidth;
      if (td.VXETYPE == 'vxe-colgroup') {
        const childWidth = this.updateAutoWidth(td.children, td.autoWidth || avgWidth);
        td.autoWidth = Math.min(childWidth, td.autoWidth);
      }
    });
    return header.reduce((width, el) => el.autoWidth + width, 0);
  }
  updateLevelTreeWidth() {
    this.tableHeaders.forEach((el, idx) => {
      if (idx > 0) {
      }
    });
  }
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
    column.children
      .filter(el => !el.hidden)
      .forEach(el => {
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
    setTimeout(() => {
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
