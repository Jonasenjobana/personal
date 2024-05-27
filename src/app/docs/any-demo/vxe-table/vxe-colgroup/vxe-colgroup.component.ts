import { Component, ContentChildren, ElementRef, Input, Optional, QueryList, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { VxeTableService } from '../vxe-table.service';
import { VxeColumnComponent } from '../vxe-column/vxe-column.component';
import { VxeColumnGroups } from '../vxe-model';

@Component({
  selector: 'vxe-colgroup',
  templateUrl: './vxe-colgroup.component.html',
  styleUrls: ['./vxe-colgroup.component.less'],
})
export class VxeColgroupComponent {
  readonly VXETYPE = 'vxe-colgroup';
  @Input() field: string
  @Input() width: number
  @Input() fixed: 'left' | 'right'
  @Input() title: string
  @Input() align: 'left' | 'right' | 'center' = 'center';
  @ContentChildren(VxeColumnComponent) columns: QueryList<VxeColumnComponent>;
  @ContentChildren(VxeColgroupComponent) groups: QueryList<VxeColgroupComponent>;
  @ViewChild('vxeTemplate') vxeColumnTemplate: TemplateRef<any>
  columnCount: number = 0;
  children: VxeColumnGroups
  constructor(@Optional()private vxeService: VxeTableService, public element: ElementRef) {
    if (!vxeService) Error('error: vxeService is null');
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
  ngAfterContentInit() {
    this.reset();
    this.columns.changes.subscribe((data) => {
      this.reset()
    });
    this.groups.changes.subscribe((data) => {
      this.reset()
    })
  }
  reset() {
    this.columnCount = this.columns.length + this.groups.reduce((count, el) => {
      return count + el.columnCount;
    }, 0);
    const columns = this.columns.toArray()
    const groups = this.groups.toArray();
    this.children = this.vxeService.getDomFlow([...groups, ...columns]);
  }
}
