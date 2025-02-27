import { VxeColgroupComponent } from '../vxe-colgroup/vxe-colgroup.component';
import { VxeColumnComponent } from '../vxe-column/vxe-column.component';
import { VxeGridColumn } from '../vxe-model';

export interface VxeDynamicTable {
  /**投影获取的组件 */
  contentColComponents: VxeColumnComponent[];
  contentGroupComponents: VxeColgroupComponent[];
  /**通过工厂函数创建的组件 */
  dynamicColComponents: VxeColumnComponent[];
  dynamicGroupComponents: VxeColgroupComponent[];
  /**重设表头 */
  resetTableHeader()
  /**new创建表头 */
  createDynamicHeader(vxeGridColumn: Partial<VxeGridColumn>[])
}
