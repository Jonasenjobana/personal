import { ComponentRef } from '@angular/core';
import { VxeColgroupComponent } from '../vxe-colgroup/vxe-colgroup.component';
import { VxeColumnComponent } from '../vxe-column/vxe-column.component';
import { VxeColumnGroup, VxeGridColumn } from '../vxe-model';

/**new创建表头 */
export function createDynamicHeader(vxeGridColumn: Partial<VxeGridColumn>[], { viewContainerRef, injector }) {
  let dyGroups: VxeColgroupComponent[] = [];
  let dyColumns: VxeColumnComponent[] = [];
  vxeGridColumn.forEach(col => {
    let componentRef: ComponentRef<VxeColgroupComponent | VxeColumnComponent>;
    if (col.children && col.children.length > 0) {
      componentRef = viewContainerRef.createComponent(VxeColgroupComponent, { injector });
      componentRef.setInput('columnChildren', col.children);
      dyGroups.push(componentRef.instance as VxeColgroupComponent);
    } else {
      componentRef = viewContainerRef.createComponent(VxeColumnComponent, { injector });
      componentRef.setInput('type', col.type);
      componentRef.setInput('field', col.field);
      dyColumns.push(componentRef.instance as VxeColumnComponent);
    }
    componentRef.setInput('title', col.title);
    componentRef.setInput('width', col.width);
  });
  return { dyGroups, dyColumns };
}
