import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  Injector,
  Input,
  Optional,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { VxeTableService } from '../vxe-table.service';
import { VxeColgroupComponent } from '../vxe-colgroup/vxe-colgroup.component';
import { VxeColumnGroupBase } from '../vxe-base/vxe-column-group';
import { VxeTableComponent } from '../vxe-table/vxe-table.component';

@Component({
  selector: 'vxe-column',
  templateUrl: './vxe-column.component.html',
  styleUrls: ['./vxe-column.component.less'],
})
export class VxeColumnComponent extends VxeColumnGroupBase {
  readonly VXETYPE = 'vxe-column';
  @Input() type: 'checkbox' | 'seq' | 'radio';
  @Input() sortable: boolean;
  @Input() sortRuleCb?: (field: string, data: any) => number;
  @ContentChild('rowTemplate') vxeRowTemplate: TemplateRef<any>;
  asce: boolean = true; // 升序 true 降序 false
  isCheck: boolean = false;
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
    const { fixed, width, hidden, treeNode } = changes;
    if (fixed) {
      setTimeout(() => {
        this.setFixedColumn();
      });
    }
    if (width) {
      this.setWidth();
    }
    if (hidden) {
      this.vxeService.headUpdate$.next();
    }
  }
  sortStatusChange() {
    this.asce = !this.asce;
  }
  override ngAfterViewInit() {
    super.ngAfterViewInit();
    this.setWidth();
  }
  checkboxChange($event) {
    this.vxeService.headEvent$.next({type: 'checkbox', column: this, event: $event})
  }
  override setWidth(width: number = 0) {
    // const currentWidth = this.vxeColumnTemplate?.elementRef.nativeElement.getBoundingClientRect().width || 0
    this.componentWidth = Math.max(width, 1);
  }
}
