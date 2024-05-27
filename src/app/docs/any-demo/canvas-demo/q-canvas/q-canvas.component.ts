import { Component, ElementRef, ViewChild } from '@angular/core';
import { QCanvas } from '../QCanvas/q-canvas';
import { QCanvasCircle } from '../QCanvas/model/element';

@Component({
  selector: 'q-canvas',
  templateUrl: './q-canvas.component.html',
  styleUrls: ['./q-canvas.component.less']
})
export class QCanvasComponent {
  @ViewChild('qCanvas') qCanvasRef!: ElementRef<HTMLCanvasElement>;
  qCanvas: QCanvas;
  constructor() {
    
  }
  ngAfterViewInit() {
    const el = this.qCanvasRef.nativeElement;
    this.qCanvas = new QCanvas(el);
    new QCanvasCircle([50, 50], 100)
  }
}
