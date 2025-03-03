import { Component, Signal, WritableSignal, computed, effect, signal, ModelSignal, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { Ng19demo1Component } from './ng19demo1/ng19demo1.component';

@Component({
  selector: 'ng19demo',
  standalone: true,
  imports: [NzInputModule, FormsModule, Ng19demo1Component, FormsModule, ],
  templateUrl: './ng19demo.component.html',
  styleUrl: './ng19demo.component.less',
  encapsulation: ViewEncapsulation.Emulated
})
export class Ng19demoComponent {
  text: WritableSignal<string> = signal('');
  text2: string = ''
  textCompute = computed(() => {
    return this.text() + 'wwww'
  })
  effectText = effect(() => {
    // console.log(this.text(), this.textCompute(),'dd')
  })

  change($event) {
    // console.log(this.text2,'ss')
    // console.log($event, this.textCompute())
  }
}
