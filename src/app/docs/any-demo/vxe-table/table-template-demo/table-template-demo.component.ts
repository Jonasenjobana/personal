import { Component, Input, SimpleChanges } from '@angular/core';
import { VxeGridColumn, VxeGridConfig } from '../vxe-model';

@Component({
  selector: 'table-template-demo',
  templateUrl: './table-template-demo.component.html',
  styleUrls: ['./table-template-demo.component.less']
})
export class TableTemplateDemoComponent {
  @Input() inGrid: CustomVxeGridConfig;
  constructor() {}
  ngOnChanges(changes: SimpleChanges) {
    const {inGrid} = changes;
    if (inGrid && inGrid.currentValue) {
      this.handleCustomType(this.inGrid.columns)
    }
  }
  /**自定义模板 */
  handleCustomType(columns: Partial<CustomVxeGridColumn>[]) {
    columns.forEach(el => {
      switch(el.customType) {
        case 'battery':
          el.slot = {rowName: 'battery'}
          break;
        case 'crud':
          el.slot = {rowName: 'crud'}
          break;
        case 'link':
          el.slot = {rowName: 'link'}
          break;
        case 'dot':
          el.slot = {rowName: 'dot'}
          break;
        case 'code-btn':
          el.slot = {rowName: 'code-btn'}
          break;
        default:
      }
      el.children && this.handleCustomType(el.children);
    })
  }
}
interface CustomVxeGridConfig extends VxeGridConfig {
  columns: Partial<CustomVxeGridColumn>[]
}
interface CustomVxeGridColumn extends VxeGridColumn {
  // 定义自定义模板
  customType: 'dot' | 'crud' | 'link' | 'battery' | 'code-btn'
  children: Partial<CustomVxeGridColumn>[]
}