import { Directive, ElementRef } from '@angular/core';
import { int } from 'three/examples/jsm/nodes/Nodes';

@Directive({
  selector: '[gridItem]'
})
export class GridItemDirective {

  constructor(private elementRef: ElementRef<HTMLElement>) { }
  ngOnInit() {
    const {width, height} = this.elementRef.nativeElement.getBoundingClientRect();
  }
  get boundRect() {
    return this.elementRef.nativeElement.getBoundingClientRect();
  }
  get gridSize() {
    const {width} = this.boundRect;
    if (width <= 200) {
      return 'sm'
    } else if (width <= 400) {
      return 'md'
    } else {
      return 'lg'
    }
  }
}