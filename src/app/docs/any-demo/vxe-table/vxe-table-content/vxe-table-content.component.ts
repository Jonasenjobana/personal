import { Component, Input } from '@angular/core';
import { VxeColumnComponent } from '../vxe-column/vxe-column.component';
import { VxeTableService } from '../vxe-table.service';
import { VxeColumnGroups } from '../vxe-model';

@Component({
  selector: 'vxe-table-content',
  templateUrl: './vxe-table-content.component.html',
  styleUrls: ['./vxe-table-content.component.less']
})
export class VxeTableContentComponent {
  inData: any
  @Input() contentCol: VxeColumnComponent[]
  constructor(private vxeService: VxeTableService) {
    this.inData = vxeService.data
    vxeService.dataObserve.subscribe((data) => {
      this.inData = data;
    })
    // vxeService.tableHeaderColumn$.subscribe(columns => {
    //   this.columns = columns.filter(el => el.VXETYPE == 'vxe-column') as VxeColumnComponent[];
    // })
  }
}
