import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  Optional,
  Renderer2,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { VxeColumnComponent } from '../vxe-column/vxe-column.component';
import { VxeTableService } from '../vxe-table.service';
import { VxeColumnGroups, VxeGutterConfig, VxeRowConfig, VxeVirtualConfig } from '../vxe-model';
import { VxeTableComponent } from '../vxe-table/vxe-table.component';
import { fromEvent } from 'rxjs';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
  selector: 'vxe-table-content',
  templateUrl: './vxe-table-content.component.html',
  styleUrls: ['./vxe-table-content.component.less'],
  host: {
    '[class.vxe-table-content]': 'true',
    '[class.vxe-fixed-content]': `fixed == 'left' || fixed == 'right'`,
    '[class.vxe-content-left]': `fixed == 'left'`,
    '[class.vxe-content-right]': `fixed == 'right'`
  }
})
export class VxeTableContentComponent {
  @Input() fixed: 'left' | 'right';
  @Input() contentCol: VxeColumnComponent[];
  @Input() rowConfig: Partial<VxeRowConfig>;
  @Input() virtualConfig: Partial<VxeVirtualConfig>;
  @Input() transformX: number = 0;
  @Input() inData: any;
  @Input() vxeWraperHeight: number;
  @Input() minHeight: number
  @Input() maxHeight: number
  @ViewChild('virtualContent') set virtualContent(ref: CdkVirtualScrollViewport) {
    if (!ref) return;
    this.virtualContentRef = ref;
    this.addScrollEvent();
    this.initVirtual();
  };
  @ViewChild('vxeTable') vxeTable: ElementRef<HTMLTableElement>;
  private virtualContentRef: CdkVirtualScrollViewport
  get gutterConfig(): VxeGutterConfig {
    return this.vxeService.gutterConfig;
  }
  isHover: boolean = false;
  get isVirtual() {
    return !!this.virtualConfig;
  }
  hoverIndex: number = -1;
  headHeight: number = 0;
  headWidth: number = 0;
  gutterHeight: number = 0;
  contentHeight: number = 0;
  constructor(
    private vxeService: VxeTableService,
    @Optional() private parent: VxeTableComponent,
    private elementRef: ElementRef<HTMLDivElement>,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2
  ) {
    this.vxeService.hoverIndex$.subscribe(idx => {
      this.hoverIndex = idx;
    });
    this.vxeService.headHeight$.subscribe(height => {
      this.headHeight = height;
    });
    this.vxeService.headWidth$.subscribe(width => {
      this.headWidth = width;
    });
    this.vxeService.scrollTop$.subscribe(scrollTop => {
      this.onScroll(scrollTop);
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    const { rowConfig, virtualConfig, inData, vxeWraperHeight } = changes;
    if (rowConfig && rowConfig.currentValue) {
      const { isHover = false } = this.rowConfig;
      this.isHover = isHover;
    }
    if (inData && !inData.firstChange) {
      this.initVirtual();
    }
    if (vxeWraperHeight && this.vxeWraperHeight) {
      this.updateDom();
    }
  }
  /**滚动同步处理 */
  addScrollEvent() {
    /**非虚拟滚动监听 */
    if (!this.isVirtual) {
      const el = this.elementRef.nativeElement;
      fromEvent(el, 'scroll').subscribe(() => {
        const { scrollLeft, scrollTop } = el;
        this.vxeService.scrollTop$.next(scrollTop);
        !this.fixed && this.vxeService.scrollLeft$.next(scrollLeft);
      });
    } else {
      this.virtualContentRef.elementScrolled().subscribe(e => {
        const { scrollLeft, scrollTop } = e.target as HTMLElement;
        !this.fixed && this.vxeService.scrollLeft$.next(scrollLeft);
        this.vxeService.scrollTop$.next(scrollTop);
      });
    }
  }
  onScroll(scrollTop: number) {
    /**非虚拟滚动监听 */
    if (!this.isVirtual) {
      const el = this.elementRef.nativeElement;
      el.scrollTo({ top: scrollTop });
    } else {
      this.virtualContentRef.scrollTo({ top: scrollTop });
    }
  }
  ngAfterViewInit() {
  }
  updateDom() {
    const {height} = this.gutterConfig
    const el = this.elementRef.nativeElement;
    const gutter = this.fixed ? height : 0;
    this.contentHeight = this.vxeWraperHeight - this.headHeight - gutter;
    this.renderer.setStyle(el, 'height', this.contentHeight + 'px');
  }
  initVirtual() {
    if (!this.isVirtual) return;
    if (this.fixed == 'right') {
      const virtualEl = this.virtualContentRef.elementRef.nativeElement;
      virtualEl.scrollLeft = virtualEl.scrollWidth - virtualEl.clientWidth;
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
