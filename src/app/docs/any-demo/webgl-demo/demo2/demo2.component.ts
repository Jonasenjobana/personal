import { Component, ElementRef, ViewChild } from '@angular/core';
import * as dat from 'dat.gui';
import { SquareGL } from '../entity/square';
import { LetterF } from '../entity/letterF';
import { ShipGl } from '../entity/ship';
@Component({
  selector: 'demo2',
  templateUrl: './demo2.component.html',
  styleUrls: ['./demo2.component.less']
})
export class Demo2Component {
  @ViewChild('gl', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  constructor() {}
  gl: WebGL2RenderingContext;
  gui: any = new dat.GUI();
  entitys: any[] = [];
  ngAfterViewInit() {
    this.initGL();
    this.setPrograms();
    this.draw();
  }
  initGL() {
    const el = this.canvas.nativeElement;
    const { clientWidth, clientHeight } = el;
    (el.width = clientWidth), (el.height = clientHeight);
    this.gl = el.getContext('webgl2');
  }
  setPrograms() {
    this.ship();
    // this.letterF();
    this.square();
  }
  letterF() {
    const f = new LetterF(this.gl, this.gui)
    this.entitys.push(f);
  }
  square() {
    const s = new SquareGL(this.gl, this.gui);
    this.entitys.push(s)
  }
  ship() {
    const s2 = new ShipGl(this.gl);
    s2.setData([]);
    this.entitys.push(s2);
  }
  draw() {
    this.entitys.forEach(e => {
      e.draw();
    })
    requestAnimationFrame(() => {
      this.draw();
    })
  }
}
