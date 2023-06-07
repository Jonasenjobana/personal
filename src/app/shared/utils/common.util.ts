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