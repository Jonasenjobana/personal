abstract class BaseValidator {
  constructor() {}
  // 正整数
  
  // 正数
  // 小数点
  // 经纬度
  // ip
}
export class SLValidator extends BaseValidator {

}
export abstract class AsyncBaseValidator {
  constructor() {}
}
export function isNumber(value: any) {
    let num = Number(value)
    return !Number.isNaN(num)
}
export default {
  isNumber,
  BaseValidator
}