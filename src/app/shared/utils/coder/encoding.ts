import { decoders, encoders, label_to_encoding } from './encoding-config';
import {
  includes,
  isASCIIByte,
  toDictionary
} from './encoding-tool';
import { Decoder, DEFAULT_ENCODING, Encoder, end_of_stream, finished, SLStream } from './encoding.type';
/**
 * 判断是否是ASCII码
 * ASCII码范围在00 - 7F之间
 */
export const isASCIICodePoint = isASCIIByte;

/**
 * utf-16编码规则
 * @param {string} string Input string of UTF-16 code units.
 * @return {!Array.<number>} Code points.
 */
function stringToCodePoints(string: string): number[] {
  let s = String(string);
  let n = s.length;
  let i = 0;
  let u: number[] = [];
  while (i < n) {
    // 不一定每个字符索引和charcodeAt索引一致，如果unicode值大于65535超过了utf-16表示范围 就会使用代理对表示，导致占用2个字符位
    // 😂像这种表情它的长度为2 s.charCodeAt(0) 和 s.charCodeAt(1) 组成代理对
    let c = s.charCodeAt(i);
    // 1101100000000000  1101111111111111
    // 说明当前不在代理范围内，直接就表示unicode的值
    // 如果在代理范围 由高低代理表示unicode值 此时需要高低两个组合才能表示一个unicode
    if (c < 0xd800 || c > 0xdfff) {
      // Append to U the Unicode character with code point c.
      u.push(c);
    }

    // 不合法范围使用�代替，因此导致不同编码转化会丢失信息
    // dc00 为
    else if (0xdc00 <= c && c <= 0xdfff) {
      u.push(0xfffd);
    }
    // 1101100000000000 1101101111111111
    // 说明当前码位是高代理区
    else if (0xd800 <= c && c <= 0xdbff) {

      // 如果最后一个字符但是码位还是高代理区说明肯定解析不出来 使用 � 代替
      if (i === n - 1) {
        u.push(0xfffd);
      }
      else {
        // 下一个字符
        let d = s.charCodeAt(i + 1);

        // 1101110000000000 1101111111111111
        // 说明当前字符和下一个字符组成代理区，两个码位表示 一个字符
        if (0xdc00 <= d && d <= 0xdfff) {
          // 3ff 二进制为1111111111

          // 取c后10位
          let a = c & 0x3ff; // 当前字符二进制后十位

          // 取d后10位
          let b = d & 0x3ff; // 下一字符二进制后十位

          // 前十位和后十位组成UNICODE的值
          u.push(0x10000 + (a << 10) + b);

          i += 1;
        }

        // 不符合低代理区 区间 说明也是一个不合法的二进制 使用�代替
        else {
          u.push(0xfffd); // � 
        }
      }
    }

    // 3. Set i to i+1.
    i += 1;
  }

  // 6. Return U.
  return u;
}

/**
 * Unicode返回字符
 * @param {!Array.<number>} code_points Array of code points.
 * @return {string} string String of UTF-16 code units.
 * 
 */
function codePointsToString(code_points: number[]) {
  let s = '';
  for (let i = 0; i < code_points.length; ++i) {
    let cp = code_points[i];
    // unicode码元和utf-16码元一一对应
    if (cp <= 0xffff) {
      s += String.fromCharCode(cp);
    } else {
      // Unicode码元大于65535 utf-16是通过2个代理区 表示一个字符
      cp -= 0x10000;
      s += String.fromCharCode((cp >> 10) + 0xd800, (cp & 0x3ff) + 0xdc00);
    }
  }
  return s;
}


/**
 * 相同规则但不同编码名将统一成一个编码名
 * @param {string} label The encoding label.
 * @return {?{name:string,labels:Array.<string>}}
 */
export function getEncoding(label: string): { labels: string[]; name: string } | null {
  // 小写
  label = String(label).trim().toLowerCase();

  if (Object.prototype.hasOwnProperty.call(label_to_encoding, label)) {
    return label_to_encoding[label];
  }
  return null;
}

/**
 * @constructor
 * @param {string=} label 编码名
 *     默认'utf-8'.
 * @param {Object=} options
 */
