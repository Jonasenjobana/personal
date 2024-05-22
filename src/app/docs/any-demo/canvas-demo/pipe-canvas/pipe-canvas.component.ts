import { Component, ElementRef, ViewChild } from '@angular/core';
import { Canvas } from '@antv/g';
import { Renderer } from '@antv/g-canvas';

@Component({
  selector: 'pipe-canvas',
  templateUrl: './pipe-canvas.component.html',
  styleUrls: ['./pipe-canvas.component.less']
})
export class PipeCanvasComponent {
  constructor() {
    
  }
  canvas: Canvas
  pipeEl: HTMLDivElement
  @ViewChild('pipe', { static: false }) set pipeRef(value: ElementRef<HTMLDivElement>) {
    this.pipeEl = value.nativeElement;
    const {width, height} = this.pipeEl.getBoundingClientRect();
    this.canvas = new Canvas({
      container: this.pipeEl,
      width,
      height,
      renderer: new Renderer()
    })
  }
}
