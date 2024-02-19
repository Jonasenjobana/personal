export type AShape = 'Circle' | 'Rect' | 'Line' | 'Polygen';
export interface AOption {
  radius: number;
  color?: string;
  position: number[];
  onClick?: (...params: any[]) => void;
  onMouseIn?: (...params: any[]) => void;
  onMouseOut?: (...params: any[]) => void;
}
class ANode<T = AShape> {
  shape!: T;
  position!: number[];
  hashId!: string;
  children: ANode[] = [];
  onClick?: (...params: any[]) => void;
  onMouseIn?: (...params: any[]) => void;
  onMouseOut?: (...params: any[]) => void;
  constructor({ onClick, onMouseIn, onMouseOut }: Partial<AOption>) {
    this.genHash();
    this.onClick = onClick;
    this.onMouseIn = onMouseIn;
    this.onMouseOut = onMouseOut;
  }
  genHash() {
    this.hashId = Math.random().toString(16).slice(2, 8);
  }
  addChild(node: ANode) {
    this.children.push(node);
  }
  removeChild(node: ANode) {}
  remove() {}
  render(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, isHash: boolean = false) {}
  hidden() {};
  renderChild(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, nodes: ANode[], isHash: boolean = false) {
    const children = nodes
    for (let i = 0; i < children.length; i++) {
      const node = children[i];
      node.render(ctx, isHash);
      this.renderChild(ctx, node.children);
    }
  }
  aRender(aRender: ARenderTree, node: ANode) {
    const hashMap = aRender.hashMap
    function aNode() {
      if (hashMap.has(node.hashId)) {
        node.genHash();
        aNode();
        return;
      }
      hashMap.set(node.hashId, node);
    }
    aNode();
  }
}
export class ACircleNode extends ANode<'Circle'> {
  radius: number;
  color: string;
  constructor({ radius, color, position, onClick, onMouseIn, onMouseOut }: AOption) {
    super({ onClick, onMouseIn, onMouseOut });
    this.radius = radius;
    this.position = position;
    this.color = color || '#3d3d3d';
  }
  override render(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, isHash: boolean = false): void {
    const [x, y] = this.position;
    ctx.beginPath();
    ctx.save();
    ctx.strokeStyle = isHash ? '#'+this.hashId : this.color;
    if (isHash) {
      ctx.fillStyle = '#'+this.hashId
    }
    ctx.arc(x, y, this.radius, 0, Math.PI * 2);
    ctx.stroke();
    isHash && ctx.fill();
    ctx.restore();
    this.renderChild(ctx, this.children, isHash);
    ctx.closePath();
  }
}
export class ARenderTree {
  hashMap: Map<string, ANode> = new Map();
  width: number
  height: number
  element: HTMLCanvasElement;
  ctx: OffscreenCanvasRenderingContext2D;
  nodeTree: ANode[] = [];
  preNode?: ANode
  constructor(element: HTMLCanvasElement, width: number, height: number) {
    const ele = new OffscreenCanvas(width, height);
    ele.width = width;
    ele.height = height;
    this.ctx = ele.getContext('2d')! as OffscreenCanvasRenderingContext2D;
    this.width = width;
    this.height = height;
    this.element = element;
    this.initEvent();
  }
  clearAll() {
    this.nodeTree = [];
    this.hashMap = new Map();
  }
  addNode(node: ANode) {
    const hashMap = this.hashMap;
    this.nodeTree.push(node);
    function aNode() {
      if (hashMap.has(node.hashId)) {
        node.genHash();
        aNode();
        return;
      }
      hashMap.set(node.hashId, node);
    }
    aNode();
    this.render();
  }
  removeNode(node: ANode) {}
  initEvent() {
    const {left, top} = this.element.getBoundingClientRect();
    this.element.addEventListener('click', ({clientX, clientY}: MouseEvent) => {
      const [r, g, b] = this.ctx.getImageData(clientX - left, clientY - top, 1, 1).data;
      console.log(clientX - left, clientY - top);
      
      const hex = this.rgbToHex([r, g, b]);
      const node = this.hashMap.get(hex);
      if (node) {
        node.onClick && node.onClick({ x: clientX - left, y: clientY - top });
      }
    });
    this.element.addEventListener('mousemove', ({clientX, clientY}: MouseEvent) => {
      const [r, g, b] = this.ctx.getImageData(clientX - left, clientY - top, 1, 1).data;
      const hex = this.rgbToHex([r, g, b]);
      const node = this.hashMap.get(hex);
      if (this.preNode && this.preNode !== node) {
        this.preNode.onMouseOut && this.preNode.onMouseOut({ x: clientX - left, y: clientY - top });
        this.element.style.cursor = 'default'
        this.preNode = undefined;
      }
      if (node) {
        this.element.style.cursor = 'pointer'
        node.onMouseIn && node.onMouseIn({ x: clientX - left, y: clientY - top });
        this.preNode = node;
      }
    });
  }
  rgbToHex(rgb: number[]) {
    let hex = '';
    for (let i = 0; i < rgb.length; i++) {
      hex += Math.abs(rgb[i]).toString(16);
    }
    return hex;
  }
  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);
    for (let i = 0; i < this.nodeTree.length; i++) {
      const node = this.nodeTree[i];
      node.render(ctx, true);
    }
  }
}
export class RenderTree {
  element: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  nodeTree: ANode[] = [];
  aRender: ARenderTree;
  width: number;
  height: number;
  constructor(element: HTMLCanvasElement, ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.element = element;
    this.aRender = new ARenderTree(element, width, height);
  }
  addNode(node: ANode) {
    this.nodeTree.push(node);
    this.aRender.addNode(node);
    this.render();
  }
  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);
    function renderNodes(nodes?: ANode[]) {
      if (!nodes) return;
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.render(ctx);
        renderNodes(node.children);
      }
    }
    for (let i = 0; i < this.nodeTree.length; i++) {
      const node = this.nodeTree[i];
      node.render(ctx);
      renderNodes(node.children);
    }
  }
}
