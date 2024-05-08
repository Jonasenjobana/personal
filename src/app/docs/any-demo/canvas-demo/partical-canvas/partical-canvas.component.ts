import { Component, ElementRef, ViewChild } from '@angular/core';
import { Firework, FireworkControl } from './partical.model';

@Component({
  selector: 'partical-canvas',
  templateUrl: './partical-canvas.component.html',
  styleUrls: ['./partical-canvas.component.less']
})
export class ParticalCanvasComponent {
  @ViewChild('firework') firework!: ElementRef<HTMLCanvasElement>;

  constructor() {}
  ngAfterViewInit() {
    const canvas = this.firework.nativeElement;
    canvas.width = 700;
    canvas.height = 920;
    const ctx = canvas.getContext('2d');
    new FireworkControl(ctx);
  }
}
