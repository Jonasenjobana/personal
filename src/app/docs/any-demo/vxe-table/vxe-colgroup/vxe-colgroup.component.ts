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
import { VxeDynamicTable } from '../vxe-base/vxe-dynamic-table';
import { createDynamicHeader } from '../vxe-base/vxe-mixin';

@Component({
  selector: 'vxe-colgroup',
  templateUrl: './vxe-colgroup.component.html',
  styleUrls: ['./vxe-colgroup.component.less'],
})
export class VxeColgroupComponent extends VxeColumnGroupBase implements VxeDynamicTable {
  readonly VXETYPE = 'vxe-colgroup';
  /**内部投影方式递归 */
  @Input() columnChildren: Partial<VxeGridColumn>[] = [];
  @ContentChildren(VxeColumnComponent) columns: QueryList<VxeColumnComponent>;
  @ContentChildren(VxeColgroupComponent) groups: QueryList<VxeColgroupComponent>;
  columnComponentList: VxeColumnComponent[];
  groupComponentList: VxeColgroupComponent[];
  constructor(
    @Optional() protected vxeService: VxeTableService,
    private cdr: ChangeDetectorRef,
    public override element: ElementRef,
    protected viewContainerRef: ViewContainerRef,
    protected injector: Injector,
  ) {
    super(element);
    if (!vxeService) Error('error: vxeService is null');
  }
  contentColComponents: VxeColumnComponent[] = [];
  contentGroupComponents: VxeColgroupComponent[] = [];
  dynamicColComponents: VxeColumnComponent[] = [];
  dynamicGroupComponents: VxeColgroupComponent[] = [];
  resetTableHeader() {
    const groups = [...this.contentGroupComponents, ...this.dynamicGroupComponents];
    const columns = [...this.contentColComponents, ...this.dynamicColComponents];
    this.children = this.vxeService.getDomFlow([...groups, ...columns]);
  }
  setFixedColumn() {
    this.fixed && this.vxeService.addFixed(this.fixed, this);
  }
  createDynamicHeader(vxeGridColumn: Partial<VxeGridColumn>[]) {
    const {dyColumns, dyGroups} = createDynamicHeader(vxeGridColumn, { viewContainerRef: this.viewContainerRef, injector: this.injector })
    this.dynamicColComponents = dyColumns;
    this.dynamicGroupComponents = dyGroups;
  }
  ngOnChanges(changes: SimpleChanges) {
    const { fixed, width, hidden, columnChildren } = changes;
    if (fixed && !fixed.isFirstChange()) {
      this.setFixedColumn();
    }
    if (hidden) {
      this.vxeService.headUpdate$.next();
    }
    if (columnChildren) {
      this.columnChildren.length > 0 && this.createDynamicHeader(this.columnChildren);
    }
  }
  ngAfterContentInit() {
    this.setFixedColumn();
    this.contentColComponents = this.columns.toArray();
    this.contentGroupComponents = this.groups.toArray();
    this.columns.changes.subscribe(data => {
      this.contentColComponents = this.columns.toArray();
      this.resetTableHeader();
    });
    this.groups.changes.subscribe(data => {
      this.contentGroupComponents = this.groups.toArray();
      this.resetTableHeader();
    });
  }
  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.resetTableHeader();
  }
}
