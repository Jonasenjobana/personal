import { Component, ElementRef, ViewChild } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';

@Component({
  selector: 'gsap-scroll',
  templateUrl: './gsap-scroll.component.html',
  styleUrls: ['./gsap-scroll.component.less']
})
export class GsapScrollComponent {
  constructor() {
    gsap.registerPlugin(ScrollTrigger);
  }
  @ViewChild('container', { static: true }) container: ElementRef<HTMLDivElement>;
  // @ViewChild('canvasRef') canvasRef: ElementRef<HTMLCanvasElement>
  ngOnInit() {}

  ngAfterViewInit() {
    const elements: HTMLDivElement[] = document.querySelectorAll('.square') as any;
    const tl = gsap.timeline({})
    tl.to('.ball', {
      duration: 2,
      left: '+=100',
      top: '+=100',
    }).from('.b2', {
      left: 0,
      top: 0
    },'>')
    const a = gsap.to(['.square', '.help'], {
      scrollTrigger: {
        trigger: '.home',
        start: 'top top', // 滚动至中间触发
        endTrigger: '.end',
        end: 'top bottom',
        scrub: 1,
        pin: true, // 固定窗口 固定一个背景不上下滚动
      },
      rotateZ: (index, target) => {
        return target.className == 'help' ? -1 *(index%10) * 36 : index * 36;
      },
    });
    gsap.to('.progress', {
      scrollTrigger: {
        trigger: '.content',
        scrub: true,
        markers: true,
        end: 'bottom bottom'
      },
      width: '100%'
    });
    // this.draw();
  }
  draw() {
    // const el = this.canvasRef.nativeElement;
    // const ctx = el.getContext('2d');
    // el.width = el.clientWidth;
    // el.height = el.clientHeight;
    // let param = {
    //   x: 0,
    //   y: 0,
    //   r: 0
    // }
    // gsap.to(param, {
    //   scrollTrigger: {
    //     scrub: true,
    //     trigger: '.content',
    //     onUpdate: () => {
    //       console.log(param)
    //       this.render(ctx, param);
    //     }
    //   },
    //   x: 600,
    //   y: 600,
    //   r: 100
    // })
  }
  render(ctx: CanvasRenderingContext2D, param: any) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.strokeStyle = '#000';
    ctx.fillStyle = '#f0f000';
    ctx.beginPath();
    ctx.arc(param.x, param.y, param.r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
  }
}
