/**
 * A stream represents an ordered sequence of tokens.
 *
 * @constructor
 * @param {!(Array.<number>|Uint8Array)} tokens Array of tokens that provide
 * the stream.
 * 包装number数组 一些方法
 */
class SLStream {
  private readonly end_of_stream = -1 // 终止标识符
  tokens: number[] = []
  constructor(tokens: any) {
    this.tokens = [].slice.call(tokens)
    // Reversed as push/pop is more efficient than shift/unshift.
    // 提前反转数组 用push和pop取代shift和unshift 因为性能比shift和unshift好
    this.tokens.reverse()
  }
  /**
   * @return {boolean} True if end-of-stream has been hit.
   */
  endOfStream(): boolean {
    return !this.tokens.length
  }

  /**
   * 获取字节流第一个字节
   * When a token is read from a stream, the first token in the
   * stream must be returned and subsequently removed, and
   * end-of-stream must be returned otherwise.
   *
   * @return {number} Get the next token from the stream, or
   * end_of_stream.
   */
  read(): number {
    if (!this.tokens.length) return this.end_of_stream
    return (this.tokens.pop())!
  }

  /**
   * 把字节数组或单字节推入到字节流前排
   * When one or more tokens are prepended to a stream, those tokens
   * must be inserted, in given order, before the first token in the
   * stream.
   *
   * @param {(number|!Array.<number>)} token The token(s) to prepend to the
   * stream.
   */
  prepend(token: number | number[]) {
    if (Array.isArray(token)) {
      let tokens = /**@type {!Array.<number>}*/ token
      while (tokens.length) this.tokens.push((tokens.pop())!)
    } else {
      this.tokens.push(token)
    }
  }

  /**
   * 字节流后续补充新的字节或字节流
   * When one or more tokens are pushed to a stream, those tokens
   * must be inserted, in given order, after the last token in the
   * stream.
   *
   * @param {(number|!Array.<number>)} token The tokens(s) to push to the
   * stream.
   */
  push(token: number | number[]): void {
    if (Array.isArray(token)) {
      let tokens: number[] = token || []
      while (tokens.length) this.tokens.unshift((tokens.shift())!)
    } else {
      this.tokens.unshift(token)
    }
  }
}

interface Decoder {
  /**
   * @param {SLStream} stream The stream of bytes being decoded.
   * @param {number} bite The next byte read from the stream.
   * @return {?(number|!Array.<number>)} The next code point(s)
   *     decoded, or null if not enough data exists in the input
   *     stream to decode a complete code point, or |finished|.
   */
  handler(stream: SLStream, bite: number): any
}
interface Encoder {
  /**
   * @param {SLStream} stream The stream of code points being encoded.
   * @param {number} code_point Next code point read from the stream.
   * @return {(number|!Array.<number>)} Byte(s) to emit, or |finished|.
   */
  handler(stream: SLStream, code_point: number): any
}
type RegistryEncoder = {
    [key in string]: (fatal: { fatal: boolean }) => Encoder
}
type RegistryDedoder = {
    [key in string]: (fatal: { fatal: boolean }) => Decoder
}
/**标识位 */
const finished = -1;
/**标识位 */
const end_of_stream = -1;
/** 默认编码为utf-8 */
const DEFAULT_ENCODING = 'utf-8';
export {
    Encoder, Decoder, SLStream, RegistryDedoder, RegistryEncoder, finished, end_of_stream, DEFAULT_ENCODING
}