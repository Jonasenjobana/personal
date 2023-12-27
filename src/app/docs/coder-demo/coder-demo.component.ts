import { Component, OnInit } from '@angular/core';
import { SLTextDecoder, SLTextEncoder } from 'src/app/shared/utils/coder/encoding';
import { GBK_BYTES } from 'src/app/shared/utils/coder/test/gbk';

@Component({
  selector: 'coder-demo',
  templateUrl: './coder-demo.component.html',
  styleUrls: ['./coder-demo.component.less']
})
export class CoderDemoComponent implements OnInit {
  utf8: string[] = ['了a', '浜哸']
  buffer: any
  transtring: string[] = []
  constructor() { }

  ngOnInit(): void {
    this.buffer = this.encodeArrayOfStrings(this.utf8, 'utf-8')
    this.transtring = this.decodeArrayOfStrings(this.buffer, 'gbk')
  }
  // javascript中存储的string默认是utf-16 占据4个字节 故使用无符号32位为一单位存储每个字符的二进制数
  encodeArrayOfStrings(strings: string[], label: string) {
    var encoder, encoded, len, i, bytes, view, offset;
    // 1100000111001011 1100001
    // 1110010010111010 100001100 1100001（a）
    // encoder = new SLTextEncoder(label); unicode 110110101011100101010011111000
    encoded = [];
  
    len = Uint32Array.BYTES_PER_ELEMENT;
    for (i = 0; i < strings.length; i += 1) {
      len += Uint32Array.BYTES_PER_ELEMENT;
      encoded[i] = new SLTextEncoder(label).encode(strings[i]);
      len += encoded[i].byteLength;
    }
    bytes = new Uint8Array(len);
    view = new DataView(bytes.buffer);
    offset = 0;
  
    view.setUint32(offset, strings.length);
    offset += Uint32Array.BYTES_PER_ELEMENT;
    for (i = 0; i < encoded.length; i += 1) {
      len = encoded[i].byteLength;
      view.setUint32(offset, len);
      offset += Uint32Array.BYTES_PER_ELEMENT;
      bytes.set(encoded[i], offset);
      offset += len;
    }
    return bytes.buffer;
  }
  // 将二进制 根据编码 读会原文本
  decodeArrayOfStrings(buffer: any, encoding: string) {
    var decoder, view, offset, num_strings, strings, i, len;  
    // return new SLTextDecoder('gbk').decode(new Uint8Array(GBK_BYTES.slice(30000, 30032)))
  
    decoder = new SLTextDecoder(encoding);
    view = new DataView(buffer);
    offset = 0;
    strings = [];
  
    num_strings = view.getUint32(offset);
    offset += Uint32Array.BYTES_PER_ELEMENT;
    for (i = 0; i < num_strings; i += 1) {
      len = view.getUint32(offset);
      offset += Uint32Array.BYTES_PER_ELEMENT;
      strings[i] = decoder.decode(
        new DataView(view.buffer, offset, len));
      offset += len;
    }
    return strings;
  }
}
