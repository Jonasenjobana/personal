import { Component, ElementRef, EventEmitter, Output, QueryList, ViewChild, ViewChildren, inject } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import * as _ from 'lodash';
import { debounceTime, from, fromEvent, map, switchMap, takeUntil } from 'rxjs';
import { Platform } from '@angular/cdk/platform';
// 无限滚动菜单 demo
// 支持移动端滑动
@Component({
  selector: 'gsap-menu',
  templateUrl: './gsap-menu.component.html',
  styleUrls: ['./gsap-menu.component.less']
})
export class GsapMenuComponent {
  constructor() {
    document.body.style.fontSize = '1px';
    gsap.registerPlugin(ScrollTrigger);
    this.globalTimeline = gsap.timeline();
    console.log(inject(Platform), 'platform');
  }
  get isMobile() {
    const userAgent = navigator.userAgent;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  }
  public orderMenu: MenuItem[] = [
    {
      title: 'Abandon',
      className: 'a'
    },
    {
      title: 'Banana',
      className: 'b'
    },
    {
      title: 'Cat',
      className: 'c'
    },
    {
      title: 'Dog',
      className: 'd'
    },
    {
      title: 'Elephant'
    }
  ];
  @ViewChild('lineRef') lineRef: ElementRef<HTMLDivElement>;
  @ViewChild('scrollView') scrollView: ElementRef<HTMLDivElement>;
  config: MenuScrollConfig = {
    viewSize: [1200, 300],
    itemSize: [100, 70],
    centerSize: [
      [135, 100],
      [115, 88]
    ],
    space: 2
  };
  @ViewChildren('menuItem') menuItems: QueryList<ElementRef<HTMLDivElement>>;
  @Output() prevChange: EventEmitter<string> = new EventEmitter();
  @Output() nextChange: EventEmitter<string> = new EventEmitter();
  infinityFlag: number;
  lineTransformDelta: number = 0;
  currentCenterIdx: number = Math.floor((this.orderMenu.length * 3 - 1) / 2);
  globalTimeline: GSAPTimeline;
  // 1 left -1 right
  get lineMoveDelta() {
    return this.lineWidth / (this.orderMenu.length * 3);
  }
  ngOnInit() {
    this.orderMenu.forEach((el, idx) => {
      el.order = idx;
    });
  }
  get lineWidth() {
    return this.lineRef.nativeElement.getBoundingClientRect().width;
  }
  ngAfterViewInit() {
    this.initMenu();
    fromEvent<WheelEvent>(this.scrollView.nativeElement, 'mousewheel')
      .pipe(debounceTime(20))
      .subscribe($event => {
        const { deltaY } = $event;
        if (deltaY < 0) {
          this.next();
        } else {
          this.prev();
        }
      });
    const touchend$ = fromEvent(this.scrollView.nativeElement, 'touchend');
    touchend$.subscribe(e => {});
    fromEvent<TouchEvent>(this.scrollView.nativeElement, 'touchstart')
      .pipe(
        switchMap(start =>
          fromEvent<TouchEvent>(this.scrollView.nativeElement, 'touchmove').pipe(
            map(move => {
              move.preventDefault(); // 防止上下滚动
              console.log(move);
              return {
                startX: start.touches[0].clientX,
                startY: start.touches[0].clientY,
                endX: move.touches[0].clientX,
                endY: move.touches[0].clientY,
                deltaX: move.touches[0].clientX - start.touches[0].clientX,
                deltaY: move.touches[0].clientY - start.touches[0].clientY
              };
            }),
            takeUntil(touchend$)
          )
        )
      )
      .subscribe((e: CustomTouchEvent) => {
        this.globalTimeline.to(
          '.line',
          {
            x: e.deltaX
          },
          '<'
        );
      });
  }
  get centerIdx() {
    return Math.floor(this.orderMenu.length / 2);
  }
  get isLR() {
    return this.currentCenterIdx < this.orderMenu.length || this.currentCenterIdx > this.orderMenu.length * 2 - 1;
  }
  activeChange(item: MenuItem) {
    console.log('wtf');
    const currentCenterItem = this.orderMenu.find(el => el.order == this.centerIdx);
    let diff = currentCenterItem.order - item.order;
    this.orderMenu.forEach(el => {
      el.order = (el.order + diff + this.orderMenu.length) % this.orderMenu.length;
    });
    this.translateLineTo(diff);
  }
  caculateSize(item: MenuItem) {
    const { centerSize, itemSize } = this.config;
    const change = this.getScale(item.order);
    return {
      '--width': centerSize[0][0] + 'px',
      '--height': centerSize[0][1] + 'px',
      '--scaleX': change.scaleX,
      '--scaleY': change.scaleY
    };
  }
  // 设置到循环位置 实现循环滚动
  setInfinityScroll() {
    const orderlen = this.orderMenu.length;
    const lineCenterIdx = Math.floor((orderlen * 3) / 2);
    this.infinityFlag && cancelAnimationFrame(this.infinityFlag);
    this.infinityFlag = requestAnimationFrame(() => {
      // 到补充段附近
      if (this.isLR) {
        this.currentCenterIdx = (this.currentCenterIdx % orderlen) + orderlen;
        this.lineTransformDelta = (lineCenterIdx - this.currentCenterIdx) * this.lineMoveDelta;
        gsap.set('.line', {
          translateX: `${this.lineTransformDelta}px`
        });
      }
    });
  }
  setGsapAnime() {
    this.orderMenu.forEach(item => {
      item.elements?.forEach(el => {
        const change = this.getScale(item.order);
        this.globalTimeline.to(
          el,
          {
            ...change,
            duration: 0.5
          },
          '<'
        );
      });
    });
    this.globalTimeline.call(() => {
      this.setInfinityScroll();
    });
  }
  getScale(order: number) {
    const { centerSize } = this.config;
    if (order == this.centerIdx) {
      return {
        scaleX: '1',
        scaleY: '1'
      };
    } else if (Math.abs(order - this.centerIdx) <= centerSize.length - 1) {
      return {
        scaleX: `${centerSize[Math.abs(order - this.centerIdx)][0] / centerSize[0][0]}`,
        scaleY: `${centerSize[Math.abs(order - this.centerIdx)][1] / centerSize[0][1]}`
      };
    } else {
      return {
        scaleX: `${this.config.itemSize[0] / centerSize[0][0]}`,
        scaleY: `${this.config.itemSize[1] / centerSize[0][1]}`
      };
    }
  }
  // 获取当前视口显示最大数目 下一个或上一个会导致line暴露的情况
  get maxViewIndex() {
    const { viewSize } = this.config;
    // 一个视口最多显示
    const viewCount = Math.floor(viewSize[0] / this.lineMoveDelta);
    const show = (this.currentCenterIdx % this.orderMenu.length) - viewCount;
    return show < 0 ? true : false;
  }
  prev() {
    if (this.isLR && this.maxViewIndex) {
      return;
    }
    this.orderMenu.forEach(item => {
      item.order = (item.order - 1 + this.orderMenu.length) % this.orderMenu.length;
    });
    this.translateLineTo(-1);
  }

