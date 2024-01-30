import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'test-form',
  templateUrl: './test-form.component.html',
  styleUrls: ['./test-form.component.less']
})
export class TestFormComponent implements OnInit {
  @Input() inFormGroup?: AbstractControl | null
  formGroup?: FormGroup
  constructor() {

  }
  ngOnInit() {

  }
  ngOnChanges(changes: SimpleChanges) {
    const {inFormGroup} = changes;
    if (inFormGroup) {
      this.formGroup = (this.inFormGroup as FormGroup)
    }
  }
}
