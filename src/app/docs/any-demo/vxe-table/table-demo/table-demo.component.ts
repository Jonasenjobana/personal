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
  data2: any[] = [
    { id: 10000, parentId: null, name: 'Test1', type: 'mp3', size: 1024, date: '2020-08-01' },
    { id: 10050, parentId: null, name: 'Test2', type: 'mp4', size: 0, date: '2021-04-01' },
    { id: 24300, parentId: 10050, name: 'Test3', type: 'avi', size: 1024, date: '2020-03-01' },
    { id: 20045, parentId: 24300, name: 'Test4', type: 'html', size: 600, date: '2021-04-01' },
    { id: 10053, parentId: 24300, name: 'Test5', type: 'avi', size: 0, date: '2021-04-01' },
    { id: 24330, parentId: 10053, name: 'Test6', type: 'txt', size: 25, date: '2021-10-01' },
    { id: 21011, parentId: 10053, name: 'Test7', type: 'pdf', size: 512, date: '2020-01-01' },
    { id: 22200, parentId: 10053, name: 'Test8', type: 'js', size: 1024, date: '2021-06-01' },
    { id: 23666, parentId: null, name: 'Test9', type: 'xlsx', size: 2048, date: '2020-11-01' },
    { id: 23677, parentId: 23666, name: 'Test10', type: 'js', size: 1024, date: '2021-06-01' },
    { id: 23671, parentId: 23677, name: 'Test11', type: 'js', size: 1024, date: '2021-06-01' },
    { id: 23672, parentId: 23677, name: 'Test12', type: 'js', size: 1024, date: '2021-06-01' },
    { id: 23688, parentId: 23666, name: 'Test13', type: 'js', size: 1024, date: '2021-06-01' },
    { id: 23681, parentId: 23688, name: 'Test14', type: 'js', size: 1024, date: '2021-06-01' },
    { id: 23682, parentId: 23688, name: 'Test15', type: 'js', size: 1024, date: '2021-06-01' },
    { id: 24555, parentId: null, name: 'Test16', type: 'avi', size: 224, date: '2020-10-01' },
    { id: 24566, parentId: 24555, name: 'Test17', type: 'js', size: 1024, date: '2021-06-01' },
    { id: 24577, parentId: 24555, name: 'Test18', type: 'js', size: 1024, date: '2021-06-01' }
  ]
  data3: any[] = []
  shows: boolean[] = [true, true, true, true, true, true, true,]
  ngAfterViewInit() {
    setTimeout(() => {
      this.hidden = true;
      new Array(1000).fill(1).forEach(() => {
        this.data.push({ id: '123', name: '张三', 'age': 18, 'address': '北京市朝阳区', 'sex': '男', num: '1', date: '2024-02-21', role:'管理' })
      })
      this.data = [...this.data]
    }, 3000);
    setTimeout(() => {
      this.data3 = [];
      for (let i = 0; i < 1000; i++) {
        let data: any = {
          id: i,
          collectionTime: 'detail' + i,
          aidsName: '站点' + (100 - i),
          ifAlarm: ((Math.random() + 0.5) | 0).toString(),
          ifBind: ((Math.random() + 0.5) | 0).toString(),
          ifMark: i % 3 == 0 ? 'success' : i % 3 == 1 ? 'defeated' : 'asdasd',
          commModeCode: '北斗',
          functionCode: ((Math.random() * 3 + 0.5) | 0).toString(),
        };
        if (i % 10 == 0) {
          let c: any[] = [];
          for (let j = 0; j < 3; j++) {
            c.push({
              id: j,
              collectionTime: 'children' + j,
              aidsName: 100 - i + '站点children' + j,
              ifAlarm: ((Math.random() + 0.5) | 0).toString(),
              ifBind: ((Math.random() + 0.5) | 0).toString(),
              ifMark: j % 3 == 0 ? 'success' : j % 3 == 1 ? 'defeated' : 'asdasd',
              commModeCode: '北斗',
              functionCode: ((Math.random() * 3 + 0.5) | 0).toString(),
            });
          }
          data.children = c;
          data._showChild = true;
        }
        this.data3.push(data);
      }
    }, 2000);
  }
  onCheckChange($event) {
    console.log('外部',$event)
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
