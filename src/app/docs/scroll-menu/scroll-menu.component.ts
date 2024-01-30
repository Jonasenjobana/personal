import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
/**
 * in-center 动态
 * center
 * out-center 动态
 */
@Component({
  selector: 'scroll-menu',
  templateUrl: './scroll-menu.component.html',
  styleUrls: ['./scroll-menu.component.less'],
  animations: [
    trigger('listAnimation', [
      transition(':enter, * => 0, * => -1', []),
      transition(':increment', [
        query(
          ':enter',
          [
            style({ opacity: 0, width: 0 }),
            stagger(50, [animate('300ms ease-out', style({ opacity: 1, width: '*' }))])
          ],
          { optional: true }
        )
      ]),
      transition(':decrement', [
        query(':leave', [stagger(50, [animate('300ms ease-out', style({ opacity: 0, width: 0 }))])])
      ])
    ]),
    trigger('queryAnimation', [
      transition('* => goAnimate', [
        // hide the inner elements
        query('h1', style({ opacity: 0 })),
        query('.content', style({ opacity: 0 })),

        // animate the inner elements in, one by one
        query('h1', animate(1000, style({ opacity: 1 }))),
        query('.content', animate(1000, style({ opacity: 1 })))
      ])
    ])
  ]
})
export class ScrollMenuComponent implements OnInit {
  readonly centerIndex: number = 1;
  menus: Menu[] = [
    {
      id: Math.random(),
      title: '首页'
    },
    {
      id: Math.random(),
      title: 'A'
    },
    {
      id: Math.random(),
      title: 'B'
    },
    {
      id: Math.random(),
      title: 'C'
    },
    {
      id: Math.random(),
      title: 'D'
    }
  ];
  waitingQueue: Menu[] = [];
  currentQueue: Menu[] = [];
  items: number[] = [];
  exp = '';

  goAnimate() {
    this.exp = 'goAnimate';
  }
  showItems() {
    this.items = [0, 1, 2, 3, 4];
  }

  hideItems() {
    this.items = [];
  }

  toggle() {
    this.goAnimate();
    this.items.length ? this.hideItems() : this.showItems();
  }
  constructor() {}
  ngOnInit() {
    console.log('scroll component init');
  }
  flag = true;
  move() {
    this.menus[2].className = this.flag ? 'center-out' : '';
    this.menus[3].className = this.flag ? 'center-in' : '';
    this.flag = !this.flag;
    console.log(this.menus, '=============');
  }
  getMenuClass(item: Menu) {
    console.log(';===');

    return [item?.className || ''];
  }
  ngDoCheck() {
    console.log('chhchcch');
  }
}
interface Menu {
  title: string;
  id: number;
  className?: string;
}
