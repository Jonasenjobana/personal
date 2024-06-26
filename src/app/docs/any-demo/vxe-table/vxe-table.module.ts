import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VxeColumnComponent } from './vxe-column/vxe-column.component';
import { VxeTableComponent } from './vxe-table/vxe-table.component';
import { VxeColgroupComponent } from './vxe-colgroup/vxe-colgroup.component';
import { TableDemoComponent } from './table-demo/table-demo.component';
import { FormsModule } from '@angular/forms';
import { VxeTableService } from './vxe-table.service';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { VxePageComponent } from './vxe-page/vxe-page.component';
import { VxeFixedColumnComponent } from './vxe-fixed-column/vxe-fixed-column.component';
import { VxeTableHeadComponent } from './vxe-table-head/vxe-table-head.component';
import { VxeTableContentComponent } from './vxe-table-content/vxe-table-content.component';
import { IconDefinition } from '@ant-design/icons-angular';
import { OverlayModule } from '@angular/cdk/overlay';
// 引入你需要的图标，比如你需要 fill 主题的 AccountBook Alert 和 outline 主题的 Alert，推荐 ✔️
import { SortAscendingOutline, SortDescendingOutline, CaretRightOutline, CaretDownOutline, SettingOutline } from '@ant-design/icons-angular/icons';
import { VxeGridComponent } from './vxe-grid/vxe-grid.component';
import { VxeTemplateDirective } from './vxe-base/vxe-template.directive';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { TableTemplateDemoComponent } from './table-template-demo/table-template-demo.component';
const icons: IconDefinition[] = [ SortAscendingOutline, SortDescendingOutline, CaretRightOutline, CaretDownOutline, SettingOutline ];
@NgModule({
  declarations: [
    VxeColumnComponent,
    VxeTableComponent,
    VxeColgroupComponent,
    TableDemoComponent,
    VxePageComponent,
    VxeFixedColumnComponent,
    VxeTableHeadComponent,
    VxeTableContentComponent,
    VxeGridComponent,
    VxeTemplateDirective,
    TableTemplateDemoComponent,
  ],
  providers: [VxeTableService],
  imports: [
    FormsModule,
    CommonModule,
    NzCheckboxModule,OverlayModule,
    NzInputModule,
    NzButtonModule,
    DragDropModule,
    NzIconModule.forRoot(icons)
  ],
  exports: [
    VxeColumnComponent,
    VxeTableComponent,
    VxeColgroupComponent,
    VxeTemplateDirective
  ]
})
export class VxeTableModule { }
