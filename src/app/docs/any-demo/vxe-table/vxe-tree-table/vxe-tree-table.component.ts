import { Component, Input } from '@angular/core';

@Component({
  selector: 'vxe-tree-table',
  templateUrl: './vxe-tree-table.component.html',
  styleUrls: ['./vxe-tree-table.component.less']
})
export class VxeTreeTableComponent {
  @Input() columns: any[]
  constructor() {

  }
}
