import { Directive, ElementRef, Input, SimpleChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: 'span[zqIcon],i[zqIcon]',
  host: {
    class: 'zq-icon',
    '[class.zq-icon-sm]': "iconSize === 'sm'",
    '[class.zq-icon-lg]': "iconSize === 'lg'"
  }
})
export class IconDirective {
  @Input() set zqIcon(value) {
    this._zqIcon = 'icon-' + value;
  }
  get zqIcon() {
    return this._zqIcon;
  }
  @Input() right: number = 5;
  @Input() iconSize: 'sm' | 'lg' = 'sm';
  _zqIcon: string = '';
  constructor(private elementRef: ElementRef, private render: Renderer2) {}
  ngOnChanges(changes: SimpleChanges) {
    const { zqIcon, right } = changes;
    if ((zqIcon && !zqIcon.firstChange) || (right && !right.isFirstChange)) {
      this.renderIcon();
    }
  }
  ngAfterViewInit() {
    this.renderIcon();
  }
  renderIcon() {
    const element = this.elementRef.nativeElement;
    if (!element) return;
    this.render.addClass(element, `${this.zqIcon}`);
    this.render.setStyle(element, 'right', this.right + 'px');
  }
}
