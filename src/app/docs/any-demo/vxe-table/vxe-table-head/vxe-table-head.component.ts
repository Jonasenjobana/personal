import { Component, Input } from '@angular/core';
import { VxeTableService } from '../vxe-table.service';
import { VxeColumnComponent } from '../vxe-column/vxe-column.component';

@Component({
  selector: 'vxe-table-head',
  templateUrl: './vxe-table-head.component.html',
  styleUrls: ['./vxe-table-head.component.less']
})
export class VxeTableHeadComponent {
  @Input() columns: VxeColumnComponent[]
  constructor(private vxeService: VxeTableService) {

  }
}
