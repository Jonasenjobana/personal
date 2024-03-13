import { debounceTime, interval, Observable, of, Subscriber, timeout, filter, map, mergeMap } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';
import { copyDeep } from 'src/app/shared/utils/common.util';

@Component({
  selector: 'app-input-demo',
  templateUrl: './input-demo.component.html',
  styleUrls: ['./input-demo.component.less']
})
export class InputDemoComponent implements OnInit {
  object = {
    username: 'admin',
    gender: '男',
    describe: '描述123',
    asynTest: 'llin03',
    customAsync: (): Promise<boolean> => {
      return new Promise(res => {
        setTimeout(() => {
          if (this.object.asynTest === 'llin03') {
            res(true)
          } else {
            res(false)
          }
        }, 3000);
      })
    }
  }
  object2 = {
    username: 'admin',
    gender: '男',
    describe: '描述123',
    asynTest: 'llin03'
  }
  disabledButton = false
  constructor() { 

  }

  ngOnInit(): void {
    this.final = JSON.stringify(this.object)
    this.init()
  }
  test = 1
  test2 = 2
  test3 = 3
  final = ''
  flow(ngForm: NgForm) {
    this.disabledButton = true
    ngForm.statusChanges?.subscribe((status) => {
      if (status === 'VALID') {
        console.log('valid check!');
        
      }
      console.log(status);
        
      this.disabledButton = false
    })
    this.final = JSON.stringify(this.object)
  }
  clear(ngForm: NgForm) {
    ngForm.reset()
  }
  reset(ngForm: NgForm) {
    this.object = copyDeep(this.object2)
  }
  init() {
    // new Observable((subscriber: Subscriber<any>) => {
    //  of(1,2,3,4).pipe( mergeMap(x => interval(1000).pipe(map(i => x + i)))).subscribe((res) => {
    //   subscriber.next(res)
    //  })
    // }).subscribe(res => {
    //   console.log(res,'res!')
    // })
  }
  
}
