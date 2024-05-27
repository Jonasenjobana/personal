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
    const {width, height} = this.firework.nativeElement.getBoundingClientRect()
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    new FireworkControl(ctx);
  }
}
