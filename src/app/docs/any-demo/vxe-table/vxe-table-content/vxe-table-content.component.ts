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
import { VxeColumnGroup, VxeColumnGroups, VxeContentEvent, VxeData, VxeGutterConfig, VxeHeadEvent, VxeRowConfig, VxeTableModel, VxeTreeConfig, VxeVirtualConfig } from '../vxe-model';
import { VxeTableComponent } from '../vxe-table/vxe-table.component';
import { Subject, fromEvent, takeUntil, filter } from 'rxjs';
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
  @Input() treeConfig: Partial<VxeTreeConfig>;
  @Input() vData: VxeData[];
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
  /**vData 过滤后的树形数据 */
  treeData: VxeData[];
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
    this.vxeService.scrollTop$.subscribe(scrollTop => {
      this.onScroll(scrollTop);
    });
    this.vxeService.headEvent$.subscribe(($event: VxeHeadEvent) => {
      if (!this.fixed) {
        this.onHeadEvent($event)
      }
    })
    this.vxeService.contentEvent$.subscribe(($event: VxeContentEvent) => {
      const {type} = $event;
      if (type == 'expand') {
        this.treeData = this.vData.filter(item => item._parent ? item._parent._expanded && !item._parent._hidden : true);
      }
    })
  }
  onHeadEvent($event: VxeHeadEvent) {
    const {type, event, column} = $event;
    switch(type) {
      case 'checkbox':
        this.vData.forEach(element => {
          element._check = event
        });
        this.vxeService.contentEvent$.next({
          type: 'checkbox', column, event, row: column
        });
        break;
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    const { rowConfig, virtualConfig, vData, vxeWraperHeight, contentCol, treeConfig } = changes;
    if (rowConfig && rowConfig.currentValue) {
      const { isHover = false } = this.rowConfig;
      this.isHover = isHover;
    }
    if (vData) {
      !vData.firstChange && this.handleFixed();
      this.treeData = this.vData.filter(item => item._parent ? item._parent._expanded && !item._parent._hidden : true);
    }
    if (vxeWraperHeight && this.vxeWraperHeight) {
      this.updateDom();
    }
  }
  getSeqNumber(index: number, item: any) {
    if (this.tableModel == 'tree') {
      return index + 1;
    } else {
      return index + 1;
    }
  }
  expandNode(item: any, col: VxeColumnGroup) {
    item._expanded = !item._expanded;
    item._children.forEach(el => el._hidden = !item._expanded);
    this.vxeService.contentEvent$.next({
      type: 'expand',
      column: col,
      row: item,
      event: item._expanded
    })
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
  trackByFn(index: number, item: VxeData) {
    return item['id'];
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
  checkboxChange($event, col, item) {
    col.isCheck = false;
    this.vxeService.contentEvent$.next({
      type: 'checkbox',
      column: col,
      row: item,
      event: $event
    })
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
