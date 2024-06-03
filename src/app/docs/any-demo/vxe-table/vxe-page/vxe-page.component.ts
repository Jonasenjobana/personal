import { Component, Input } from '@angular/core';

@Component({
  selector: 'vxe-page',
  templateUrl: './vxe-page.component.html',
  styleUrls: ['./vxe-page.component.less']
})
export class VxePageComponent {
  @Input() size: 'default' | 'sm' | 'lg' = 'default';
}
