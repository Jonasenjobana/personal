import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ScaleElement } from 'src/app/shared/utils/scale';

@Component({
  selector: 'app-zq-button-demo',
  templateUrl: './zq-button-demo.component.html',
  styleUrls: ['./zq-button-demo.component.less']
})
export class ZqButtonDemo implements OnInit {
  @ViewChild('test') testRef: ElementRef<HTMLDivElement>
  constructor() { }

  ngOnInit(): void {
  }
  buttonClick(type: string) {
    // window.alert(`btn type:${type}`)
  }
  ngAfterViewInit() {
    new ScaleElement({
      el: this.testRef.nativeElement,
      dragable: true
    })
  }
}
