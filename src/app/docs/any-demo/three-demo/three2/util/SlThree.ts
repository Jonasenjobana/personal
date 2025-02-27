import * as THREE from 'three';
import { TRender } from './tRender';
import { TScene } from './tScene';
export class SLThree {
  tRender: TRender;
  tScenes: TScene[];
  constructor() {
    this.tRender = new TRender();
    this.tScenes = [];
  }
  init(el) {
    this.tRender = new TRender();
  }
}
export interface SLThreeConfig {
  el: HTMLElement;
}
