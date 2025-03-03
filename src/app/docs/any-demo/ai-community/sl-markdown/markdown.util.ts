export class MarkdownDomUtil {
  explainDiv: HTMLDivElement = document.createElement('div');
  constructor(public renderDom: Element) {}
  updateParse(parse: string) {
    this.explainDiv.innerHTML = parse;
    this.updateDom();
  }
  updateDom() {
    this.compare(this.explainDiv, this.renderDom);
    console.log(this.explainDiv, this.renderDom);
    // newSame ? newSame.appendChild(insert) : this.prevElement.appendChild(e);
  }
  compare(dom: Element, renderDom: Element) {
    this.deepCloneAndUpdate(renderDom, dom);
  }
  /** 核心函数, 对比节点的内容 实现动态更新 markdown 的 div 而不是用 innerHTML 的属性全部刷新 */
  deepCloneAndUpdate(div1: Element, div2: Element) {
    // 递归比较和更新 div1 和 div2 的子节点
    function compareAndUpdate(node1: any, node2: any) {
      // 情况 1：node1 是文本节点，更新文本内容
      if (node1 && node1.nodeType === Node.TEXT_NODE && node2.nodeType === Node.TEXT_NODE) {
        if (node1.nodeValue !== node2.nodeValue) {
          // 更新文本内容
          node1.nodeValue = node2.nodeValue;
        }
        return;
      }

      // 情况 2：node1 和 node2 的标签名不同，替换整个节点
      if (!node1 || node1.tagName !== node2.tagName) {
        // 克隆 node2 节点
        const newNode = node2.cloneNode(true);
        if (node1) {
          // 替换旧节点
          node1.parentNode.replaceChild(newNode, node1);
        } else {
          // 如果 node1 不存在，直接新增
          node2.parentNode.appendChild(newNode);
        }
        return;
      }

      // 情况 3：节点的 class 或其他属性更新, 注意对root节点的保护
      if (node1.className !== 'article-content' && node1.className !== node2.className) {
        // 3.1 更新 className
        node1.className = node2.className;
      }

      // 3.2 对 id 的更新 注意对root节点的保护
      if (node1.id !== 'article-content' && node1.id !== node2.id) {
        node1.id = node2.id;
      }

      //  3.3 对 style 的更新
      if (node1['style'].cssText !== node2['style'].cssText) {
        node1['style'].cssText = node2['style'].cssText;
      }

      // 情况 4：递归对比和更新子节点
      const children1: ChildNode[] = Array.from(node1.childNodes); // node1 的所有子节点
      const children2: ChildNode[] = Array.from(node2.childNodes); // node2 的所有子节点

      // 遍历 node2 的子节点，逐个与 node1 的对应子节点比较
      children2.forEach((child2, index) => {
        const child1 = children1[index];
        if (!child1) {
          // 如果 child1 不存在，直接克隆 child2 并添加到 node1
          const newChild = child2.cloneNode(true);
          node1.appendChild(newChild);
        } else {
          // 如果 child1 存在，递归比较和更新
          compareAndUpdate(child1, child2);
        }
      });

      // 删除 node1 中多余的子节点
      if (children1.length > children2.length) {
        for (let i = children2.length; i < children1.length; i++) {
          node1.removeChild(children1[i]);
        }
      }
    }

    // 从 div2 根节点开始与 div1 比较
    compareAndUpdate(div1, div2);
  }
}
