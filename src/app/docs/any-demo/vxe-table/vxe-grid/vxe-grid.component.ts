import { Component, Input, ViewChild, ViewContainerRef, TemplateRef } from '@angular/core';
import { VxeGridConfig } from '../vxe-model';
/**配置化表格 */
@Component({
  selector: 'vxe-grid',
  templateUrl: './vxe-grid.component.html',
  styleUrls: ['./vxe-grid.component.less']
})
export class VxeGridComponent {
  @Input() vxeConfig: VxeGridConfig
  constructor() {
    
  }
  ngAfterViewInit() {
  }
}
