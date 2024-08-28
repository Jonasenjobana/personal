import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'scroll',
  templateUrl: './scroll.component.html',
  styleUrls: ['./scroll.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScrollComponent {
  scrollIndex = 0;
  /**无缝滚动 */
  @Input() infinity: boolean = true
  /**更新插入数据 */
  @Input() updateList: any;
  /**初始化数据 */
  @Input() initList: any;
  /**行高度 */
  @Input() rowHeight: number = 32;
  @ViewChild('slScrollRef', { static: true}) slScrollRef: ElementRef<HTMLDivElement>;
  @ViewChild('scrollInfinity') scrollInfinity: ElementRef<HTMLDivElement>;
  translateY: number = 0;
  /**容器高度 */
  containerHeight!: number;
  constructor(private cdr: ChangeDetectorRef) {
  }
  ngOnInit() {
    const el = this.slScrollRef.nativeElement;
    const { height }= el.getBoundingClientRect();
    this.containerHeight = height;
  }
  ngOnChanges(changes: SimpleChanges) {
    const {updateList} = changes;
    if (updateList) {
      this.updateChange();
    }
  }
  updateChange() {
    
  }
}
