import { ZqModalService } from './../modal/zq-modal.service';
import { Component, Input, OnInit, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'zq-message',
  template: `
    <div class="zq-message">
      <span [zqIcon]="'check-circle'"></span>
      <span>{{ messageInfo }}</span>
    </div>
  `,
  styles: []
})
export class ZqMessageComponent implements OnInit {
  @Input() messageType: 'success' | 'warning' | 'error' | 'custom' = 'success';
  @Input() messageInfo: string = '测试文本';
  @Input() messageIcon: string = '';
  ngOnChanges(changes: SimpleChanges) {
    const { messageType } = changes;
    if (messageType) {
      this.messageIcon = icon[this.messageType] || this.messageIcon
    }
  }
  constructor(private modalService: ZqModalService) {}

  ngOnInit(): void {
  }
}
enum icon {
  'success' = 'check-circle',
  'warning' = 'info-circle',
  'error' = 'close-circle',
  'custom' = ''
}
