import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { VxeColumnComponent } from './vxe-column/vxe-column.component';
import { VxeColumnGroup, VxeColumnGroups } from './vxe-model';
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
  public tableWrapperHeight: number
  public tableHeaderColumn$: BehaviorSubject<VxeColumnGroups> = new BehaviorSubject([]);
  public tableColumn$: BehaviorSubject<VxeColumnGroups> = new BehaviorSubject([]);
  public hoverIndex$: Subject<number> = new Subject();
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
    return this.right.reduce((width, el) => {
      return (el.width || el.element.nativeElement.getBoundingClientRect().width) + width
    }, 0)
  }
  get leftWidth() {
    return this.left.reduce((width, el) => {
      return (el.width || el.element.nativeElement.getBoundingClientRect().width) + width
    }, 0)
  }
  constructor() {
    this.left = [];
    this.right = [];
  }
}