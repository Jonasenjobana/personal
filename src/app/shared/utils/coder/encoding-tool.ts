import { ENCODING_INDEXES } from "./encoding-indexes"

/**
 * 是否在范围内
 * @param {number} a The number to test.
 * @param {number} min The minimum value in the range, inclusive.
 * @param {number} max The maximum value in the range, inclusive.
 * @return {boolean} True if a >= min and a <= max.
 */
function inRange(a: number, min: number, max: number): boolean {
  return min <= a && a <= max
}

/**
 * 是否在数组内
 * @param {!Array.<*>} array The array to check.
 * @param {*} item The item to look for in the array.
 * @return {boolean} True if the item appears in the array.
 */
function includes<T = any>(array: Array<T>, item: T): boolean {
  return array.indexOf(item) !== -1
}
const floor = Math.floor
/**
 * 判断是否是ASCII字符0-127范围
 * @param {number} a The number to test.
 * @return {boolean} True if a is in the range 0x00 to 0x7F, inclusive.
 */
function isASCIIByte(a: number): boolean {
  return 0x00 <= a && a <= 0x7f
}

/**
 * 解码错误
 * @param {boolean} fatal 是否抛出错误
 * @param {number=} opt_code_point 解码错误具体值
 * @return {number} 返回解码错误具体值
 */
function decoderError(fatal: boolean = false, opt_code_point?: any): TypeError | number {
  if (fatal) throw TypeError('Decoder error')
  return opt_code_point || 0xfffd
}

/**
 * 编码错误
 * @param {number} code_point 值不可被编码
 * @return {number} 直接抛错 不返回值
 */
function encoderError(code_point: any): TypeError {
  throw TypeError('The code point ' + code_point + ' could not be encoded.')
}
/**
 * 根据索引返回映射表内的值 实际代表Unicode值
 * @param {number} pointer The |pointer| to search for.
 * @param {(!Array.<?number>|undefined)} index The |index| to search within.
 * @return {?number} The code point corresponding to |pointer| in |index|,
 *     or null if |code point| is not in |index|.
 */
function indexCodePointFor(pointer: any, index: any) {
  if (!index) return null
  return index[pointer] || null
}

/**
 * 根据Unicode值返回映射表的索引
 * @param {number} code_point The |code point| to search for.
 * @param {!Array.<?number>} index The |index| to search within.
 * @return {?number} The first pointer corresponding to |code point| in
 *     |index|, or null if |code point| is not in |index|.
 */
function indexPointerFor(code_point: any, index: any) {
  var pointer = index.indexOf(code_point)
  return pointer === -1 ? null : pointer
}

/**
 * 统一相同规则的别名
 * @param {string} name Name of the index.
 * @return {(!Array.<number>|!Array.<Array.<number>>)}
 *  */
function index(name: any) {
  return ENCODING_INDEXES[name]
}
/**
 * 用于判断options
 * 编码解码配置
 * 返回对象类型
 * @param o 
 * @returns 
 */
function toDictionary(o: any) {
  if (o === undefined) return {};
  if (o === Object(o)) return o;
  throw TypeError('Could not convert argument to dictionary');
}
export { inRange, includes, floor, isASCIIByte, encoderError, decoderError, index, indexPointerFor, indexCodePointFor, toDictionary }
