import { Component, Input } from '@angular/core';
import { BigScreenComponent } from '../big-screen.component';
/**
 * 大屏 布局 可套娃 
*/
@Component({
  selector: 'big-screen-layer',
  template: `
    <div class="screen-layer">
      <big-screen *ngFor="let item of screenComponent;"></big-screen>
    </div>
  `,
  styles: [
    `
      
    `
  ]
})
export class BigScreenLayerComponent {
  /**自适应模式 开启则根据大屏分配 */
  @Input() ifAutoFix: boolean = false;
  @Input() screenComponent: BigScreenComponent[] = [];
  constructor() {

  }
}
