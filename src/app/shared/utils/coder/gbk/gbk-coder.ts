import { isASCIICodePoint } from '../encoding';
import {
  decoderError,
  encoderError,
  floor,
  index,
  indexCodePointFor,
  indexPointerFor,
  inRange,
  isASCIIByte
} from '../encoding-tool';
import { Decoder, Encoder, end_of_stream, finished, SLStream } from '../encoding.type';
/**
 * GBK 解码，将二进制以GBK方式还原成字符
 * GB18030涵盖GBK GB2312字符 因此使用它通解
 * 兼容GBK需要前两字节与GBK一致
 * GBK 双字节
 * 第一字节0x81-0xFE 第二字节 0x40-0x7f（不包含0x7F) 和 0x80-0xFE
 * GB18030 四字节
 * 第一字节 第二字节 第三子节 第四字节
 * 0x81-0xfe    0x30-0x39    0x81-0xfe    0x30-0x39
 */
export class GB18030Decoder implements Decoder {
  gb18030_first = 0x00; // 第一字节标识
  gb18030_second = 0x00; // 第二字节
  gb18030_third = 0x00; // 第三字节
  fatal;
  constructor(options: any = {}) {
    this.fatal = options.fatal;
  }
  /**
   * @param {Stream} stream The stream of bytes being decoded.
   * @param {number} bite The next byte read from the stream. 判断解析完没
   * @return {?(number|!Array.<number>)} The next code point(s)
   *     decoded, or null if not enough data exists in the input
   *     stream to decode a complete code point.
   */
  handler(stream: SLStream, bite: number) {

    // 终止标识
    if (
      bite === end_of_stream &&
      this.gb18030_first === 0x00 &&
      this.gb18030_second === 0x00 &&
      this.gb18030_third === 0x00
    ) {
      return finished;
    }

    // 结束了 但是还有部分二进制没完全解析完成 说明解码不应该是这个类型 报错提示！
    if (
      bite === end_of_stream &&
      (this.gb18030_first !== 0x00 || this.gb18030_second !== 0x00 || this.gb18030_third !== 0x00)
    ) {
      this.gb18030_first = 0x00;
      this.gb18030_second = 0x00;
      this.gb18030_third = 0x00;
      decoderError(this.fatal);
    }
    var code_point;
    // 四字节内容
    if (this.gb18030_third !== 0x00) {
      code_point = null;
      // 第四个字节 符合范围
      if (inRange(bite, 0x30, 0x39)) {
        // 获取四字节gb18030映射点位。四字节可以表示百万个字符 但是对于中文在此区间其实不算多 所以对应映射表也不长
        code_point = this.indexGB18030RangesCodePointFor(
          (((this.gb18030_first - 0x81) * 10 + this.gb18030_second - 0x30) * 126 + this.gb18030_third - 0x81) * 10 +
            bite -
            0x30
        );
      }
      // 
      var buffer = [this.gb18030_second, this.gb18030_third, bite];


      this.gb18030_first = 0x00;
      this.gb18030_second = 0x00;
      this.gb18030_third = 0x00;


      if (code_point === null) {
        stream.prepend(buffer);
        return decoderError(this.fatal);
      }

      return code_point;
    }
    // 三字节内容
    if (this.gb18030_second !== 0x00) {
      // 第三字节符合范围
      if (inRange(bite, 0x81, 0xfe)) {
        this.gb18030_third = bite;
        return null;
      }
      // 重新修改字节流 变为前三字节流组合
      stream.prepend([this.gb18030_second, bite]);
      this.gb18030_first = 0x00; // 重置
      this.gb18030_second = 0x00; // 重置
      return decoderError(this.fatal);
    }

    // 两字节内容 可能是GBK编码了
    if (this.gb18030_first !== 0x00) {
      // 四字节情况的范围
      if (inRange(bite, 0x30, 0x39)) {
        this.gb18030_second = bite;
        return null;
      }
      // 否则是二字节情况
      var lead = this.gb18030_first; // 第一字节
      var pointer = null; // 查表索引
      this.gb18030_first = 0x00; // 重置字节范围
      // gb18030 二字节下不包括7f因此偏移 如果值大于7f 需要多减去一位 即0x41
      var offset = bite < 0x7f ? 0x40 : 0x41;

      // 判断第二字节范围合法 将gb18030值转为查表的索引 算法
      // lead第一字节值 范围 126 第二字节范围0xFE-0x40 = 190
      // 二维数组索引转一维数组 index = (i - 1) * xLen + j 【i为行 j为列，xLen为总列数】
      // 减去0x81 是因为lead从0x81开始 同理bite减去offset  
      if (inRange(bite, 0x40, 0x7e) || inRange(bite, 0x80, 0xfe)) pointer = (lead - 0x81) * 190 + (bite - offset);
 

      // 根据查表索引获取unicode的值
      code_point = pointer === null ? null : indexCodePointFor(pointer, index('gb18030'));

      // 如果结合第一字节和第二字节 找不到, 但是符合ASCII127内的字符 重新把它推入如果还能继续解析则以ASCII解析后续的流 但是整体已经是解析不对的
      if (code_point === null && isASCIIByte(bite)) stream.prepend(bite);
      // 后续的报错 如果允许容错则用替换字符替换 继续解析
      if (code_point === null) return decoderError(this.fatal);

      return code_point;
    }

    // 兼容ASCII 单字节 直接返回ASCII码位
    if (isASCIIByte(bite)) return bite;
    // 由于GB18030没有0x80范围 GB18030-2005添加了单字节欧元符号 以0x80表示替换欧元字符
    if (bite === 0x80) return 0x20ac;
    // 第一字节在范围内 说明有可能是双字节或四字节需要后续判断 设置第一字节码位
    if (inRange(bite, 0x81, 0xfe)) {
      this.gb18030_first = bite;
      return null;
    }

    // 9. Return error.
    return decoderError(this.fatal);
  }
  // gb18030-ranges对应索引表有点特殊[[offset, codepoint-offset],...]
  indexGB18030RangesCodePointFor(pointer: number) {
    // 1. If pointer is greater than 39419 and less than 189000, or
    // pointer is greater than 1237575, return null.
    // 对于gb18030码位超过 或者小于 
    if ((pointer > 39419 && pointer < 189000) || pointer > 1237575) return null;

    // 2. If pointer is 7457, return code point U+E7C7.
    if (pointer === 7457) return 0xe7c7;

    // 3. Let offset be the last pointer in index gb18030 ranges that
    // is equal to or less than pointer and let code point offset be
    // its corresponding code point.
    var offset = 0;
    var code_point_offset = 0;
    var idx = index('gb18030-ranges');
    var i;
    for (i = 0; i < idx.length; ++i) {
      /** @type {!Array.<number>} */
      var entry = idx[i];
      // 一个个遍历 直到找到第一个大于gb18030所在位置索引值
      if (entry[0] <= pointer) {
        // 
        offset = entry[0];
        code_point_offset = entry[1];
      } else {
        break;
      }
    }

    // 4. Return a code point whose value is code point offset +
    // pointer − offset.
    return code_point_offset + pointer - offset;
  }
}
// 11.2.2 gb18030 encoder
/**
 * unicode转为gbk二进制编码
 * @constructor
 * @implements {Encoder}
 * @param {{fatal: boolean}} options
 * @param {boolean=} gbk_flag 为true 则兼容gbk
 */
