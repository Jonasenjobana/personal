import { isASCIICodePoint } from "../encoding";
import { decoderError, inRange } from "../encoding-tool";
import { Decoder, Encoder, end_of_stream, finished, SLStream } from "../encoding.type";

/**
 * utf-8解码器 返回Unicode值
 * utf-8编码规则
 * unicode值小于等于127 直接 0xxx xxxx
 * 否则 设Unicode总字节数为n>1
 *          第一部分   | 第二部分  | 第三部分
 * 双字节：  110 xxxxx | 10 xxxxxx |
 * 三字节：  1110 xxxx | 10 xxxxxx | 10 xxxxxx
 * 四字节：  1111 0xxx | 10 xxxxxx | 10 xxxxxx | 10 xxxxxx
 * @constructor
 * @implements {Decoder}
 * @param {{fatal: boolean}} options
 */
 export class UTF8Decoder implements Decoder {
    // utf-8's decoder's has an associated utf-8 code point, utf-8
    // bytes seen, and utf-8 bytes needed (all initially 0), a utf-8
    // lower boundary (initially 0x80), and a utf-8 upper boundary
    // (initially 0xBF).
    utf8_code_point: number;
    utf8_bytes_seen: number;
    utf8_bytes_needed: number;
    utf8_lower_boundary: number; // 第二，三部分边界
    utf8_upper_boundary: number; // 第二，三部分边界
    fatal;
    constructor(options: any = {}) {
      this.fatal = options.fatal;
      this.utf8_code_point = 0;
      this.utf8_bytes_seen = 0;
      this.utf8_bytes_needed = 0; // unicode总字节数
      this.utf8_lower_boundary = 0x80; // 1000 0000 最低位
      this.utf8_upper_boundary = 0xbf; // 1011 1111 最高位
    }
    /**
     * @param {SLStream} stream 字节数组.
     * @param {number} bite 解析字节
     * @return {?(number|!Array.<number>)} 返回Unicode值 如果为null说明解析完成
     */
    handler(stream: SLStream, bite: number): number[] | number | TypeError | null {
      // 1. If byte is end-of-stream and utf-8 bytes needed is not 0,
      // set utf-8 bytes needed to 0 and return error.
      if (bite === end_of_stream && this.utf8_bytes_needed !== 0) {
        this.utf8_bytes_needed = 0;
        return decoderError(this.fatal);
      }
  
      // 2. If byte is end-of-stream, return finished.
      if (bite === end_of_stream) return finished;
  
      // 3. If utf-8 bytes needed is 0, based on byte:
      if (this.utf8_bytes_needed === 0) {
        // 0x00 to 0x7F
        // utf-8编码二进制在ascii内 127
        if (inRange(bite, 0x00, 0x7f)) {
          // Return a code point whose value is byte.
          return bite;
        }
  

        // 1100 0010 - 1101 1111
        // 第一个字节部分 说明是双字节utf-8
        else if (inRange(bite, 0xc2, 0xdf)) {
          // 1. Set utf-8 bytes needed to 1.
          this.utf8_bytes_needed = 1;
  
          // 2. Set UTF-8 code point to byte & 0x1F.
          // 取后5位 为unicode前5位的部分
          this.utf8_code_point = bite & 0x1f;
        }
  
        // 0xE0 to 0xEF
        // 1110 0000 - 1110 1111
        // 第一字节部分 说明是三字节的utf-8
        else if (inRange(bite, 0xe0, 0xef)) {
          // 1110 0000 unicode表示前四位都是0了 那么剩下最少位数不能低于 10 0000 不然表示不了 0000 10 0000
          if (bite === 0xe0) this.utf8_lower_boundary = 0xa0; // 1010 0000
          // 2. If byte is 0xED, set utf-8 upper boundary to 0x9F.
          if (bite === 0xed) this.utf8_upper_boundary = 0x9f; // 1001 1111
          // 3. Set utf-8 bytes needed to 2.
          this.utf8_bytes_needed = 2;
          // 4. Set UTF-8 code point to byte & 0xF.
          this.utf8_code_point = bite & 0xf;
        }
  
        // 0xF0 to 0xF4
        // 1111 0000 - 1111 0100
        // 取第一字节段
        // Unicode 占3字节
        else if (inRange(bite, 0xf0, 0xf4)) {
          // 1. If byte is 0xF0, set utf-8 lower boundary to 0x90.
          if (bite === 0xf0) this.utf8_lower_boundary = 0x90;
          // 2. If byte is 0xF4, set utf-8 upper boundary to 0x8F.
          if (bite === 0xf4) this.utf8_upper_boundary = 0x8f;
          // 3. Set utf-8 bytes needed to 3.
          this.utf8_bytes_needed = 3;
          // 4. Set UTF-8 code point to byte & 0x7.
          this.utf8_code_point = bite & 0x7;
        }
  
        // Otherwise
        else {
          // Return error.
          return decoderError(this.fatal);
        }
  
        // Return continue.
        return null;
      }
  
      // 4. If byte is not in the range utf-8 lower boundary to utf-8
      // upper boundary, inclusive, run these substeps:
      if (!inRange(bite, this.utf8_lower_boundary, this.utf8_upper_boundary)) {
        // 1. Set utf-8 code point, utf-8 bytes needed, and utf-8
        // bytes seen to 0, set utf-8 lower boundary to 0x80, and set
        // utf-8 upper boundary to 0xBF.
        this.utf8_code_point = this.utf8_bytes_needed = this.utf8_bytes_seen = 0;
        this.utf8_lower_boundary = 0x80;
        this.utf8_upper_boundary = 0xbf;
  
        // 2. Prepend byte to stream.
        stream.prepend(bite);
  
        // 3. Return error.
        return decoderError(this.fatal);
      }
  
      // 5. Set utf-8 lower boundary to 0x80 and utf-8 upper boundary
      // to 0xBF.
      this.utf8_lower_boundary = 0x80;
      this.utf8_upper_boundary = 0xbf;
  
      // 6. Set UTF-8 code point to (UTF-8 code point << 6) | (byte &
      // 0x3F)
      this.utf8_code_point = (this.utf8_code_point << 6) | (bite & 0x3f);
  
      // 7. Increase utf-8 bytes seen by one.
      this.utf8_bytes_seen += 1;
  
      // 8. If utf-8 bytes seen is not equal to utf-8 bytes needed,
      // continue.
      if (this.utf8_bytes_seen !== this.utf8_bytes_needed) return null;
  
      // 9. Let code point be utf-8 code point.
      let code_point = this.utf8_code_point;
  
      // 10. Set utf-8 code point, utf-8 bytes needed, and utf-8 bytes
      // seen to 0.
      this.utf8_code_point = this.utf8_bytes_needed = this.utf8_bytes_seen = 0;
  
      // 11. Return a code point whose value is code point.
      return code_point;
    }
  }
  
  // 9.1.2 utf-8 encoder
  /**
   * @constructor
   * @implements {Encoder}
   * @param {{fatal: boolean}} options
   */
  export class UTF8Encoder implements Encoder {
    private fatal: boolean;
    constructor(options: any = {}) {
      this.fatal = options.fatal;
    }
    /**
     * @param {Stream} stream 当前字符 unicode二进制 包装的stream.
     * @param {number} code_point 下一字符的unicode值
     * @return {(number|!Array.<number>)} Byte(s) to emit.
     */
    handler(stream: any, code_point: any) {
      // 1. If code point is end-of-stream, return finished.
      if (code_point === end_of_stream) return finished;
  
      // 2. If code point is an ASCII code point, return a byte whose
      // value is code point.
      // ascii使用单字节存储直接就是Unicode的值
      if (isASCIICodePoint(code_point)) return code_point;
  
      // 3. Set count and offset based on the range code point is in:
      let count: number = 0; // 表示： 除去第一个字节， 剩余10 xxxxx 开头的字节数
      let offset: number = 0; //
      // U+0080 to U+07FF, inclusive:
      // 双字节
      if (inRange(code_point, 0x0080, 0x07ff)) {
        // 1 and 0xC0
        count = 1;
        offset = 0xc0; // 110x xxxx 10 xxxxxx
      }
      // U+0800 to U+FFFF, inclusive:
      // 三字节
      else if (inRange(code_point, 0x0800, 0xffff)) {
        // 2 and 0xE0
        count = 2;
        offset = 0xe0; // 1110 xxxx
      }
      // U+10000 to U+10FFFF, inclusive:
      // 四字节
      else if (inRange(code_point, 0x10000, 0x10ffff)) {
        // 3 and 0xF0
        count = 3;
        offset = 0xf0; // 1111 0xxx
      }
  
      // 4. Let bytes be a byte sequence whose first byte is (code
      // point >> (6 × count)) + offset.
      // 设好第一个字节的值 取unicode前n个 6*count表示 无视这组二进制数后多少位 保留前剩余位数 刚好是填入到第一字节开头
      let bytes = [(code_point >> (6 * count)) + offset];
  
      // 5. Run these substeps while count is greater than 0:
      // 填入 剩余10 xxxxxx 
      while (count > 0) {
        // 1. Set temp to code point >> (6 × (count − 1)).
        let temp = code_point >> (6 * (count - 1));
  
        // 2. Append to bytes 0x80 | (temp & 0x3F).
        // temp & 0x3F表示取temp后6位 表示00xxxxxx ；0x80 | xx 表示前两位必须得是10 xxxxxx
        bytes.push(0x80 | (temp & 0x3f));
  
        // 3. Decrease count by one.
        count -= 1;
      }
  
      // 6. Return bytes bytes, in order.
      return bytes;
    }
  }
  