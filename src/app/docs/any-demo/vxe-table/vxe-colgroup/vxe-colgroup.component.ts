import { Component, Input } from '@angular/core';

@Component({
  selector: 'vxe-colgroup',
  templateUrl: './vxe-colgroup.component.html',
  styleUrls: ['./vxe-colgroup.component.less']
})
export class VxeColgroupComponent {
  @Input() fixed: 'left' | 'right'
}
