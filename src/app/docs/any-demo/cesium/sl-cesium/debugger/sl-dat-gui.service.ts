import { Injectable } from '@angular/core';
import * as Dat from 'dat.gui';
/**
 * gui工具 
 * TODO
*/
@Injectable({
  providedIn: 'root'
})
export class SlDatGuiService {
  gui: any;
  constructor() { }
  create() {
    this.gui = new Dat.GUI();
  }
  destroyed() {
    this.gui.destroy(); 
  }
}
