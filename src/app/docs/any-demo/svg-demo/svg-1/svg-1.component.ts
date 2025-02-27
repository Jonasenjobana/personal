import { Component, ElementRef, ViewChild } from '@angular/core';
import { debounceTime, fromEvent, throttleTime } from 'rxjs';

@Component({
  selector: 'svg-1',
  templateUrl: './svg-1.component.html',
  styleUrls: ['./svg-1.component.less']
})
export class Svg1Component {
  @ViewChild('svgRef') svgRef: ElementRef<SVGElement>
  ngAfterViewInit() {
    const el = this.svgRef.nativeElement;
    fromEvent<MouseEvent>(el, 'mousemove').pipe(throttleTime(50)).subscribe((event: MouseEvent) => {
      const {x, y} = event
      
      const p = el.querySelector('#myPath') as SVGPathElement;
      let prev = p.getAttribute('d');
      if (!prev) {
        prev = `M ${x}, ${y}`;
      } else {
        prev = `${prev} L ${x},${y}`
      }
      p.setAttribute('d', prev)
      console.log(event,
        p.getAttribute('d')
      )
    });
  }
}
