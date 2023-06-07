import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-input-demp',
  templateUrl: './input-demp.component.html',
  styleUrls: ['./input-demp.component.less']
})
export class InputDempComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
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
    this.final = this.test + this.test2 + this.test3 + ''
  }
  clear(ngForm: NgForm) {
    ngForm.reset()
  }
}
