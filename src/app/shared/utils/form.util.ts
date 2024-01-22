import { FormGroup, FormControl, NgForm, FormArray } from '@angular/forms';
/**
 * 表单
 * 实例对象转为FormGroup类型
 * @param instanceObj
 * @returns
 */
function InstanceObjectToFormGroup<T = any>(instanceObj: T extends Object ? T : never): FormGroup {
  return new FormGroup(
    Object.keys(instanceObj).reduce((controls: { [key in string]: FormGroup | FormControl | FormArray }, key) => {
      let Tkey = (key as keyof T)
      // formArray
      if (Array.isArray(instanceObj[Tkey]) && (instanceObj[Tkey] as any[]).length > 0) {
        controls[key] = InstanceObjectToFormArray<typeof instanceObj[keyof T]>((instanceObj[Tkey] as any));
      } else if (instanceObj[Tkey] instanceof Object) {
        // formGroup
        controls[key] = InstanceObjectToFormGroup<typeof instanceObj[keyof T]>((instanceObj[Tkey] as any));
      } else {
        // formControl
        controls[key] = new FormControl(instanceObj[Tkey]);
      }
      return controls;
    }, {})
  );
}
function InstanceObjectToFormArray<T = any[]>(instanceArr: Array<T>): FormArray {
  for (let i = 0; i < instanceArr.length; i++) {
    let instance = instanceArr[i];

  }
  return new FormArray([new FormControl])
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
    const controls = ngForm.controls
    Object.keys(controls).forEach(key => {
        controls[key].markAsTouched();
    })
}
export {
  InstanceObjectToFormGroup,
  MarkTouchedControl,
  CheckValidate,
  ResetForm
};