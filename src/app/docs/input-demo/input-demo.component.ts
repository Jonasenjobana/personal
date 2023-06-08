import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
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
    describe: '描述123'
  }
  object2 = {
    username: 'admin',
    gender: '男',
    describe: '描述123'
  }
  constructor() { }

  ngOnInit(): void {
    this.final = JSON.stringify(this.object)
  }
  test = 1
  test2 = 2
  test3 = 3
  final = ''
  flow(ngForm: NgForm) {
    if (ngForm.valid) {
      window.alert('提交成功')
    } else {

    }
    this.final = JSON.stringify(this.object)
  }
  clear(ngForm: NgForm) {
    ngForm.reset()
  }
  reset(ngForm: NgForm) {
    this.object = copyDeep(this.object2)
  }
}
