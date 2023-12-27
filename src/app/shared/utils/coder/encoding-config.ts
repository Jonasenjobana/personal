import { GB18030Decoder, GB18030Encoder } from './gbk/gbk-coder';
import { encodings } from "./encoding-indexes";
import { RegistryDedoder, RegistryEncoder } from "./encoding.type";
import { UTF8Decoder, UTF8Encoder } from "./utf-8/utf8-coder";
import { UTF16Encoder, UTF16Decoder } from './utf-16/utf16-coder';
/**
 * 注册label_to_encoding，将不同编码名但相同规则编码分类
 */
/** @type {Object.<string,{name:string,labels:Array.<string>}>} */
export const label_to_encoding: { [key in string]: { name: string; labels: string[] } } = {};
encodings.forEach(function (category) {
  category.encodings.forEach(function (encoding) {
    encoding.labels.forEach(function (label) {
      label_to_encoding[label] = encoding;
    });
  });
});

// 注册编码和解码 工厂函数
export const encoders: RegistryEncoder = {
  'UTF-8': option => new UTF8Encoder(option),
  "GBK": option => new GB18030Encoder(option, true),
  "gb18030": option => new GB18030Encoder(option),
  "UTF-16BE": option => new UTF16Encoder(true, option),
  "UTF-16LE": option => new UTF16Encoder(false, option),
};
export const decoders: RegistryDedoder = {
  'UTF-8': option => new UTF8Decoder(option),
  'GBK': option => new GB18030Decoder(option),
  "gb18030": option => new GB18030Decoder(option),
  "UTF-16BE": option => new UTF16Decoder(true, option),
  "UTF-16LE": option => new UTF16Decoder(false, option),
};