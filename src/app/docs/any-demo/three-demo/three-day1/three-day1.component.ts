import { Component, Renderer2 } from '@angular/core';
import gsap from 'gsap';
import { AxesHelper, BoxGeometry, BufferGeometry, Clock, Line, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
@Component({
  selector: 'three-day1',
  templateUrl: './three-day1.component.html',
  styleUrls: ['./three-day1.component.less']
})
export class ThreeDay1Component {
  constructor(private renderer: Renderer2) {}
  ngAfterViewInit() {
    this.create();
  } 
  create() {
    const canvas = this.renderer.selectRootElement('.three')
    const scene = new Scene();
    const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    scene.add(camera);
    const gemotroy = new BoxGeometry(1, 1, 1);
    const material = new MeshBasicMaterial({color: 0x00ff00});
    const cube = new Mesh(gemotroy, material)
    scene.add(cube)
    camera.position.z = 5;
    const render = new WebGLRenderer({canvas});
    // const points = []; points.push( new Vector3( - 10, 0, 0 ) ); points.push( new Vector3( 0, 10, 0 ) ); points.push( new Vector3( 10, 0, 0 ) ); const geometry = new BufferGeometry().setFromPoints( points );
    // const line = new Line( geometry, material );
    // scene.add( line ); 
    render.setSize(window.innerWidth, window.innerHeight);
    // camera.position.set( 0, 0, 100 ); camera.lookAt( 0, 0, 0 );
    const controls = new OrbitControls(camera, canvas);
    const clock = new Clock();
    const helper = new AxesHelper(5);
    scene.add(helper);
    // cube.scale.set(2,2,2);
    cube.rotation.set(Math.PI/4,0,0);
    gsap.to(cube.rotation, {y: Math.PI * 2, duration: 5, ease: 'none', repeat: -1})
    function anime() {
      render.render(scene, camera)
      requestAnimationFrame(anime);
    }
    anime();
  }
}
