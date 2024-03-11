import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[moveAnime]',
  
})
export class MoveAnimeDirective {
  @Input() targetEl?: HTMLDivElement;
  private el: HTMLDivElement;
  constructor(private elementRef: ElementRef, private render: Renderer2) {
    this.el = this.elementRef.nativeElement;
  }
  ngAfterViewInit() {
    this.move();
  }
  move() {
    if (!this.targetEl) return;
    const {left, top} = this.el.getBoundingClientRect();
    const {left: left2, top: top2} = this.targetEl.getBoundingClientRect();
    const offsetX = left2 - left + 6;
    const offsetY = top2 - top - 50;
    this.render.setStyle(this.el, 'transform', `translateX(${offsetX}px)`)
    this.render.setStyle(this.el.children[0], 'transform', `translateY(${offsetY}px)`)
  }
}
