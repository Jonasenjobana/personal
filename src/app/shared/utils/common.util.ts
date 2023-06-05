import * as _ from 'lodash'
export const ZqCommonUtils = {
    copyDeep,
    isObject
}
/**
 * 深拷贝
 * 只针对对象深拷贝 不支持symbol map set date等
 * @param obj 
 * @returns 
 */
function copyDeep(obj: any): any {
    return _.cloneDeep(obj)
}
/**是否是对象 */
function isObject(obj: any) {
    return typeof obj === 'object'
}