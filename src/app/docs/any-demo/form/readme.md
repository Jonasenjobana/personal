# 响应式表单
1. 需要引入ReactiveFormsModule
## 使用FormBuilder构建
```typescript
fb = inject(FormBuilder);
formgroup = this.fb.group({
    // 含校验器
    name: ['', 同步校验器, 异步校验器], 
    // 简单值 无校验器
    note: '',
})
也可以用FormGroup创建 会比较麻烦 但是类型提示会完善点
1. 只能有一个校验器生效，同步优先
2. 如果自定义控件内部继承validate 并且创建内部校验器 则会被fromgroup覆盖
```
## 自定义控件 套娃表单组合成更大表单
如果有多个表单内部 一部分有公共表单，可以提取出来 将这部分公共表单 定义为控件
```typescript
  template: `
  <form #formRef>
    // 公共表单部分
  </form>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Form2TestComponent),
      multi: true
    }
  ]
  // ...
  formRef = viewChild('formRef', {read:NgForm})
  ngAfterViewInit() {
    this.formRef.valueChange.subscribe(() => {
        // 注册好changeFn 响应下
        this.changeFn();
    })
  }
```
## 校验
1. 获取NgForm实例 属性valid
2. 如果用FormGroup 则通过FormGroup 的valid
## 更新FormGroup
- setValue
- patchValue
- reset

## 样式设置
- markAsTouched
- markAsDirty
- markAsUnTouched
... 
# 模板驱动表单
定义好form后
完全由ngModel双向绑定 + name自动创建FormGroup FormControl， 不需要手动创建FormGroup FormControl
指令驱动校验器
