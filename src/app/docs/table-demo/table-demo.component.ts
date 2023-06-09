import { Component, OnInit } from '@angular/core';
import { ZqTableItem } from 'src/app/shared/module/table/type';

@Component({
  selector: 'zq-table-demo',
  templateUrl: './table-demo.component.html',
  styleUrls: ['./table-demo.component.less']
})
export class TableDemoComponent implements OnInit {
  tableItem: ZqTableItem<User>[] = [
    {
      title: '序号',
      width: 50
    },
    {
      title: '用户名',
      property: 'username',
      width: 100,
      align: 'left'
    },
    {
      title: '密码',
      property: 'password',
      width: 100
    }
  ];
  page: number = 0;
  size: number = 0;
  constructor() {}

  ngOnInit(): void {}
  onPageChange(page: number) {
    this.page = page;
  }
  onSizeChange(size: number) {
    this.size = size;
  }
}
class User {
  username: string = 'admin';
  password: string = '123';
  description: string = '管理员';
}
