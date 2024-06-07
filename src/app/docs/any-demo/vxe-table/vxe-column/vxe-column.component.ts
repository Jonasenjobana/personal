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
  @Input() rowTemplate: TemplateRef<any>;
  @Input() sortRuleCb?: (field: string, data: any) => number;
  @ContentChild('rowTemplate') contentRowTemplate: TemplateRef<any>
  vxeRowTemplate: TemplateRef<any>
  asce: boolean = true; // 升序 true 降序 false
  isCheck: boolean = false;
  constructor(
    @Optional() protected vxeService: VxeTableService,
    private cdr: ChangeDetectorRef,
    public override element: ElementRef
  ) {
    super(element);
    if (!vxeService) Error('error: vxeService is null');
  }
  ngOnChanges(changes: SimpleChanges) {
    const { fixed, hidden, rowTemplate } = changes;
    if (fixed) {
      setTimeout(() => {
        this.setFixedColumn();
      });
    }
    if (hidden) {
      this.vxeService.headUpdate$.next();
    }
    if (rowTemplate && rowTemplate.currentValue) {
      this.vxeRowTemplate = this.rowTemplate;
      // this.vxeService.tableUpdate$.next();
    }
  }
  setFixedColumn() {
    this.fixed && this.vxeService.addFixed(this.fixed, this);
  }
  sortStatusChange() {
    this.asce = !this.asce;
  }
  /**模板优先级大于 投影 大于 默认 */
  override ngAfterViewInit() {
    super.ngAfterViewInit();
    this.vxeRowTemplate = this.rowTemplate || this.contentRowTemplate;
  }
  checkboxChange($event) {
    this.vxeService.headEvent$.next({type: 'checkbox', column: this, event: $event})
  }
}
