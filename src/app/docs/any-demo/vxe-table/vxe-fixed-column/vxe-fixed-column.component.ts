import { fromEvent } from 'rxjs';
import { VxeColumnGroupBase } from '../vxe-base/vxe-column-group';
import { VxeColumnComponent } from '../vxe-column/vxe-column.component';
import { VxeRowConfig, VxeVirtualConfig } from '../vxe-model';
import { VxeTableComponent } from '../vxe-table/vxe-table.component';
import { VxeTableService } from './../vxe-table.service';
import { ChangeDetectorRef, Component, ElementRef, Input, Optional, SimpleChanges, ViewChild } from '@angular/core';
import { VxeTableHeadComponent } from '../vxe-table-head/vxe-table-head.component';

/**不建议单独使用 捆绑vxe-table*/
@Component({
  selector: 'vxe-fixed-column',
  templateUrl: './vxe-fixed-column.component.html',
  styleUrls: ['./vxe-fixed-column.component.less']
})
export class VxeFixedColumnComponent {
  @Input() rowConfig: Partial<VxeRowConfig>;
  @Input() virtualConfig: Partial<VxeVirtualConfig>;
  @Input() contentHeight: number;
  @Input() inData: any;
  @Input() vxeWraperHeight: number;
  @Input() headCol: VxeColumnGroupBase[] = [];
  @ViewChild('leftFixedContent') leftFixedContentRef: ElementRef<HTMLDivElement>;
  @ViewChild('rightFixedContent') rightFixedContentRef: ElementRef<HTMLDivElement>;
  @ViewChild('rightHeadRef') rightHeadRef: VxeTableHeadComponent;
  content: VxeColumnComponent[] = [];
  scrollTop: number;
  scrollLeft: number;
  headWidth: number;
  get fixedColumn() {
    return this.vxeService.fixedColumn;
  }
  get gutterWidth() {
    return this.parent.gutterConfig.width;
  }
  constructor(
    private vxeService: VxeTableService,
    private cdr: ChangeDetectorRef,
    @Optional() private parent: VxeTableComponent
  ) {}

  ngAfterViewInit() {
    this.vxeService.scrollLeft$.subscribe(scrollLeft => {
      this.scrollLeft = scrollLeft;
    });
    this.vxeService.headWidth$.subscribe(width => {
      this.headWidth = width;
    });
    this.vxeService.tableHeaderLeafColumns$.subscribe(columns => {
      this.content = columns as VxeColumnComponent[];
    });
    this.asyncScroll();
  }
  /**同步滚动 */
  asyncScroll() {
    const rightEl = this.rightFixedContentRef?.nativeElement;
    const leftEl = this.leftFixedContentRef?.nativeElement;
    rightEl &&
      fromEvent(rightEl, 'scroll').subscribe(() => {
        const { scrollTop } = rightEl;
        this.vxeService.scrollTop$.next(scrollTop);
      });
    leftEl &&
      fromEvent(leftEl, 'scroll').subscribe(() => {
        const { scrollTop } = leftEl;
        this.vxeService.scrollTop$.next(scrollTop);
      });
  }
}
