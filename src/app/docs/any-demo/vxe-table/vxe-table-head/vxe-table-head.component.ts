import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { VxeTableService } from '../vxe-table.service';
import { VxeColumnComponent } from '../vxe-column/vxe-column.component';
import { VxeColumnGroups } from '../vxe-model';
import { VxeColgroupComponent } from '../vxe-colgroup/vxe-colgroup.component';

@Component({
  selector: 'vxe-table-head',
  templateUrl: './vxe-table-head.component.html',
  styleUrls: ['./vxe-table-head.component.less']
})
export class VxeTableHeadComponent {
  @Input() headCol: VxeColumnGroups;
  tableHeaders: VxeColumnGroups[] = [];
  colgroupLeaf: VxeColumnGroups;
  /**列头变化 */
  @Output() columnChange: EventEmitter<VxeColumnGroups> = new EventEmitter();
  constructor(private vxeService: VxeTableService) {}
  ngOnChanges(changes: SimpleChanges) {
    const { headCol } = changes;
    if (headCol && headCol.currentValue) {
      this.tableHeaders = [];
      this.transformTree(this.headCol);
      this.vxeService.tableHeaderColumn$.next(this.colgroupLeaf);
      this.colgroupLeaf = this.tableHeaders.flat(1).filter(el => el._isLeaf);
      this.columnChange.emit(this.colgroupLeaf);
      console.log(this.tableHeaders, this.headCol, this.colgroupLeaf);
    }
  }
  transformTree(root: VxeColumnGroups) {
    const queue = [...root];
    // 当前层级
    let currentLevel: number = 0;
    // 层级头部
    let levelRoot: VxeColumnGroups = [];
    while (queue.length > 0) {
      // 当前层级数量 标识每一层级的数量
      const levelCount: number = queue.length;
      for (let i = 0; i < levelCount; i++) {
        const column = queue.shift();
        if (column.VXETYPE == 'vxe-colgroup' && column.children.length > 0) {
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
  /**获取节点下叶子总数 */
  getLeafCount(column: VxeColgroupComponent | VxeColumnComponent) {
    if (column.VXETYPE == 'vxe-column') return 1;
    let count = 0;
    column.children.forEach(el => {
      count += this.getLeafCount(el);
    });
    return count;
  }
}
