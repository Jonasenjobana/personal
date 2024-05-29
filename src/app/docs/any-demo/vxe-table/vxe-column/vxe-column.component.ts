import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  Input,
  Optional,
  SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { VxeTableService } from '../vxe-table.service';
import { VxeColgroupComponent } from '../vxe-colgroup/vxe-colgroup.component';
import { VxeColumnGroupBase } from '../vxe-base/vxe-column-group';

@Component({
  selector: 'vxe-column',
  templateUrl: './vxe-column.component.html',
  styleUrls: ['./vxe-column.component.less'],
})
export class VxeColumnComponent extends VxeColumnGroupBase {
  readonly VXETYPE = 'vxe-column';
  @Input() type: 'checkbox' | 'seq' | 'radio' | 'expand';
  @Input() sortable: boolean;
  @Input() sortRuleCb?: (field: string, data: any) => number;
  asce: boolean = true; // 升序 true 降序 false
  @ContentChild(TemplateRef) template: TemplateRef<any>;
  isCheck: boolean = false;
  constructor(
    @Optional() protected override vxeService: VxeTableService,
    public override element: ElementRef,
    @Optional() public parent: VxeColgroupComponent,
    private cdr: ChangeDetectorRef
  ) {
    super(vxeService, element);
    if (!vxeService) Error('error: vxeService is null');
    vxeService.dataObserve.subscribe(data => {
      this.cdr.markForCheck();
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    const { fixed, width } = changes;
    if (fixed) {
      requestAnimationFrame(() => {
        this.setFixedColumn();
      });
    }
    if (width) {
      this.setWidth();
    }
  }
  sortStatusChange() {
    this.asce = !this.asce;
  }
  ngAfterViewInit() {
    this.setWidth();
  }
  override setWidth(width: number = 0) {
    // const currentWidth = this.vxeColumnTemplate?.elementRef.nativeElement.getBoundingClientRect().width || 0
    this.componentWidth = Math.max(width, 1);
    this.cdr.markForCheck();
  }
}
