import { Component, ElementRef, ViewChild } from '@angular/core';
import { GridConfigData } from './grid.model';

@Component({
  selector: 'grid-demo',
  templateUrl: './grid-demo.component.html',
  styleUrls: ['./grid-demo.component.less']
})
export class GridDemoComponent {
  @ViewChild('containerRef', {static: true}) containerRef: ElementRef<HTMLDivElement>
  get gridConfig() {
    return GridConfigData
  }
  // 500px one cell
  ngOnInit() {
    const el = this.containerRef.nativeElement;
    // 中间平均分3份 最小不低于300px
    el.style['grid-template-columns'] = `minmax(500px, 1fr) repeat(3, minmax(500px, 1fr)) minmax(500px, 1fr)`;
    el.style['grid-template-rows'] = `minmax(500px, 1fr) repeat(auto-fill, minmax(500px, 1fr)) minmax(500px, 1fr)`;
  }
}
