import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { VxeColumnComponent } from './vxe-column/vxe-column.component';
import { VxeColumnGroup, VxeColumnGroups, VxeGutterConfig } from './vxe-model';
import { isNotEmpty } from 'src/app/shared/utils/common.util';

/** */
@Injectable()
export class VxeTableService {
  private dataChange$: Subject<any[]> = new Subject();
  private fixedChange$: Subject<void> = new Subject();
  private _data: any[] = [];
  // 固定列
  public fixedColumn: FixedColumn = new FixedColumn();
  public allColumn: VxeColumnGroups = [];
  public tableHeaderColumn$: BehaviorSubject<VxeColumnGroups> = new BehaviorSubject([]);
  /**列变化 */
  public tableColumn$: BehaviorSubject<VxeColumnGroups> = new BehaviorSubject([]);
  /**鼠标悬浮列索引 */
  public hoverIndex$: BehaviorSubject<number> = new BehaviorSubject(-1);
  /**滚动距离 */
  public scrollTop$: BehaviorSubject<number> = new BehaviorSubject(0);
  public scrollLeft$: BehaviorSubject<number> = new BehaviorSubject(0);
  /**表头 */
  public headWidth$: BehaviorSubject<number> = new BehaviorSubject(0);
  public headHeight$: BehaviorSubject<number> = new BehaviorSubject(0);
  public gutterConfig: VxeGutterConfig = {
    width: 8,
    height: 6
  }
  public headUpdate$: Subject<void> = new Subject();
  set data(value: any) {
    this._data = value;
    this.dataChange$.next(value);
  }
  get data() {
    return this._data;
  }
  get dataObserve() {
    return this.dataChange$.asObservable();
  }
  constructor() {
  }
  addFixed(dir: 'left' | 'right', vxeCol: VxeColumnGroup) {
    this.fixedColumn[dir].push(vxeCol);
    this.fixedChange$.next();
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