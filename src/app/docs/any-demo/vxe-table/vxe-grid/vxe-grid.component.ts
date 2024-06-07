import { Component, Input, ViewChild, ViewContainerRef, TemplateRef, ContentChild, ContentChildren, QueryList, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { VxeGridColumn, VxeGridConfig } from '../vxe-model';
import { VxeTemplateDirective } from '../vxe-base/vxe-template.directive';
/**配置化表格 */
@Component({
  selector: 'vxe-grid',
  templateUrl: './vxe-grid.component.html',
  styleUrls: ['./vxe-grid.component.less']
})
export class VxeGridComponent {
  @Input() vxeConfig: VxeGridConfig
  @ContentChildren(VxeTemplateDirective) gridTemplates: QueryList<VxeTemplateDirective>;
  girdTemplateList: VxeTemplateDirective[] = [];
  ngOnChanges(changes: SimpleChanges) {
    const {vxeConfig} = changes;
    if (vxeConfig && !vxeConfig.isFirstChange()) {
      this.setTemplate(this.vxeConfig.columns);
      this.vxeConfig = Object.assign({}, this.vxeConfig)
    }
  }
  constructor(private cdr: ChangeDetectorRef) {
    
  }
  ngAfterContentInit() {
    this.girdTemplateList = this.gridTemplates.toArray();
    this.gridTemplates.changes.subscribe(() => {
      this.girdTemplateList = this.gridTemplates.toArray();
      this.setTemplate(this.vxeConfig.columns);
    })
  }
  ngAfterViewInit() {
    this.setTemplate(this.vxeConfig.columns);
    this.vxeConfig = Object.assign({}, this.vxeConfig)
    // console.log(this.vxeConfig.columns)
    this.cdr.detectChanges()
  }
  setTemplate(columns: Partial<VxeGridColumn>[]) {
    columns.forEach(el => {
      const find = this.girdTemplateList.find(temp => temp.templateName == el.slot?.rowName || temp.templateName == el.slot?.colName);
      if (find) {
        const {template, type} = find
        type == 'column' ? el.columnTemplate = template : el.rowTemplate = template
      }
      el.children && this.setTemplate(el.children);
    })
  }
}
