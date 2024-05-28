import { VxeColumnGroupBase } from '../vxe-base/vxe-column-group';
import { VxeColumnComponent } from '../vxe-column/vxe-column.component';
import { VxeColumnGroups, VxeRowConfig, VxeVirtualConfig } from '../vxe-model';
import { VxeTableService } from './../vxe-table.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'vxe-fixed-column',
  templateUrl: './vxe-fixed-column.component.html',
  styleUrls: ['./vxe-fixed-column.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VxeFixedColumnComponent {
  @Input() rowConfig: Partial<VxeRowConfig>
  @Input() scrollLeft: number
  @Input() virtualConfig: Partial<VxeVirtualConfig>
  columns: VxeColumnGroupBase[] = [];
  content: VxeColumnComponent[] = [];
  get fixedColumn() {
    return this.vxeService.fixedColumn;
  }
  get containerHeight() {
    return this.vxeService.tableWrapperHeight || 0
  }
  ngOnChanges(changes: SimpleChanges) {
    const {scrollLeft} = changes;
    if (scrollLeft) {
      this.scrollLeft == 0;
    }
  }
  constructor(private vxeService: VxeTableService, private cdr: ChangeDetectorRef) {
  }
  ngAfterViewInit() {
    this.vxeService.tableColumn$.subscribe(columns => {
      this.columns = columns;
      this.cdr.detectChanges();
    })
    this.vxeService.tableHeaderColumn$.subscribe(columns => {
      this.content = columns as VxeColumnComponent[];
      this.cdr.detectChanges();
    })
  }
}
