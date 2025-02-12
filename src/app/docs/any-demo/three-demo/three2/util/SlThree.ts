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
  
}
export interface SLThreeConfig {
  el: HTMLElement;
}
