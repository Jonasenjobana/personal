import { fromEvent } from 'rxjs';
import { VxeColumnGroupBase } from '../vxe-base/vxe-column-group';
import { VxeColumnComponent } from '../vxe-column/vxe-column.component';
import { VxeRowConfig, VxeVirtualConfig } from '../vxe-model';
import { VxeTableComponent } from '../vxe-table/vxe-table.component';
import { VxeTableService } from './../vxe-table.service';
import { ChangeDetectorRef, Component, ElementRef, Input, Optional, SimpleChanges, ViewChild } from '@angular/core';

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
  scrollTop: number;
  @ViewChild('leftFixedContent') leftFixedContentRef: ElementRef<HTMLDivElement>;
  @ViewChild('rightFixedContent') rightFixedContentRef: ElementRef<HTMLDivElement>;
  columns: VxeColumnGroupBase[] = [];
  content: VxeColumnComponent[] = [];
  scrollLeft: number;
  headWidth: number;
  get fixedColumn() {
    return this.vxeService.fixedColumn;
  }
  get gutterWidth() {
    return this.parent.gutterConfig.width;
  }
  ngOnChanges(changes: SimpleChanges) {
    const { scrollLeft, scrollTop } = changes;
  }
  constructor(
    private vxeService: VxeTableService,
    private cdr: ChangeDetectorRef,
    @Optional() private parent: VxeTableComponent
  ) {}

  ngAfterViewInit() {
    this.vxeService.scrollLeft$.subscribe(scrollLeft => {
      this.scrollLeft = scrollLeft;
      this.cdr.detectChanges();
    });
    this.vxeService.headWidth$.subscribe(width => {
      this.headWidth = width;
    });
    this.vxeService.tableColumn$.subscribe(columns => {
      this.columns = columns;
      this.cdr.detectChanges();
    });
    this.vxeService.tableHeaderColumn$.subscribe(columns => {
      this.content = columns as VxeColumnComponent[];
      this.cdr.detectChanges();
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
