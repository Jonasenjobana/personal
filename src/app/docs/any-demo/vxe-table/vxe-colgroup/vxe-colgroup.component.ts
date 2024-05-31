import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  Inject,
  Input,
  Optional,
  QueryList,
  SimpleChanges,
  SkipSelf,
  TemplateRef,
  ViewChild,
  forwardRef
} from '@angular/core';
import { VxeTableService } from '../vxe-table.service';
import { VxeColumnComponent } from '../vxe-column/vxe-column.component';
import { VxeColumnGroup, VxeColumnGroups } from '../vxe-model';
import { VxeColumnGroupBase } from '../vxe-base/vxe-column-group';

@Component({
  selector: 'vxe-colgroup',
  templateUrl: './vxe-colgroup.component.html',
  styleUrls: ['./vxe-colgroup.component.less'],
})
export class VxeColgroupComponent extends VxeColumnGroupBase {
  readonly VXETYPE = 'vxe-colgroup';
  @ContentChildren(VxeColumnComponent) columns: QueryList<VxeColumnComponent>;
  @ContentChildren(VxeColgroupComponent) groups: QueryList<VxeColgroupComponent>;
  columnCount: number = 0;
  constructor(
    @Optional() protected override vxeService: VxeTableService,
    public override element: ElementRef,
    @Optional() @SkipSelf() public parent: VxeColgroupComponent,
    private cdr: ChangeDetectorRef
  ) {
    super(vxeService, element);
    if (!vxeService) Error('error: vxeService is null');
  }
  ngOnChanges(changes: SimpleChanges) {
    const { fixed, width, hidden } = changes;
    if (fixed && !fixed.isFirstChange()) {
      this.setFixedColumn();
    }
    if (width) {
      this.setWidth(this.width);
    }
    if (hidden) {
      this.vxeService.headUpdate$.next();
    }
  }
  ngAfterContentInit() {
    this.setFixedColumn();
    this.reset();
    this.columns.changes.subscribe(data => {
      this.reset();
    });
    this.groups.changes.subscribe(data => {
      this.reset();
    });
  }
  reset() {
    this.columnCount =
      this.columns.length +
      this.groups.reduce((count, el) => {
        return count + el.columnCount;
      }, 0);
    const columns = this.columns.toArray();
    const groups = this.groups.toArray();
    this.children = this.vxeService.getDomFlow([...groups, ...columns]);
    this.setWidth(this.width);
  }
  override setWidth(width: number = 0) {
    let childWidth = 0;
    this.children.forEach(el => {
      childWidth += el.componentWidth;
    });
    const currentWidth = this.vxeColumnTemplate?.elementRef.nativeElement.getBoundingClientRect().width || 0;
    this.componentWidth = Math.max(childWidth, width, currentWidth);
  }
}
