import { Component } from '@angular/core';
import { ChatEnterComponent } from './chat-enter/chat-enter.component';
import { ChatService } from './chat.service';

@Component({
  selector: 'ai-community',
  standalone: true,
  imports: [ChatEnterComponent],
  templateUrl: './ai-community.component.html',
  styleUrl: './ai-community.component.less',
  providers: [ChatService]
})
export class AiCommunityComponent {

}
