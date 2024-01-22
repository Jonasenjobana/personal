import { FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import { InstanceObjectToFormGroup } from 'src/app/shared/utils/form.util';

@Component({
  selector: 'form-demo',
  templateUrl: './form-demo.component.html',
  styleUrls: ['./form-demo.component.less']
})
export class FormDemoComponent {

  constructor() {
    setTimeout(() => {
      this.person = {
        name: '张三',
        sex: "男",
        age: 18,
        favorite: ['哈哈哈','带多大'],
        address: {
          strees: '深圳',
          city: '南山区',
          zip: '123',
          state: 's'
        }
      }
      this.formGroup = InstanceObjectToFormGroup(this.person);
    }, 2000);
  }
  person?: Person
  formGroup?: FormGroup
  submit() {
    console.log(this.formGroup);
    
  }
}
interface Person {
  name: string
  sex: string
  age: number
  favorite: string[],
  address: {
    strees: string,
    city: string
    state: string
    zip: string
  }
}