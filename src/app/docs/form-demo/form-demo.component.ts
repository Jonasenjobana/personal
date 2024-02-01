import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, NgForm } from '@angular/forms';
import { Component, Injector, Input, ViewChild } from '@angular/core';
import { ZqSelectItem } from 'src/app/shared/module/select/type';
import { isNumber } from 'lodash';

@Component({
  selector: 'form-demo',
  templateUrl: './form-demo.component.html',
  styleUrls: ['./form-demo.component.less']
})
export class FormDemoComponent {
  @Input() device!: Device;
  @Input() test: string = 'test'
  constructor(private fb: FormBuilder,private injector: Injector) {
    console.log(injector.get(Input),'inject');
    
    setTimeout(() => {
      this.formGroup = this.fb.group({
        id: this.fb.control(''),
        deviceCode: this.fb.control('', {}),
        deviceName:  this.fb.control('', {}),
        attrs: this.fb.array([
          this.fb.group({
            name: '',
            value: '',
            unit: '',
            range: this.fb.group({
              type: '',
              value1: '',
              value2: ''
            })
          }),
          this.fb.group({
            name: '',
            value: '',
            unit: '',
            range: this.fb.group({
              type: '',
              value1: '',
              value2: ''
            })
          }),
          this.fb.group({
            name: '',
            value: '',
            unit: '',
            range: this.fb.group({
              type: '',
              value1: '',
              value2: ''
            })
          })
        ]),
        test: this.fb.group({
          a: '',
          b: '',
          c: ''
        }),
        test2: this.fb.group({
          b: ''
        })
      });
      const res: any = {
        id:
          Math.random().toString(16).slice(2) +
          Math.random().toString(16).slice(2) +
          Math.random().toString(16).slice(2),
        deviceCode: '010344023942010358',
        deviceName: '航标灯',
        attrs: [
          {
            name: '电压',
            value: '220',
            unit: 'V',
            range: {
              type: '',
              value1: '电压',
              value2: '23'
            }
          },
          {
            name: '电流',
            value: '3',
            unit: 'A',
            range: {
              type: '=',
              value1: '电流',
              value2: '3'
            }
          },
          {
            name: '电流',
            value: '3',
            unit: 'A',
            range: {
              type: '~',
              value1: '1',
              value2: '3'
            }
          }
        ],
        test: {
          a: '1',
          b: '1',
          c: '1'
        },
        test2: {
          b: 'ffff'
        }
      };
      this.device = res;
      this.formGroup.patchValue(res);
    }, 2000);
  }
  @ViewChild('ngForm') set ngForm(value: NgForm) {
    console.log(value)
    value.statusChanges?.subscribe(el => {
      console.log('statusChanges', el)
    })
  }
  modelChange($event: any) {
    console.log($event, this.ngForm,'=========')
  }
  option: ZqSelectItem[] = [
    {
      label: '唱',
      value: '1'
    },
    {
      label: '跳',
      value: '2'
    },
    {
      label: 'Rap',
      value: '3'
    },
    {
      label: '篮球',
      value: '4'
    }
  ];
  person?: any;
  formGroup?: FormGroup;
  get attrs() {
    return this.formGroup?.get('attrs') as FormArray;
  }
  submit() {
    console.log(this.formGroup);
  }
  onSubmit() {}
  onSelectChange() {}
  validator = (group: AbstractControl) => {
    const value2 = Number(group.value.value2)
    if (!isNumber(value2) || Number.isNaN(value2) || value2 < 0) {
      return {
        errMsg: '值需大于等于0'
      }
    }
    return null
  }
}
interface Device {
  id: string;
  organizeId: string;
  deviceCode: string;
  deviceName: string;
  attrs: DeviceArrtibute[];
  test: any;
  test2: any;
}
interface DeviceArrtibute {
  name: string;
  value: string | number;
  unit: string;
  range: {
    type: '=' | '<' | '≤' | '≥' | '≠' | '>';
    value1: string | number;
    value2: string | number;
  };
}
interface FormItem<T = any, K extends keyof T = any> {
  property: K;
  type: 'input' | 'select' | 'range';
  onChange: (item: FormItem<T, K>) => void;
}
