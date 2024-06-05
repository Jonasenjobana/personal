import {
  ChangeDetectorRef,
  Component,
  ComponentRef,
  ContentChildren,
  ElementRef,
  Injector,
  Input,
  Optional,
  QueryList,
  SimpleChanges,
  ViewContainerRef,
} from '@angular/core';
import { VxeTableService } from '../vxe-table.service';
import { VxeColumnComponent } from '../vxe-column/vxe-column.component';
import { VxeGridColumn } from '../vxe-model';
import { VxeColumnGroupBase } from '../vxe-base/vxe-column-group';

@Component({
  selector: 'vxe-colgroup',
  templateUrl: './vxe-colgroup.component.html',
  styleUrls: ['./vxe-colgroup.component.less'],
})
export class VxeColgroupComponent extends VxeColumnGroupBase {
  readonly VXETYPE = 'vxe-colgroup';
  /**内部投影方式递归 */
  @Input() columnChildren: Partial<VxeGridColumn>[] = [];
  @ContentChildren(VxeColumnComponent) columns: QueryList<VxeColumnComponent>;
  @ContentChildren(VxeColgroupComponent) groups: QueryList<VxeColgroupComponent>;
  columnComponentList: VxeColumnComponent[];
  groupComponentList: VxeColgroupComponent[];
  columnCount: number = 0;
  constructor(
    @Optional() protected override vxeService: VxeTableService,
    private cdr: ChangeDetectorRef,
    protected override viewContainerRef: ViewContainerRef,
    protected override injector: Injector,
    public override element: ElementRef
  ) {
    super(vxeService, viewContainerRef, injector, element);
    if (!vxeService) Error('error: vxeService is null');
  }
  ngOnChanges(changes: SimpleChanges) {
    const { fixed, width, hidden, columnChildren } = changes;
    if (fixed && !fixed.isFirstChange()) {
      this.setFixedColumn();
    }
    if (width) {
      this.setWidth(this.width);
    }
    if (hidden) {
      this.vxeService.headUpdate$.next();
    }
    if (columnChildren) {
      this.setChildComponent();
    }
  }
  setChildComponent() {
    this.columnComponentList = [];
    this.groupComponentList = [];
    this.columnChildren.forEach((col) => {
      let ref: ComponentRef<any>
      if (col.children && col.children.length > 0) {
         ref = this.viewContainerRef.createComponent(VxeColgroupComponent, {injector: this.injector})
         this.groupComponentList.push(ref.instance)
         ref.setInput('columnChildren', col.children);
      } else {
         ref = this.viewContainerRef.createComponent(VxeColumnComponent, {injector: this.injector})
         this.columnComponentList.push(ref.instance)
         ref.setInput('type', col.type);
      }
      ref.setInput('title', col.title);
      ref.setInput('field', col.field);
    })
    this.reset();
  }
  ngAfterContentInit() {
    this.setFixedColumn();
    this.columns.changes.subscribe(data => {
      this.reset();
    });
    this.groups.changes.subscribe(data => {
      this.reset();
    });
  }
  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.reset();
  }
  reset() {
    this.columnCount =
      this.columns.length + this.columnComponentList.length + 
      [...this.groups, ...this.groupComponentList].reduce((count, el) => {
        return count + el.columnCount;
      }, 0);
    const columns = [...this.columns.toArray(), ...this.columnComponentList];
    const groups = [...this.groups.toArray(), ...this.groupComponentList];
    this.children = this.vxeService.getDomFlow([...groups, ...columns]);
    console.log(columns, groups, this.title)
    this.setWidth(this.width);
  }
  override setWidth(width: number = 0) {
    // let childWidth = 0;
    // this.children.forEach(el => {
    //   childWidth += el.componentWidth;
    // });
    // const currentWidth = this.vxeColumnTemplate?.elementRef.nativeElement.getBoundingClientRect().width || 0;
    // this.componentWidth = Math.max(childWidth, width, currentWidth);
  }
}
