import { Component, EventEmitter, Input, Output } from '@angular/core';
import { uniqueId } from 'lodash';
// 大屏组件 容器
@Component({
  selector: 'big-screen',
  template: `
    <div class="big-screen-container" [ngStyle]="{width: inWeight + 'px', height: inHeight + 'px', zIndex}">
      <big-screen-layer></big-screen-layer>
    </div>
  `,
  styles: [
    `
      .big-screen-container {
        position: absolute;
      }
    `
  ]
})
export class BigScreenComponent {
  /**层级 */
  @Input() zIndex: number = 100
  /** 是否贴近屏幕边缘 否则当作动态组件 */
  @Input() ifBorder: boolean = true;
  /** 是否固定组件 比如map 3d */
  @Input() ifFixed: boolean = false;
  @Input() inWeight: number = 0;
  @Input() inHeight: number = 0;
  /**是否允许拖动 */
  @Input() draggable: boolean = false;
  /**是否允许折叠 */
  @Input() ifFold: boolean = true;
  /**折叠方向 动画 */
  @Input() foldAnime: 'ltr' | 'rtl' | 'btt' | 'ttb' = 'ltr'
  /**延迟 500ms */
  @Input() foldTime: number = 500;
  /**折叠是否销毁 */
  @Input() ifFoldDestroy: boolean = false;
  /**隐藏大屏组件 */
  @Input() ifHidden: boolean = false;
  /** 位置改变 */
  @Output() positionChange: EventEmitter<any> = new EventEmitter();
  /**动画完成回调 */
  @Output() animeFinish: EventEmitter<any> = new EventEmitter();
  id: string = uniqueId();
  status: 'fold' | 'normal' = 'normal';
  constructor() {

  }
  /**
   * 改变位置
   */
  changePosition() {
    
  }
  onFold() {

  }
}
