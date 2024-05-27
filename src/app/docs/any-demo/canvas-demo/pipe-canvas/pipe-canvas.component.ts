import { Component, ElementRef, ViewChild } from '@angular/core';
import { Canvas } from '@antv/g';
import { Renderer } from '@antv/g-canvas';
import { Pipe, PipeControl } from './pipe.model';

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
  @ViewChild('pipe', { static: false }) pipeRef: ElementRef<HTMLCanvasElement>
  ngAfterViewInit() {
    const canvas = this.pipeRef.nativeElement;
    canvas.height = 937
    canvas.width = 1920
    const ctx = canvas.getContext('2d');
    let currentPipe = [];
    let clickOne = false,clickTwice = false;
    let prev: [number, number] | [] = [];
    const pipeControl = new PipeControl(ctx);
    canvas.addEventListener('click', (e) => {
      const {offsetX, offsetY} = e
      if (!clickOne) {
        clickOne = true;
        prev = [offsetX, offsetY];
      } else {
        clickTwice = true;
      }
      if (clickTwice) {
        clickOne = false;
        clickTwice = false;
        pipeControl.pushPipe(new Pipe(prev as [number, number], [offsetX, offsetY]))
        prev = [];
      }
    })
  }
}
