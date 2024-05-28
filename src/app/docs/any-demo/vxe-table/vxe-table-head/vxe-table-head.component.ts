import { Component, ElementRef, EventEmitter, Input, Optional, Output, SimpleChanges, ViewChild } from '@angular/core';
import { VxeTableService } from '../vxe-table.service';
import { VxeColumnComponent } from '../vxe-column/vxe-column.component';
import { VxeColumnGroup, VxeColumnGroups } from '../vxe-model';
import { VxeColgroupComponent } from '../vxe-colgroup/vxe-colgroup.component';
import { VxeColumnGroupBase } from '../vxe-base/vxe-column-group';
import { VxeTableComponent } from '../vxe-table/vxe-table.component';

@Component({
  selector: 'vxe-table-head',
  templateUrl: './vxe-table-head.component.html',
  styleUrls: ['./vxe-table-head.component.less']
})
export class VxeTableHeadComponent {
  @Input() headCol: VxeColumnGroups;
  @Input() fixed: 'left' | 'right';
  @Input() transformX: number = 0
  tableHeaders: VxeColumnGroups[] = [];
  colgroupLeaf: VxeColumnGroups;
  /**列头变化 */
  @Output() columnChange: EventEmitter<VxeColumnGroups> = new EventEmitter();
  @ViewChild('tableRef') tableRef: ElementRef<HTMLTableElement>;
  maxWidth: number
  constructor(private vxeService: VxeTableService, @Optional() private parent: VxeTableComponent, private elementRef: ElementRef<HTMLDivElement>) {
  }
  ngOnChanges(changes: SimpleChanges) {
    const { headCol, fixed } = changes;
    if (headCol && headCol.currentValue) {
      this.tableHeaders = [];
      this.transformTree(this.headCol);
      this.colgroupLeaf = this.tableHeaders.flat(1).filter(el => el._isLeaf).sort((a, b) => a._sortIndex - b._sortIndex);
      this.vxeService.tableHeaderColumn$.next(this.colgroupLeaf);
      this.columnChange.emit(this.colgroupLeaf);
      console.log(this.tableHeaders, this.colgroupLeaf,'leaf')
    }
  }
  get componentHeight() {
    return this.elementRef.nativeElement.getBoundingClientRect().height;
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
        const column = queue.shift();
        sortIndex = this.updateSortIndex(column, sortIndex);
        if (column.VXETYPE == 'vxe-colgroup' && column.children.length > 0) {
          (column.children as VxeColumnGroups).forEach(el => {
            el.fixed = column.fixed;
          });
          queue.push(...column.children);
        }
        levelRoot.push({
          ...(column as any),
          _level: currentLevel,
          _colspan: this.getLeafCount(column),
          _isLeaf: column.VXETYPE == 'vxe-column'
        });
      }
      this.tableHeaders.push(levelRoot);
      levelRoot = [];
      currentLevel++;
    }
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
    })
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
    this.updateDom();
  }
  updateDom() {
    const tableEl = this.tableRef.nativeElement;
    requestAnimationFrame(() => {
      const {width} = tableEl.getBoundingClientRect()
      this.maxWidth = width
    })
  }
}