export class SLTextDecoder {
  private _encoding: { labels: string[]; name: string };
  private _decoder: Decoder | null = null; // 解码器
  private _ignoreBOM: any;
  private _BOMseen: boolean = false;
  private _error_mode: string = ''; // fatal意味着解码出现无效出现typeError报错否则使用替换字符
  private _do_not_flush: boolean = false;
  get encoding() {
    return this._encoding.name.toLowerCase();
  }
  get fatal() {
    return this._error_mode === 'fatal';
  }
  get ignoreBOM() {
    return this._ignoreBOM;
  }
  constructor(label: string, options: any = {}) {
    // 统一相同规则编码名
    let encoding = getEncoding(label);

    // 不支持解码以及空
    if (encoding === null || encoding.name === 'replacement') throw RangeError('Unknown encoding: ' + label);
    if (!decoders[encoding.name]) {
      throw Error('Decoder not present.' + ' Did you forget to include ENCODING_INDEXES.js first?');
    }

    this._encoding = encoding;

    // 配置 有fatal 则解析失败报错
    if (Boolean(options['fatal'])) this._error_mode = 'fatal';

    // BOM相当于解析头部有声明大小字端的前两字节，默认忽略BOM
    if (Boolean(options['ignoreBOM'])) this._ignoreBOM = true;
  }
  decode(input: ArrayBuffer | { buffer: ArrayBuffer, byteOffset: number, byteLength: number }, options: any = {}): any {
    let bytes;
    if (typeof input === 'object' && input instanceof ArrayBuffer) {
      bytes = new Uint8Array(input);
    } else if (typeof input === 'object' && 'buffer' in input && input.buffer instanceof ArrayBuffer) {
      bytes = new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
    } else {
      bytes = new Uint8Array(0);
    }

    options = toDictionary(options);

    // 1. If the do not flush flag is unset, set decoder to a new
    // encoding's decoder, set stream to a new stream, and unset the
    // BOM seen flag.
    if (!this._do_not_flush) {
      this._decoder = decoders[this._encoding.name]({
        fatal: this._error_mode === 'fatal'
      });
      this._BOMseen = false;
    }

    // 2. If options's stream is true, set the do not flush flag, and
    // unset the do not flush flag otherwise.
    this._do_not_flush = Boolean(options['stream']);

    // 内置处理字节数组一些方法
    let input_stream = new SLStream(bytes);

    // 解码完成的unicode数组集合
    let output: number[] = [];

    /** @type {?(number|!Array.<number>)} */
    let result: number | number[];

    while (true) {
      // 每次读一字节
      let token = input_stream.read();
      if (token === end_of_stream) break;

      // 根据解码工厂函数返回解码器获取字符串
      result = this._decoder!.handler(input_stream, token);

      // 结束 将Unicode值序列化为字符串
      if (result === finished) break;
      // 解析出unicode值
      if (result !== null) {
        if (Array.isArray(result)) output.push.apply(output, /**@type {!Array.<number>}*/ result);
        else output.push(result);
      }

      // 3. Otherwise, if result is error, throw a TypeError.
      // (Thrown in handler)

      // 4. Otherwise, do nothing.
    }
    // TODO: Align with spec algorithm.
    if (!this._do_not_flush) {
      do {
        result = this._decoder!.handler(input_stream, input_stream.read());
        if (result === finished) break;
        if (result === null) continue;
        if (Array.isArray(result)) output.push.apply(output, /**@type {!Array.<number>}*/ result);
        else output.push(result);
      } while (!input_stream.endOfStream());
      this._decoder = null;
    }

    return this.serializeStream(output);
  }

