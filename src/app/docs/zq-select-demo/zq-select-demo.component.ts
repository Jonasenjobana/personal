import { Component, OnInit } from '@angular/core';
import { ZqSelectOption } from 'src/app/shared/module/select/type';

@Component({
  selector: 'zq-select-demo',
  templateUrl: './zq-select-demo.component.html',
  styleUrls: ['./zq-select-demo.component.less']
})
export class ZqSelectDemoComponent implements OnInit {
  option: ZqSelectOption[] = [
    {
      label: '选项A：这是老sadasdasd鼠',
      value: '1'
    },
    {
      label: '选项B：这是鸭asdasdddddddddddd子',
      value: '2'
    }
  ]
  title: string = ''
  constructor() { }

  ngOnInit(): void {
  }
  onSelectChange(item: ZqSelectOption[]) {
    this.title = JSON.stringify(item)
  }
}
