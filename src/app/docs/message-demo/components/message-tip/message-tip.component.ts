import { Component, Input, SimpleChanges } from '@angular/core';
@Component({
  selector: 'message-tip',
  template: `
    <div [class]="status">{{tip}}</div>
  `,
  styles: [
    `
      .zq-message {
        position: fixed;
      }
    `
  ],
  host: {
    'class': 'zq-message'
  }
})
export class MessageTipComponent {
  @Input() index: number = 0;
  @Input() tip: string = ''
  @Input() status!: 'success' | 'fail'
  @Input() lifeTime!: number
  // currentLift: number
  constructor() {

  }
  ngOnChanges(changes: SimpleChanges) {
    const {liftTime} = changes;
    if (liftTime) {
      // timeout(this.lifeTime).
    }
  }
}
