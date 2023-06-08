import { AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { ZqButtonShape, ZqButtonSize, ZqButtonType } from '../../types/types';
@Component({
  selector: 'button[zq-button]',
  template: ` <ng-content></ng-content>`,
  host: {
    class: 'zq-btn',
    '[class.zq-btn-disabled]': 'disabled',
    '[class.zq-btn-sm]': `zqSize === 'small'`,
    '[class.zq-btn-lg]': `zqSize === 'large'`,
    '[class.zq-btn-dangerous]': `zqType === 'dangerous'`,
    '[class.zq-btn-primary]': `zqType === 'primary'`,
  },
})
export class ZqButtonComponent implements OnInit {
  @Input() preIcon: string = '';
  @Input() zqType: ZqButtonType = null;
  @Input() zqShape: ZqButtonShape = null;
  @Input() disabled: boolean = false;
  @Input() zqSize: ZqButtonSize = 'default';
  constructor(private render: Renderer2, private elementRef: ElementRef) {}

  ngOnInit(): void {}
}
