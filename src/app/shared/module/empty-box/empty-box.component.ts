import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'zq-empty-box',
  templateUrl: './empty-box.component.html',
  styleUrls: ['./empty-box.component.less']
})
export class EmptyBoxComponent implements OnInit {
  @Input() emptyTip: string = '暂无数据'
  constructor() { }

  ngOnInit(): void {
  }

}