  next() {
    if (this.isLR && this.maxViewIndex) {
      return;
      // this.globalTimeline.clear();
    }
    this.orderMenu.forEach(item => {
      item.order = (item.order + 1 + this.orderMenu.length) % this.orderMenu.length;
    });
    this.translateLineTo(1);
  }
  translateLineTo(diff: number) {
    this.globalTimeline.clear();
    this.lineTransformDelta += this.lineMoveDelta * diff;
    this.globalTimeline.to(
      '.line',
      {
        translateX: `${this.lineTransformDelta}px`,
        duration: 0.5,
        ease: 'power1.inOut'
      },
      '<'
    );
    this.setGsapAnime();
    this.currentCenterIdx -= diff;
  }
  initMenu() {
    this.menuItems.forEach((el, idx) => {
      const orderIdx = idx % this.orderMenu.length;
      if (this.orderMenu[orderIdx].elements?.length > 0) {
        this.orderMenu[orderIdx].elements.push(el.nativeElement);
      } else {
        this.orderMenu[orderIdx].elements = [el.nativeElement];
      }
    });
  }
}
interface MenuItem {
  title: string;
  order?: number;
  className?: string;
  elements?: HTMLDivElement[]; // 按顺序
}
interface MenuScrollConfig {
  viewSize: [number, number]; // w h
  itemSize: [number, number]; // w h
  centerSize: [number, number][]; // w h 中心点左右 maybe有多个
  space: number;
}
interface CustomTouchEvent {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  prevX: number;
  prevY: number;
  deltaX: number;
  deltaY: number;
  isDown: boolean;
  isUp: boolean;
  isLeft: boolean;
  isRight: boolean;
}
