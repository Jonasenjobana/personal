import * as _ from 'lodash'
 export function copyDeep(obj: any): any {
    return _.cloneDeep(obj)
}
export function isString(value: any): boolean {
    return value && typeof value === 'string';
}
export function isCallback(cb: any): boolean {
    return cb != undefined && typeof cb == 'function';
}

export function isNotNil(value: any): boolean {
    return typeof value !== 'undefined' && value !== null;
}

// 判断是否是正则
export function isRegExp(value: any): boolean {
    return value && typeof value === 'object' && value.constructor === RegExp;
}

//字符串数组不为空
export function isNotEmpty(str: string | Array<any> | number | null | undefined) {
    return !isEmpty(str);
}

//空值
export function isEmpty(str: string | Array<any> | number | null | undefined) {
    return (
        !isNotNil(str) ||
        (typeof str === 'string' && str.trim().length == 0) ||
        (typeof str == 'number' && isNaN(str)) ||
        (typeof str === 'object' && str instanceof Array && str.length == 0)
    );
}

/**
 * 解决Object.assign把原有配置全替换
 * 只替换更新的部分
 * @param force 是否全替换
 */
 export function updateOption(oldOpt: any, newOpt: any, force: boolean = false) {
    if (force) return Object.assign({}, oldOpt, newOpt)
    let item: any = {}
    Object.keys(newOpt).forEach(key => {
      const hasOldKey = oldOpt.hasOwnProperty(oldOpt, key)
      // 旧配置没有直接添加进去
      if (!hasOldKey) {
        item[key] = newOpt[key]
        item = Object.assign({}, oldOpt, item)
      } else {
        const newItem = newOpt[key], oldItem = oldOpt[key]
        if (typeof newItem == 'object' && !Array.isArray(newItem)) {
          // 更新的子项
          const updateItem = updateOption(oldItem, newItem)
          item[key] = updateItem
          item = Object.assign({}, oldOpt, item)
        } else {
          item[key] = newItem
        }
      }
    })
    return item
  }