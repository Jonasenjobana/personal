import { Injectable, ViewContainerRef, Renderer2, Optional } from '@angular/core';
import { MessageTipComponent } from './message-tip/message-tip.component';
import { Subject, Subscribable, Subscription, interval, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messageQueue: MessageTipComponent[] = [];

  private tipTime: number = 2000;
  private destory$: Subject<void> = new Subject();
  constructor(@Optional() private render: Renderer2) {
    this.auto();
  }
  setCountTime(time: number = 1000) {
    this.tipTime = time;
    this.auto();
  }
  success(tip: string) {
    const currentTip = new MessageTipComponent();
    currentTip.lifeTime = this.tipTime;
    this.messageQueue.push(currentTip);
    this.update();
  }
  auto() {
    this.destory$.next();
    interval(this.tipTime)
      .pipe(takeUntil(this.destory$))
      .subscribe(() => {
        this.messageQueue.shift();
        this.update();
      });
  }
  update() {
    if (this.messageQueue.length == 0) {
      this.destory$.next();
      return;
    }
    this.auto()
  }
}
