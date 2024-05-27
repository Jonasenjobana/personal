import { VxeTableService } from './../vxe-table.service';
import { Component } from '@angular/core';

@Component({
  selector: 'vxe-fixed-column',
  templateUrl: './vxe-fixed-column.component.html',
  styleUrls: ['./vxe-fixed-column.component.less']
})
export class VxeFixedColumnComponent {
  get fixedColumn() {
    return this.vxeService.fixedColumn;
  }
  get containerHeight() {
    return this.vxeService.tableWrapperHeight
  }
  constructor(private vxeService: VxeTableService) {
    
  }
}
