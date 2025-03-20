import { Component, ModelSignal, Signal, WritableSignal, computed, model, signal } from '@angular/core';

@Component({
  selector: 'date-scroll',
  imports: [],
  templateUrl: './date-scroll.component.html',
  styleUrl: './date-scroll.component.less'
})
export class DateScrollComponent {
  min: Signal<number> = signal(0);
  max: Signal<number> = signal(60);
  data: ModelSignal<number> = model();
  list: Signal<number[]> = computed(() => {
    return new Array(this.max() - this.min()).fill(0).map((_, index) => index + this.min());
  })
  constructor() {

  }
}
