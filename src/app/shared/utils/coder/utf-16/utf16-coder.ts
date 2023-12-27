import { decoderError, inRange } from '../encoding-tool';
import { Decoder, Encoder, end_of_stream, finished, SLStream } from '../encoding.type';

/**
 * @constructor
 * @implements {Decoder}
 * @param {boolean} utf16_be 大小字端 为true 大字端，false小字端
 * @param {{fatal: boolean}} options
 */
export class UTF16Decoder implements Decoder {
  private fatal: boolean = false;
  private utf16_lead_byte: number | null = null; // 低半区
  private utf16_lead_surrogate: number | null = null; // 高代理区
  private utf16_be: boolean; // true 大字端 false 小字端
  constructor(utf16_be: boolean, options: any = {}) {
    this.fatal = options.fatal;
    this.utf16_be = utf16_be;
  }
  /**
   * @param {SLStream} stream The stream of bytes being decoded.
   * @param {number} bite The next byte read from the stream.
   * @return {?(number|!Array.<number>)} The next code point(s)
   *     decoded, or null if not enough data exists in the input
   *     stream to decode a complete code point.
   */
  handler(stream: SLStream, bite: number): number | number[] | TypeError | null {
    // 1. If byte is end-of-stream and either utf-16 lead byte or
    // utf-16 lead surrogate is not null, set utf-16 lead byte and
    // utf-16 lead surrogate to null, and return error.
    if (bite === end_of_stream && (this.utf16_lead_byte !== null || this.utf16_lead_surrogate !== null)) {
      return decoderError(this.fatal);
    }

    // 完成
    if (bite === end_of_stream && this.utf16_lead_byte === null && this.utf16_lead_surrogate === null) {
      return finished;
    }

    // 设置完第一字节值 
    if (this.utf16_lead_byte === null) {
      this.utf16_lead_byte = bite;
      return null;
    }

    var code_unit;
    if (this.utf16_be) {
      // 大字端
      // 第一字节值左移8位 留空8个0 给当前字节 加上 高位在前
      code_unit = (this.utf16_lead_byte << 8) + bite;
    } else {
      // 小字端
      // 第二字节值左移8位 留空8个0给第一字节值 加上 低位在前
      code_unit = (bite << 8) + this.utf16_lead_byte;
    }
    this.utf16_lead_byte = null;

    // 如果代理位有值
    if (this.utf16_lead_surrogate !== null) {
      var lead_surrogate = this.utf16_lead_surrogate;
      this.utf16_lead_surrogate = null; // 重置

      /**
        * 1101110000000000 - 1101111111111111 低半区
        * 由于Unicode在转utf-16是已经减去了0x10000 所以需要加回来
        * lead_surrogate - 0xd800 相当于 只取后10位
        * (lead_surrogate - 0xd800) * 0x400 相当于乘以 2 ^ 10 可以左移10位替代？
        * code_unit - 0xdc00 取低半区后十位
        */
      if (inRange(code_unit, 0xdc00, 0xdfff)) {
        return 0x10000 + (lead_surrogate - 0xd800) * 0x400 + (code_unit - 0xdc00);
      }

      stream.prepend(convertCodeUnitToBytes(code_unit, this.utf16_be));
      return decoderError(this.fatal);
    }

    // 1101100000000000 - 1101101111111111 符合高代理区 范围 继续处理后面字节
    if (inRange(code_unit, 0xd800, 0xdbff)) {
      this.utf16_lead_surrogate = code_unit;
      return null;
    }

    // 1101110000000000 - 1101111111111111
    // 高代理区值不对在正确范围 返回错误
    if (inRange(code_unit, 0xdc00, 0xdfff)) return decoderError(this.fatal);

    // 返回 unicode值
    return code_unit;
  }
}

/**
 * @constructor
 * @implements {Encoder}
 * @param {boolean} utf16_be True if big-endian, false if little-endian.
 * @param {{fatal: boolean}} options
 */
export class UTF16Encoder implements Encoder {
  private fatal: boolean = false;
  private utf16_be: boolean = false;
  constructor(utf16_be: boolean, options: any = {}) {
    this.fatal = options.fatal;
    this.utf16_be = utf16_be;
  }
  /**
   * @param {SLStream} stream Input stream.
   * @param {number} code_point Next code point read from the stream.
   * @return {(number|!Array.<number>)} Byte(s) to emit.
   */
  handler(stream: SLStream, code_point: number): number | number[] {
    // 1. If code point is end-of-stream, return finished.
    if (code_point === end_of_stream) return finished;

    // 小于0x10000直接返回Unicode值 但是需要时两字节
    if (inRange(code_point, 0x0000, 0xffff)) return convertCodeUnitToBytes(code_point, this.utf16_be);

    // 3. Let lead be ((code point − 0x10000) >> 10) + 0xD800,
    // converted to bytes using utf-16be encoder flag.
    // 大于0xffff则需要代理区
    // 设置高代理区
    var lead = convertCodeUnitToBytes(((code_point - 0x10000) >> 10) + 0xd800, this.utf16_be);

    // 4. Let trail be ((code point − 0x10000) & 0x3FF) + 0xDC00,
    // converted to bytes using utf-16be encoder flag.
    // 设置低半区
    var trail = convertCodeUnitToBytes(((code_point - 0x10000) & 0x3ff) + 0xdc00, this.utf16_be);

    // 5. Return a byte sequence of lead followed by trail.
    // 合并成四字节
    return lead.concat(trail);
  }
}
/**
 * 把合并成两字节的值还原成两个单字节数组
 * @param {number} code_unit
 * @param {boolean} utf16be
 * @return {!Array.<number>} bytes
 */
function convertCodeUnitToBytes(code_unit: number, utf16be: boolean) {
  // 1. Let byte1 be code unit >> 8.
  var byte1 = code_unit >> 8;

  // 2. Let byte2 be code unit & 0x00FF.
  var byte2 = code_unit & 0x00ff;

  // 3. Then return the bytes in order:
  // utf-16be flag is set: byte1, then byte2.
  if (utf16be) return [byte1, byte2];
  // utf-16be flag is unset: byte2, then byte1.
  return [byte2, byte1];
}
