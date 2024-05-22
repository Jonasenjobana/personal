import { Component, Input } from '@angular/core';
import { VxeColumnComponent } from '../vxe-column/vxe-column.component';
import { VxeTableService } from '../vxe-table.service';

@Component({
  selector: 'vxe-table-content',
  templateUrl: './vxe-table-content.component.html',
  styleUrls: ['./vxe-table-content.component.less']
})
export class VxeTableContentComponent {
  @Input() columns: VxeColumnComponent[];
  inData: any
  constructor(private vxeService: VxeTableService) {
    this.inData = vxeService.data
    vxeService.dataObserve.subscribe((data) => {
      this.inData = data;
    })
  }
}
