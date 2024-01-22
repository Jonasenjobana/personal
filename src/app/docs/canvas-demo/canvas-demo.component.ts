import { SlMapService } from './canvas/sl-map.service';
import { Component, OnInit, ViewChild, ElementRef, signal } from '@angular/core';
import * as L from 'leaflet';
import { LeafletCanvasLayer } from './canvas/leaflet-canvas';
import { CanvasBaseService } from './canvas/canvas-base.service';

@Component({
  selector: 'canvas-demo',
  templateUrl: './canvas-demo.component.html',
  styleUrls: ['./canvas-demo.component.less']
})
export class CanvasDemoComponent implements OnInit {
  constructor(private elementRef: ElementRef, private canvase_: CanvasBaseService, private map_: SlMapService) {}
  private canvasEle!: HTMLCanvasElement;
  map!: L.Map;
  buoyList: Buoy[] = [];
  ngOnInit(): void {
    // this.map_.initMap();
    // this.canvase_.getShipInfo().then((data: Buoy[]) => {
    //   this.buoyList = data;
    // });
    // this.map_.initMapSub$.subscribe(map => {
    //   this.map = map;
    // });
    let nameObj = signal({name: 'tst'})
    nameObj.set({name: '2'})
  }
  track() {
  }
  detail() {}
  ngAfterViewInit() {
    this.init()
  }
  init() {
    const canvasEle = document.querySelector('#cav') as HTMLCanvasElement;
    const pickEl = document.querySelector('#pick')as HTMLCanvasElement;
    const ratio = window.devicePixelRatio;
    const image = new Image(340, 340);
    const ctx = canvasEle.getContext('2d')!;
    const ctx2 = pickEl.getContext('2d')!;
    image.src = '/assets/images/1.jpg';
    image.onload = () => {
      ctx.drawImage(image, 0, 0);
      canvasEle.addEventListener('mousemove', e => {
        const { left, top } = canvasEle.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        const range = 50;
        ctx2.drawImage(canvasEle, 0, 0, 100, 100, x - 100, y - 100 ,x + 100, y + 100);
        pickEl.style.left =(x-range) + 'px';
        pickEl.style.top = (y-range) + 'px';
      });
    };
    canvasEle.width = ratio * 500;
    canvasEle.height = ratio * 500;
    canvasEle.style.width = '500px';
    canvasEle.style.height = '500px';
    pickEl.width = ratio * 100;
    pickEl.height = ratio * 100;
    pickEl.style.width = '100px';
    pickEl.style.height = '100px';
    ctx.strokeStyle = 'red';
    ctx.fillStyle = 'red';
    ctx.lineWidth = 1;
    ctx.imageSmoothingEnabled = false;
    ctx.arc(3.5, 3.5, 1, 0, Math.PI * 2);

    ctx.arc(0, 0, 1, 0, Math.PI * 2);
    // ctx.moveTo(2,2);
    // ctx.lineTo(4,4);
    ctx.fill();
    console.log(canvasEle);
    console.log(ctx.getImageData(0, 0, 3, 3));
  }
}
interface Buoy {
  latitude: number;
  longitude: number;
  aidsName: string;
  atonId: string;
}
