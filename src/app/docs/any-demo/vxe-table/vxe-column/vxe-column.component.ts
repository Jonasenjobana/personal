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
    vxeService.dataChange$.subscribe(data => {
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    const { fixed, width, hidden } = changes;
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
  ngAfterViewInit() {
    this.setWidth();
  }
  override setWidth(width: number = 0) {
    // const currentWidth = this.vxeColumnTemplate?.elementRef.nativeElement.getBoundingClientRect().width || 0
    this.componentWidth = Math.max(width, 1);
  }
}
