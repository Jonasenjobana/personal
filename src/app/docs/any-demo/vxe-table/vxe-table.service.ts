import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { VxeColumnComponent } from './vxe-column/vxe-column.component';
import { VxeColumnGroup, VxeColumnGroups, VxeGutterConfig } from './vxe-model';
import { isNotEmpty } from 'src/app/shared/utils/common.util';

/**
 * vxe 跨组件通讯必备服务
 * 2、可通过注入父组件通讯 缺点无法获取监听。维护困难
 */
@Injectable()
export class VxeTableService {
  public dataChange$: Subject<any[]> = new Subject();
  private fixedChange$: Subject<void> = new Subject();
  private _data: any[] = [];
  // 固定列
  public fixedColumn: FixedColumn = new FixedColumn();
  /**表格表头的投影内容 未处理的原始投影 */
  public tableInnerColumn$: BehaviorSubject<VxeColumnGroups> = new BehaviorSubject([]);
  /**展开多层级表头后渲染顺序 并且已经处理了*/
  public tableHeaderLeafColumns$: BehaviorSubject<VxeColumnGroups> = new BehaviorSubject([]);
  /**鼠标悬浮列索引 */
  public hoverIndex$: BehaviorSubject<number> = new BehaviorSubject(-1);
  /**滚动距离 */
  public scrollTop$: BehaviorSubject<number> = new BehaviorSubject(0);
  public scrollLeft$: BehaviorSubject<number> = new BehaviorSubject(0);
  /**表头 长宽属性 */
  public headWidth$: BehaviorSubject<number> = new BehaviorSubject(0);
  public headHeight$: BehaviorSubject<number> = new BehaviorSubject(0);
  /**滚动槽默认长宽 */
  public gutterConfig: VxeGutterConfig = {
    width: 8,
    height: 6
  }
  /**表头更新通知 */
  public headUpdate$: Subject<void> = new Subject();
  constructor() {
  }
  addFixed(dir: 'left' | 'right', vxeCol: VxeColumnGroup) {
    this.fixedColumn[dir].push(vxeCol);
    this.fixedChange$.next();
  }
  removeFixed(dir: 'left' | 'right', vxeCol: VxeColumnGroup) {
    const delIdx = this.fixedColumn[dir].findIndex(el => el == vxeCol);
    this.fixedColumn[dir].splice(delIdx, 1);
  }
  destroy() {
    this.fixedColumn = new FixedColumn();
  }
  changeSort(column: VxeColumnComponent) {
    
  }
  /**按照dom顺序数组 */
  getDomFlow(domArray: VxeColumnGroups) {
    return domArray.sort((a, b) => a.element.nativeElement.compareDocumentPosition(b.element.nativeElement) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);
  }
}

class FixedColumn {
  left: VxeColumnGroup[]
  right: VxeColumnGroup[]
  get hasFixed() {
    return this.left.length > 0 || this.right.length > 0
  }
  get rightWidth() {
    return this.right.filter(el => !el.hidden).reduce((width, el) => {
      return (el.width || el.element.nativeElement.getBoundingClientRect().width) + width
    }, 0)
  }
  get leftWidth() {
    return this.left.filter(el => !el.hidden).reduce((width, el) => {
      return (el.width || el.element.nativeElement.getBoundingClientRect().width) + width
    }, 0)
  }

  constructor() {
    this.left = [];
    this.right = [];
  }
}