export class GB18030Encoder implements Encoder {
  private fatal;
  private gbk_flag;
  constructor(options: any = {}, gbk_flag: boolean = false) {
    this.fatal = options.fatal;
    this.gbk_flag = gbk_flag;
  }
  handler(stream: any, code_point: any) {
    // 1. If code point is end-of-stream, return finished.
    if (code_point === end_of_stream) return finished;

    // 2. If code point is an ASCII code point, return a byte whose
    // value is code point.
    if (isASCIICodePoint(code_point)) return code_point;

    // 3. If code point is U+E5E5, return error with code point.
    // GB18030-2005添加了单字节欧元符号 因此屏蔽了unicode ?? 不懂反正官方就这么定的。。
    if (code_point === 0xe5e5) return encoderError(code_point);

    // 4. If the gbk flag is set and code point is U+20AC, return
    // 0x20ac就是欧元字符€ 使用0x80替代
    if (this.gbk_flag && code_point === 0x20ac) return 0x80;

    // 5. Let pointer be the index pointer for code point in index
    // gb18030索引位置
    var pointer = indexPointerFor(code_point, index('gb18030'));

    // 6. If pointer is not null, run these substeps:
    if (pointer !== null) {
      // 1. Let lead be floor(pointer / 190) + 0x81.
      var lead = floor(pointer / 190) + 0x81;

      // 2. Let trail be pointer % 190.
      var trail = pointer % 190;

      // 3. Let offset be 0x40 if trail is less than 0x3F and 0x41 otherwise.
      // 双字节 第二字节开始是从0x40开始到0x7F(不包括7F) 0x80到0xFE，trail为0x3F说明实际的值是大于0x7F 要额外多加1点偏移除去7F
      var offset = trail < 0x3f ? 0x40 : 0x41;

      // 4. Return two bytes whose values are lead and trail + offset.
      return [lead, trail + offset];
    }

    // 前2字节没有解析出来gbk编码的字符
    if (this.gbk_flag) return encoderError(code_point);

    // 8. Set pointer to the index gb18030 ranges pointer for code
    // 上面没找到 说明是四字节
    pointer = this.indexGB18030RangesPointerFor(code_point);
    // 下面操作是把gb18030的值按照自身规则 分为4字节
    // 9. Let byte1 be floor(pointer / 10 / 126 / 10).
    var byte1 = floor(pointer / 10 / 126 / 10);

    // 10. Set pointer to pointer − byte1 × 10 × 126 × 10.
    pointer = pointer - byte1 * 10 * 126 * 10;

    // 11. Let byte2 be floor(pointer / 10 / 126).
    var byte2 = floor(pointer / 10 / 126);

    // 12. Set pointer to pointer − byte2 × 10 × 126.
    pointer = pointer - byte2 * 10 * 126;

    // 13. Let byte3 be floor(pointer / 10).
    var byte3 = floor(pointer / 10);

    // 14. Let byte4 be pointer − byte3 × 10.
    var byte4 = pointer - byte3 * 10;

    // 15. Return four bytes whose values are byte1 + 0x81, byte2 +
    // 0x30, byte3 + 0x81, byte4 + 0x30.
    return [byte1 + 0x81, byte2 + 0x30, byte3 + 0x81, byte4 + 0x30];
  }
  /**
   * @param {number} code_point The |code point| to locate in the gb18030 index.
   * @return {number} The first pointer corresponding to |code point| in the
   *     gb18030 index.
   */
  indexGB18030RangesPointerFor(code_point: number) {
    // 1. If code point is U+E7C7, return pointer 7457.
    if (code_point === 0xe7c7) return 7457;

    // 2. Let offset be the last code point in index gb18030 ranges
    // that is equal to or less than code point and let pointer offset
    // be its corresponding pointer.
    var offset = 0;
    var pointer_offset = 0;
    var idx = index('gb18030-ranges');
    var i;
    for (i = 0; i < idx.length; ++i) {
      /** @type {!Array.<number>} */
      var entry = idx[i];
      if (entry[1] <= code_point) {
        offset = entry[1];
        pointer_offset = entry[0];
      } else {
        break;
      }
    }

    // 3. Return a pointer whose value is pointer offset + code point
    // − offset.
    return pointer_offset + code_point - offset;
  }
}
