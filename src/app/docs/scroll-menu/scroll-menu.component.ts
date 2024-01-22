import { Component, OnInit } from '@angular/core';
/**
 * in-center 动态
 * center
 * out-center 动态
 */
@Component({
  selector: 'scroll-menu',
  templateUrl: './scroll-menu.component.html',
  styleUrls: ['./scroll-menu.component.less']
})
export class ScrollMenuComponent implements OnInit {
  readonly centerIndex: number = 1
  menus: Menu[] = [
    {
      id: Math.random(),
      title: '首页'
    },
    {
      id: Math.random(),
      title: 'A',
    },
    {
      id: Math.random(),
      title: 'B',
    },  {
      id: Math.random(),
      title: 'C'
    },  {
      id: Math.random(),
      title: 'D'
    },
  ]
  waitingQueue: Menu[] = [];
  currentQueue: Menu[] = [];
  constructor() {

  }
  ngOnInit() {
    console.log('scroll component init');
    
  }
  flag = true
  move() {
    this.menus[2].className = this.flag ? 'center-out' : ''
    this.menus[3].className = this.flag ? 'center-in' : ''
    this.flag = !this.flag
    console.log(this.menus,'=============');
    
  }
  getMenuClass(item: Menu) {
    console.log(';===');
    
    return [item?.className || '']
  }
  ngDoCheck() {
    console.log('chhchcch');
    
  }
}
interface Menu {
  title: string
  id: number
  className?: string
}