  // 将解析成unicode替换的二进制序列化为utf-16字符
  /**
   * @param {!Array.<number>} stream
   * @return {string}
   * @this {TextDecoder}
   */
  serializeStream(stream: number[]) {
    // 1. Let token be the result of reading from stream.
    // (Done in-place on array, rather than as a stream)

    // 2. If encoding is UTF-8, UTF-16BE, or UTF-16LE, and ignore
    // BOM flag and BOM seen flag are unset, run these subsubsteps:
    if (includes(['UTF-8', 'UTF-16LE', 'UTF-16BE'], this._encoding.name) && !this._ignoreBOM && !this._BOMseen) {
      // 前缀BOM 字节顺序标记 告知系统前2个字节是什么编码类型以及字节顺序 大字端还是小字端 FEFF 为大字端
      if (stream.length > 0 && stream[0] === 0xfeff) {
        // FEFF 大字端
        this._BOMseen = true;
        stream.shift();
      } else if (stream.length > 0) {
        // 2. Otherwise, if token is not end-of-stream, set BOM seen
        // flag and append token to stream.
        this._BOMseen = true;
      } else {
        // 3. Otherwise, if token is not end-of-stream, append token
        // to output.
        // (no-op)
      }
    }
    // 4. Otherwise, return output.
    return codePointsToString(stream);
  }
}
/**
 * 
 * @constructor
 * @param {string=} label The label of the encoding. NONSTANDARD.
 * @param {Object=} options NONSTANDARD.
 */
export class SLTextEncoder {
  private _encoding: { labels: string[]; name: string };
  private _encoder: Encoder | null = null;
  private _do_not_flush: boolean = false;
  private _fatal: 'fatal' | 'replacement'; // fatal 解析错误 直接报错 否则 'replacement'替换字符继续解析
  /**默认utf-8编码 */
  constructor(label: string = DEFAULT_ENCODING, options: any = {}) {
    options = toDictionary(options);
    this._fatal = Boolean(options['fatal']) ? 'fatal' : 'replacement';
    if (Boolean(options['NONSTANDARD_allowLegacyEncoding'])) {
      // NONSTANDARD behavior.
      label = label !== undefined ? String(label) : DEFAULT_ENCODING;
      let encoding = getEncoding(label);
      if (encoding === null || encoding.name === 'replacement') throw RangeError('Unknown encoding: ' + label);
      if (!encoders[encoding.name]) {
        throw Error('Encoder not present.' + ' Did you forget to include ENCODING_INDEXES.js first?');
      }
      this._encoding = encoding;
    } else {
      // Standard behavior.
      this._encoding = getEncoding(label)!;

      if (label !== undefined && console) {
        console.warn('TextEncoder constructor called with encoding label, ' + 'which is ignored.');
      }
    }
  }
  public get encoding(): string {
    return this._encoding.name.toLowerCase();
  }
  encode(opt_string: string, options: any = {}) {
    opt_string = opt_string === undefined ? '' : String(opt_string);
    options = toDictionary(options);

    // NOTE: This option is nonstandard. None of the encodings
    // permitted for encoding (i.e. UTF-8, UTF-16) are stateful when
    // the input is a USVString so streaming is not necessary.
    if (!this._do_not_flush)
      this._encoder = encoders[this._encoding.name]({
        fatal: this._fatal === 'fatal'
      });

    this._do_not_flush = Boolean(options['stream']);

    // 1. Convert input to a stream.
    // utf-16转unicode
    let input = new SLStream(stringToCodePoints(opt_string));
     
    // 2. Let output be a new stream
    let output: any = [];

    /** @type {?(number|!Array.<number>)} */
    let result;
    while (true) {
      // 1. Let token be the result of reading from input.
      let token = input.read();

      if (token === end_of_stream) break;
      // 2. Let result be the result of processing token for encoder,
      // input, output.
      result = this._encoder!.handler(input, token);
      if (result === finished) break;
      if (Array.isArray(result)) output.push.apply(output, /**@type {!Array.<number>}*/ result);
      else output.push(result);
    }
    // TODO: Align with spec algorithm.
    if (!this._do_not_flush) {
      while (true) {
        result = this._encoder!.handler(input, input.read());
        if (result === finished) break;
        if (Array.isArray(result)) output.push.apply(output, /**@type {!Array.<number>}*/ result);
        else output.push(result);
      }
      this._encoder = null;
    }
    // 3. If result is finished, convert output into a byte sequence,
    // and then return a Uint8Array object wrapping an ArrayBuffer
    // containing output.
    return new Uint8Array(output);
  }
}