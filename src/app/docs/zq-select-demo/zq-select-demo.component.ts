import { ZqSelectOption } from './../../shared/types/types';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'zq-select-demo',
  templateUrl: './zq-select-demo.component.html',
  styleUrls: ['./zq-select-demo.component.less']
})
export class ZqSelectDemoComponent implements OnInit {
  option: ZqSelectOption[] = [
    {
      title: '选项A：这是老sadasdasd鼠'
    },
    {
      title: '选项B：这是鸭asdasdddddddddddd子'
    }
  ]
  title: string = ''
  constructor() { }

  ngOnInit(): void {
  }
  onSelectChange(item: ZqSelectOption[]) {
    this.title = item[0]?.title || 'null'
  }
}
