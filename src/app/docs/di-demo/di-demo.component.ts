import { Component, signal, computed, WritableSignal, OnInit, Signal, effect, ChangeDetectionStrategy } from '@angular/core';
@Component({
  selector: 'di-demo',
  template: `
    <p>signal</p>
    <p>{{count()}}-{{copcount()}}</p>
    <p>{{count2}}</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DiDemoComponent implements OnInit {
  count: WritableSignal<number> = signal(0);
  count2: number = 1
  copcount: Signal<number> = computed(() => {
    return this.count() + 1;
  });
  map: WeakMap<any, any> = new WeakMap()
  constructor() {
    effect(() => {
      console.log('当前值发送变化', this.count());
    }, {allowSignalWrites: true});
    let obj: any = {};
    this.map.set(obj, obj);
    console.log(this.map);
    setTimeout(() => {
      obj = null;
    }, 1000);
  }
  ngOnInit(): void {
    setInterval(() => {
      // this.count.set(this.count())
      this.count.update(val => val+1)
      console.log('==',this.count(), this.copcount());
      this.count2++;
    }, 3000)
  }
  ngAfterViewInit() {
    setTimeout(() => {
      console.log(this.map,'========');
    }, 5000);
    
  }
}