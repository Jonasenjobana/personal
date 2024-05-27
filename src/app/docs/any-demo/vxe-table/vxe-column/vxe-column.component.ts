import { Component, ContentChild, ElementRef, Input, Optional, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { VxeTableService } from '../vxe-table.service';

@Component({
  selector: 'vxe-column',
  templateUrl: './vxe-column.component.html',
  styleUrls: ['./vxe-column.component.less']
})
export class VxeColumnComponent {
  readonly VXETYPE = 'vxe-column';
  @Input() field: string
  @Input() title: string
  @Input() align: 'left'|'center'|'right' = 'center'
  @Input() type: 'checkbox' | 'seq' | 'radio' | 'expand'
  @Input() width: number
  @Input() fixed: 'left' | 'right'
  @Input() sortable: boolean
  @Input() sortRuleCb?: (field: string, data: any) => number
  asce: boolean = true; // 升序 true 降序 false
  @ContentChild(TemplateRef) template: TemplateRef<any>
  @ViewChild('vxeColumn') vxeColumnTemplate: TemplateRef<any>
  isCheck: boolean = false;
  constructor(@Optional() private vxeService: VxeTableService, public element: ElementRef) {
    if (!vxeService) Error('error: vxeService is null');
    vxeService.dataObserve.subscribe(data => {
      // console.log(data)
    })
  }
  ngOnChanges(changes: SimpleChanges) {
    const {fixed} = changes
    if (fixed) {
      requestAnimationFrame(() => {
        this.setFixedColumn()
      })
    }
  }
  setFixedColumn() {
    console.log(this.fixed)
    this.fixed && this.vxeService.addFixed(this.fixed, this)
  }
  sortStatusChange() {
    this.asce = !this.asce
  }
}
