import { Component, inject, viewChild } from '@angular/core';
import { RangInputComponent } from '../rang-input/rang-input.component';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Form2TestComponent } from '../form2-test/form2-test.component';

@Component({
  selector: 'form-demo',
  imports: [RangInputComponent, FormsModule, CommonModule, ReactiveFormsModule, Form2TestComponent],
  templateUrl: './form-demo.component.html',
  styleUrl: './form-demo.component.less',
  standalone: true
})
export class FormDemoComponent {
  private fb: FormBuilder = inject(FormBuilder);
  range: { min?: any; max?: any } = {};
  formModel = this.fb.group<any>(
    {
      name: ['', Validators.required],
      range: {},
      other: [
        {
          note: '',
          age: '',
        }
      ]
    },
    {
      validators: [
        (c: FormGroup) => {
          return null;
        }
      ]
    }
  );
  formRef = viewChild('validForm', { read: NgForm });
  constructor() {}
  ngAfterViewInit() {}
  onSubmit() {
    console.log(this.formModel.valid, this.formModel);
    // const range = form.controls['range'];
  }
  onReset() {
    this.formModel.reset();
  }
}
