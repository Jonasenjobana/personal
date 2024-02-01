import { Component, Injector, Input, SimpleChanges } from '@angular/core';
import { MessageService } from './components/message.service';
import { throwError } from 'rxjs';

@Component({
  selector: 'message-demo',
  templateUrl: './message-demo.component.html',
  styleUrls: ['./message-demo.component.less']
})
export class MessageDemoComponent {
  constructor(private message_: MessageService, private injetor: Injector) {

  }
  text: string = '呜呜呜带多大阿达打撒打撒'
  width: number = 100
  showMessage() {
    this.message_.success('')
  }
}
