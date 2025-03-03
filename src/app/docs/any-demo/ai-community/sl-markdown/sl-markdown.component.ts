import { Component, computed, input, signal, resource, viewChild, ElementRef, viewChildren, effect } from '@angular/core';
import { marked, Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import javascript from 'highlight.js/lib/languages/javascript';
import { DomSanitizer } from '@angular/platform-browser';
import { MarkdownDomUtil } from './markdown.util';
@Component({
  selector: 'sl-markdown',
  imports: [],
  templateUrl: './sl-markdown.component.html',
  styleUrl: './sl-markdown.component.less',
  standalone: true
})
export class SlMarkdownComponent {
  innerHtml: string = '';
  mdUpdateText = input('');
  slMarked = new Marked(
    {
      gfm: true,
      mangle: false,
      headerIds: false
    },
    markedHighlight({
      emptyLangClass: 'hljs',
      langPrefix: 'hljs language-',
      highlight(code, lang, info) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
      }
    })
  );
  renderDomRef = viewChild<ElementRef<HTMLDivElement>>('renderDom');
  mdUtil: MarkdownDomUtil;
  queueAsync: Promise<string>[] = [];
  constructor() {}
  ngAfterViewInit() {
    const el = this.renderDomRef().nativeElement;
    this.mdUtil = new MarkdownDomUtil(el);
  }
  mdHtmlParse = effect(() => {
    this.innerHtml += this.mdUpdateText();
    this.processRenderQueue();
  });
  processRenderQueue() {
    const dataPromise = this.queueAsync.shift();
    dataPromise ? dataPromise.then(data => this.renderMark(data)) : this.renderMark(this.innerHtml);
  }
  renderMark(data: string) {
    const promise: Promise<string> = new Promise(res => {
      setTimeout(() => {
        const parse = this.slMarked.parse(data);
        this.mdUtil.updateParse(parse);
        res(this.innerHtml);
      }, 50);
    });
    this.queueAsync.push(promise);
  }
}
