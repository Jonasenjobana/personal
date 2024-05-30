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
import { VxeColumnGroups, VxeGutterConfig, VxeRowConfig, VxeTableModel, VxeVirtualConfig } from '../vxe-model';
import { VxeTableComponent } from '../vxe-table/vxe-table.component';
import { Subject, fromEvent, takeUntil } from 'rxjs';
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
  @Input() inData: any;
  @Input() vxeWraperHeight: number;
  @Input() minHeight: number;
  @Input() maxHeight: number;
  @Input() tableModel: VxeTableModel;
  @ViewChild('virtualContent', { static: false }) set virtualContent(ref: CdkVirtualScrollViewport) {
    if (!ref) return;
    this.virtualContentRef = ref;
    this.addScrollEvent();
    this.handleFixed();
  }
  @ViewChild('vxeTable', { static: false }) vxeTable: ElementRef<HTMLTableElement>;
  get gutterConfig(): VxeGutterConfig {
    return this.vxeService.gutterConfig;
  }
  isHover: boolean = false;
  get isVirtual() {
    return !!this.virtualConfig;
  }
  virtualContentRef: CdkVirtualScrollViewport;
  hoverIndex: number = -1;
  headHeight: number = 0;
  headWidth: number = 0;
  gutterHeight: number = 0;
  contentHeight: number = 0;
  transformX: number = 0;
  destroy$: Subject<void> = new Subject();
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
    const { rowConfig, virtualConfig, inData, vxeWraperHeight, contentCol } = changes;
    if (rowConfig && rowConfig.currentValue) {
      const { isHover = false } = this.rowConfig;
      this.isHover = isHover;
    }
    if (inData && !inData.firstChange) {
      this.handleFixed();
    }
    if (vxeWraperHeight && this.vxeWraperHeight) {
      this.updateDom();
    }
  }
  /**滚动同步处理 */
  addScrollEvent() {
    this.destroy$.next();
    /**非虚拟滚动监听 */
    if (!this.isVirtual) {
      const el = this.elementRef.nativeElement;
      fromEvent(el, 'scroll')
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          const { scrollLeft, scrollTop } = el;
          this.vxeService.scrollTop$.next(scrollTop);
          !this.fixed && this.vxeService.scrollLeft$.next(scrollLeft);
        });
    } else {
      this.virtualContentRef
        ?.elementScrolled()
        .pipe(takeUntil(this.destroy$))
        .subscribe(e => {
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
    setTimeout(() => {
      this.addScrollEvent();
      this.handleFixed();
    }, 100);
  }
  updateDom() {
    const { height } = this.gutterConfig;
    const el = this.elementRef.nativeElement;
    const gutter = this.fixed ? height : 0;
    this.contentHeight = this.vxeWraperHeight - this.headHeight - gutter;
    this.renderer.setStyle(el, 'height', this.contentHeight + 'px');
  }
  handleFixed() {
    if (this.fixed != 'right') return;
    if (!this.isVirtual) {
      const { width } = this.vxeTable.nativeElement.getBoundingClientRect();
      const { width: containerWidth } = this.elementRef.nativeElement.getBoundingClientRect();
      this.transformX = containerWidth - width;
    } else {
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
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
