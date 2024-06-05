import { ComponentRef, Injector, ViewContainerRef } from '@angular/core';
import { VxeColgroupComponent } from '../vxe-colgroup/vxe-colgroup.component';
import { VxeColumnComponent } from '../vxe-column/vxe-column.component';
import { VxeGridColumn } from '../vxe-model';
import { VxeTableService } from '../vxe-table.service';

export class VxeDynamicTable {
  /**投影获取的组件 */
  contentColComponents: VxeColumnComponent[];
  contentGroupComponents: VxeColgroupComponent[];
  /**通过工厂函数创建的组件 */
  dynamicColComponents: VxeColumnComponent[];
  dynamicGroupComponents: VxeColgroupComponent[];

  constructor(protected vxeService: VxeTableService, protected viewContainerRef: ViewContainerRef, protected injector: Injector) { }
  /**重设表头 */
  resetTableHeader() {
    const columns = [...this.contentColComponents, ...this.dynamicColComponents];
    const groups = [...this.contentGroupComponents, ...this.dynamicGroupComponents];
    return this.vxeService.getDomFlow([...groups, ...columns]);
  }
  /**new创建表头 */
  createDynamicHeader(vxeGridColumn: Partial<VxeGridColumn>[]) {
    vxeGridColumn.forEach(col => {
      let componentRef: ComponentRef<VxeColgroupComponent|VxeColumnComponent>
      if (col.children && col.children.length > 0) {
        componentRef = this.viewContainerRef.createComponent(VxeColgroupComponent, { injector: this.injector });
        componentRef.setInput('columnChildren', col.children);
      } else {
        componentRef = this.viewContainerRef.createComponent(VxeColumnComponent, { injector: this.injector });
        componentRef.setInput('type', col.type);
        componentRef.setInput('field', col.field);
      }
      componentRef.setInput('title', col.title);
      componentRef.setInput('width', col.width);
    })
  }
}
