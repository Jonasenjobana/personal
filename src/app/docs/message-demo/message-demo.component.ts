import { Component } from '@angular/core';
import { MessageService } from './components/message.service';

@Component({
  selector: 'message-demo',
  templateUrl: './message-demo.component.html',
  styleUrls: ['./message-demo.component.less']
})
export class MessageDemoComponent {
  constructor(private message_: MessageService) {

  }
  showMessage() {
    this.message_.success('111')
  }
}
