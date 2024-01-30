import { FormGroup, FormControl, NgForm, FormArray, FormBuilder, AbstractControl } from '@angular/forms';
import { isEmpty } from './common.util';
/**
 * 表单
 * 实例对象转为FormGroup类型
 * @param instanceObj
 * @returns
 */
function InstanceObjectToFormGroup<T = any>(instanceObj: T extends Object ? T : never, opt?: any): FormGroup {
  return new FormGroup(
    Object.keys(instanceObj).reduce((controls: { [key in string]: FormGroup | FormControl | FormArray }, key) => {
      if (key in instanceObj) {
        let Tkey = key as keyof T;
        // FormArray
        if (Array.isArray(instanceObj[Tkey]) && (instanceObj[Tkey] as any[]).length > 0) {
          controls[key] = InstanceObjectToFormArray<(typeof instanceObj)[keyof T]>(instanceObj[Tkey] as any);
        } else if (instanceObj[Tkey] instanceof Object) {
          // FormGroup
          controls[key] = InstanceObjectToFormGroup<(typeof instanceObj)[keyof T]>(instanceObj[Tkey] as any);
        } else {
          // FormControl
          controls[key] = new FormControl(instanceObj[Tkey]);
        }
      }
      return controls;
    }, {})
  );
}
function InstanceObjectToFormArray<T = any[]>(instanceArr: Array<T>): FormArray {
  return new FormArray(
    instanceArr.reduce((controls: (FormGroup | FormControl | FormArray)[], item) => {
      let control;
      if (Array.isArray(item) && item.length > 0) {
        // FormArray
        control = InstanceObjectToFormArray(item);
      } else if (item instanceof Object) {
        // FormGroup
        control = InstanceObjectToFormGroup<typeof item>(item);
      } else {
        // FormControl
        control = new FormControl(item);
      }
      controls.push(control);
      return controls;
    }, [])
  );
}
function CheckValidate(ngForm: NgForm) {
  return ngForm.valid;
}
function ResetForm(ngForm: NgForm): void {
  ngForm.resetForm();
}
/**
 * 标记所有控件已触控
 * 样式控制
 * @param ngForm
 */
function MarkTouchedControl(ngForm: NgForm) {
  const controls = ngForm.controls;
  Object.keys(controls).forEach(key => {
    controls[key].markAsTouched();
  });
}
export { InstanceObjectToFormGroup, MarkTouchedControl, CheckValidate, ResetForm };
interface FormValidateOpt<T, K extends keyof T> {
  key: K,
  asyncValidators?: any,
  validators?: any,
  min: number
  max: number
}
