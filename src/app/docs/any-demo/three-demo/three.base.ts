import { Directive, ElementRef, ViewChild } from "@angular/core";
import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from 'dat.gui';
@Directive()
export class ThreeBase {
    readonly canvasId: string = "three-base";
    tCamera: Three.Camera;
    tRender: Three.WebGLRenderer;
    tScene: Three.Scene;
    animeFlag: number;
    gui: dat.gui;
    @ViewChild('threeBase') threeBase: ElementRef<HTMLCanvasElement>;
    constructor() { 
        this.gui = new dat.GUI();
    }
    ngAfterViewInit() {
        this.initThree();
    }
    initThree() {
        const el = document.getElementById(this.canvasId)
        this.tRender = new Three.WebGLRenderer({
            canvas: el,
        });
        /**设置画布大小 */
        this.tRender.setSize(window.innerWidth, window.innerHeight);
        /**透视相机 */
        this.tCamera = new Three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.tScene = new Three.Scene();
        this.tScene.add(this.tCamera);
        /**控制器 */
        const control = new OrbitControls(this.tCamera, el);
        this.renderThree();
    }
    renderThree = () => {
        this.tRender.render(this.tScene, this.tCamera);
        this.renderCb();
        this.animeFlag = requestAnimationFrame(this.renderThree);
    }
    renderCb = () => {};
    ngOnDestroy() {
        this.animeFlag && cancelAnimationFrame(this.animeFlag);
    }
}