import { Component, Signal, effect, signal } from '@angular/core';
import { DateBaseProp } from '../date-base';
import { min } from 'lodash';
const TimeRule = [
  {
    type: 'hour',
    max2: 24,
    max: 12
  }
]
@Component({
  selector: 'date-time',
  imports: [],
  templateUrl: './date-time.component.html',
  styleUrl: './date-time.component.less'
})
export class DateTimeComponent extends DateBaseProp {
  inType: ('hour' | 'minute' | 'second')[] = ['hour']
  formaterEffect = effect(() => {
    this.formater
  })
  hourModel: Signal<number> = signal(0);
  minuteModel: Signal<number> = signal(0);
  secondModel: Signal<number> = signal(0);
}
