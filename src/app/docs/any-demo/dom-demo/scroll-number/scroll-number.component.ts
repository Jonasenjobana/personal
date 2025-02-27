import { ChangeDetectorRef, Component, Input } from '@angular/core';

/**滚动数字demo */
@Component({
  selector: 'scroll-number',
  templateUrl: './scroll-number.component.html',
  styleUrls: ['./scroll-number.component.less']
})
export class ScrollNumberComponent {
  showNums: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  degValue: number[] = [0, 36, 72, 108, 144, 180, 216, 252, 288, 324];
  currentFrames: number = 0;
  animeFlag?: number;
  constructor(private cdr: ChangeDetectorRef) {}
  ngAfterViewInit() {
    setInterval(() => {
      const randomNum = new Array(10).fill(0).map((el, idx) => Math.floor(Math.random()* 10))
      this.degValue = randomNum.map(num => {
        return num * 36
      })
    }, 2000)
  }
}
