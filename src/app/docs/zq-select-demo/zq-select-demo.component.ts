import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ZqSelectOption } from 'src/app/shared/module/select/type';
@Component({
  selector: 'zq-select-demo',
  templateUrl: './zq-select-demo.component.html',
  styleUrls: ['./zq-select-demo.component.less'],
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
    },
    {
      label: 'qqqqqqqqqqqq3333333333333',
      value: '3'
    },
    {
      label: 'qqqqqqqqqqqq4444444444444',
      value: '4'
    },
    {
      label: 'qqqqqqqqqqqq5555555555555',
      value: '5'
    },
    {
      label: 'qqqqqqqq66666666666',
      value: '6'
    },
    {
      label: 'qqqqqqq77777777',
      value: '7'
    },
    {
      label: 'qqqqqqqq888888',
      value: '8'
    }
  ]
  @Input() params: Partial<{options: any[]}> = {} 
  @Input() title: string = ''
  @Input() zqComponentParams = {
    params:  {},
    title:  ''
  }
  values: string[] = ['1','2','4','8']
  value: string = "1"
  @Output() titleChange: EventEmitter<string> = new EventEmitter()
  constructor() {
  
  }

  ngOnInit(): void { 
  }
  onSelectChange(item: ZqSelectOption[]) {
    this.title = JSON.stringify(item)
    this.zqComponentParams.title = JSON.stringify(item)
    this.params.options = item
    this.zqComponentParams.params = item
  }
  modelChange($event: any) {
    console.log(this.value, $event);
    
  }
  hidden: boolean = false

  data: any[] = [
    { id: '123', name: '张三', 'age': 18, 'address': '北京市朝阳区', 'sex': '男', num: '1', date: '2024-02-21', role:'管理' },
    { id: '4544', name: '里斯', 'age': 22, 'address': '北京市朝阳区' },    { id: '123', name: '张三', 'age': 18, 'address': '北京市朝阳区', 'sex': '男', num: '1', date: '2024-02-21', role:'管理' },
    { id: '4544', name: '里斯', 'age': 22, 'address': '北京市朝阳区' },    { id: '123', name: '张三', 'age': 18, 'address': '北京市朝阳区', 'sex': '男', num: '1', date: '2024-02-21', role:'管理' },
    { id: '4544', name: '里斯', 'age': 22, 'address': '北京市朝阳区' },    { id: '123', name: '张三', 'age': 18, 'address': '北京市朝阳区', 'sex': '男', num: '1', date: '2024-02-21', role:'管理' },
    { id: '4544', name: '里斯', 'age': 22, 'address': '北京市朝阳区' },    { id: '123', name: '张三', 'age': 18, 'address': '北京市朝阳区', 'sex': '男', num: '1', date: '2024-02-21', role:'管理' },
    { id: '4544', name: '里斯', 'age': 22, 'address': '北京市朝阳区' },    { id: '123', name: '张三', 'age': 18, 'address': '北京市朝阳区', 'sex': '男', num: '1', date: '2024-02-21', role:'管理' },
    { id: '4544', name: '里斯', 'age': 22, 'address': '北京市朝阳区' },
  ]
  data2: any[] = [
    { id: '111'}
  ]
  shows: boolean[] = [true, true, true, true, true, true, true,]
  ngAfterViewInit() {
    setTimeout(() => {
      this.hidden = true;
      new Array(1000).fill(1).forEach(() => {
        this.data.push({ id: '123', name: '张三', 'age': 18, 'address': '北京市朝阳区', 'sex': '男', num: '1', date: '2024-02-21', role:'管理' })
      })
      this.data = [...this.data]
    }, 3000);
  }
  onCheckChange($event) {
    console.log('外部',$event)
  }
  onButtonClick(row, col) {
    console.log(row, col);
    row.age = 100;
    console.log(this.data)
  }

}
