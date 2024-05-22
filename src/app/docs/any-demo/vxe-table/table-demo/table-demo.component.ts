import { Component, ViewChild } from '@angular/core';

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
    { id: '123', name: '张三', 'age': 18, 'address': '北京市朝阳区' },
    { id: '4544', name: '里斯', 'age': 22, 'address': '北京市朝阳区' },
  ]
  ngAfterViewInit() {
    setTimeout(() => {
      this.hidden = true
    }, 3000);
  }
  onCheckChange($event) {
    
  }
  onButtonClick(row, col) {
    console.log(row, col)
  }
}
