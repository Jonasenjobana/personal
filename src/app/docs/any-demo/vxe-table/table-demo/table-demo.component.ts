import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'table-demo',
  templateUrl: './table-demo.component.html',
  styleUrls: ['./table-demo.component.less']
})
export class TableDemoComponent {
  hidden: boolean = false
  constructor() {

  }
  data: any[] = [
    { id: '123', name: '张三', 'age': 18, 'address': '北京市朝阳区', 'sex': '男', num: '1', date: '2024-02-21', role:'管理' },
    { id: '4544', name: '里斯', 'age': 22, 'address': '北京市朝阳区' },    { id: '123', name: '张三', 'age': 18, 'address': '北京市朝阳区', 'sex': '男', num: '1', date: '2024-02-21', role:'管理' },
    { id: '4544', name: '里斯', 'age': 22, 'address': '北京市朝阳区' },    { id: '123', name: '张三', 'age': 18, 'address': '北京市朝阳区', 'sex': '男', num: '1', date: '2024-02-21', role:'管理' },
    { id: '4544', name: '里斯', 'age': 22, 'address': '北京市朝阳区' },    { id: '123', name: '张三', 'age': 18, 'address': '北京市朝阳区', 'sex': '男', num: '1', date: '2024-02-21', role:'管理' },
    { id: '4544', name: '里斯', 'age': 22, 'address': '北京市朝阳区' },    { id: '123', name: '张三', 'age': 18, 'address': '北京市朝阳区', 'sex': '男', num: '1', date: '2024-02-21', role:'管理' },
    { id: '4544', name: '里斯', 'age': 22, 'address': '北京市朝阳区' },    { id: '123', name: '张三', 'age': 18, 'address': '北京市朝阳区', 'sex': '男', num: '1', date: '2024-02-21', role:'管理' },
    { id: '4544', name: '里斯', 'age': 22, 'address': '北京市朝阳区' },
  ]
  ngAfterViewInit() {
    setTimeout(() => {
      this.hidden = true;
      // new Array(1000).fill(1).forEach(() => {
      //   this.data.push({ id: '123', name: '张三', 'age': 18, 'address': '北京市朝阳区', 'sex': '男', num: '1', date: '2024-02-21', role:'管理' })
      // })
    }, 3000);
  }
  onCheckChange($event) {
    
  }
  onButtonClick(row, col) {
    console.log(row, col);
    row.age = 100;
    console.log(this.data)
  }
  onSubmit(form: NgForm) {
    console.log(form)
  }
}
