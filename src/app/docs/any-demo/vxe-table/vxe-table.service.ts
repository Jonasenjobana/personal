import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { VxeColumnComponent } from './vxe-column/vxe-column.component';

/** */
@Injectable()
export class VxeTableService {
  private dataChange$: Subject<any[]> = new Subject();
  private fixedChange$: Subject<void> = new Subject();
  private _data: any[] = [];
  // 固定列
  public fixedColumn: FixedColumn = new FixedColumn();
  public allColumn: VxeColumnComponent[] = [];
  public tableWrapperHeight: number
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
  addFixed(dir: 'left' | 'right', vxeCol: VxeColumnComponent) {
    this.fixedColumn[dir].push(vxeCol);
    this.fixedChange$.next();
  }
  destroy() {
    this.fixedColumn = new FixedColumn();
  }
}
class FixedColumn {
  left: VxeColumnComponent[]
  right: VxeColumnComponent[]
  get hasFixed() {
    return this.left.length > 0 || this.right.length > 0
  }
  get rightWidth() {
    return this.right.reduce((width, el) => {
      return el.width + width
    }, 0)
  }
  get leftWidth() {
    return this.left.reduce((width, el) => {
      return el.width + width
    }, 0)
  }
  constructor() {
    this.left = [];
    this.right = [];
  }
}