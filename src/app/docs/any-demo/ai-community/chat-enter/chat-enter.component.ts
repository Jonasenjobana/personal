import { CommonModule } from '@angular/common';
import { Component, Output, Signal, forwardRef, output, signal } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SlMarkdownComponent } from '../sl-markdown/sl-markdown.component';
const source = `
\`\`\`javascript
import { Component, computed, input, signal, resource } from '@angular/core';
import { marked, Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import javascript from 'highlight.js/lib/languages/javascript';
@Component({
  selector: 'sl-markdown',
  imports: [],
  templateUrl: './sl-markdown.component.html',
  styleUrl: './sl-markdown.component.less',
  standalone: true
})
export class SlMarkdownComponent {
  mdText = input('');
  slMarked = new Marked(
    markedHighlight({
      emptyLangClass: 'hljs',
      langPrefix: 'hljs language-',
      highlight(code, lang, info) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
      }
    })
  );
  constructor() {
  }
  mdHtmlParse = computed(() => {
    return this.slMarked.parse(this.mdText());
  });
}
\`\`\`
# Webgl
## Notice
1. useProgram
- 切换着色器，每次变更渲染对象都需要切换，包括变更uniform attribute等
2. bindBuffer
- 缓冲区更换然后通过vertexAttribPointer对attribute赋值
3. 通过顶点属性给片元着色器传参
- 如果要在同一个program里绘制完成所有的元素，每个元素区别仅仅片元颜色不同或者纹理
4. 关于纹理
- 全局变量默认为0，一般指代当前活跃纹理，会自动绑定当前着色器使用的sample2d
- 纹理切换
    \`\`\`javascript
        gl.activeTexture(gl.TEXTURE3); // 开启纹理3
        gl.bindTexture(gl.TEXTURE_2D, texture);
        // 着色器绑定到纹理3
        const u_imageLoc = gl.getUniformLocation(program, "u_image");
        gl.uniform1i(u_imageLoc, 3); // 使用第3个纹理单元
    \`\`\`  
`;
@Component({
  selector: 'chat-enter',
  imports: [CommonModule, FormsModule, SlMarkdownComponent],
  templateUrl: './chat-enter.component.html',
  styleUrl: './chat-enter.component.less',
  standalone: true,
  preserveWhitespaces: true
})
export class ChatEnterComponent {
  text = signal(``);
  jumpText = signal(``);
  textSend = output();
  infos: any[] = [];
  constructor() {}
  ngAfterViewInit() {
    let tmp = 0;
    // this.text.set(source)
    const stop = setInterval(() => {
      const prev = tmp;
      if (tmp >= source.length) {
        clearInterval(stop);
        tmp = source.length
      } else {
        tmp += Math.min(10, Math.floor(Math.random() * 20));
      }
      this.jumpText.set(source.slice(prev, tmp));
    }, 100);
  }
}
