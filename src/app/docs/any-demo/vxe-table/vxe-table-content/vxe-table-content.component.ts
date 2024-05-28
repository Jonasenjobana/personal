import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, Optional, SimpleChanges } from '@angular/core';
import { VxeColumnComponent } from '../vxe-column/vxe-column.component';
import { VxeTableService } from '../vxe-table.service';
import { VxeColumnGroups, VxeRowConfig, VxeVirtualConfig } from '../vxe-model';
import { VxeTableComponent } from '../vxe-table/vxe-table.component';

@Component({
  selector: 'vxe-table-content',
  templateUrl: './vxe-table-content.component.html',
  styleUrls: ['./vxe-table-content.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VxeTableContentComponent {
  inData: any
  @Input() contentCol: VxeColumnComponent[]
  @Input() rowConfig: Partial<VxeRowConfig>
  @Input() virtualConfig: Partial<VxeVirtualConfig>
  @Input() transformX: number = 0
  isHover: boolean = false
  hoverIndex: number = -1;
  constructor(private vxeService: VxeTableService, @Optional() private parent: VxeTableComponent, private elementRef: ElementRef<HTMLDivElement>, private cdr: ChangeDetectorRef) {
    this.inData = vxeService.data
    vxeService.dataObserve.subscribe((data) => {
      this.inData = data;
    })
    this.vxeService.hoverIndex$.subscribe((idx) => {
      this.hoverIndex = idx;
      this.cdr.markForCheck();
    })
    // vxeService.tableHeaderColumn$.subscribe(columns => {
    //   this.columns = columns.filter(el => el.VXETYPE == 'vxe-column') as VxeColumnComponent[];
    // })
  }
  get componentHeight() {
    return this.elementRef.nativeElement.getBoundingClientRect().height;
  }
  ngOnChanges(changes: SimpleChanges) {
    const {rowConfig, virtualConfig} = changes;
    if (rowConfig && rowConfig.currentValue) {
      const {isHover = false} = this.rowConfig
      this.isHover = isHover;
    }
  }
  onMouseEnter(idx: number) {
    this.vxeService.hoverIndex$.next(idx);
    this.hoverIndex = idx;
  }
  onMouseLeave() {
    this.vxeService.hoverIndex$.next(-1);
    this.hoverIndex = -1;
  }
}
