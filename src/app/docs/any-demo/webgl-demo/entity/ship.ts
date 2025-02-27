import ship1 from '@/assets/map/ship/1.png';
import ship2 from '@/assets/map/ship/2.png';
import ship3 from '@/assets/map/ship/3.png';
// import ship4 from '@/assets/map/ship/4.png';
// import ship5 from '@/assets/map/ship/5.png';
// import ship6 from '@/assets/map/ship/6.png';
// import ship7 from '@/assets/map/ship/7.png';
// import ship8 from '@/assets/map/ship/8.png';
import fragment from './shader/ship/fragment.glsl';
import vertex from './shader/ship/vertex.glsl';
import { mat3, mat4 } from 'gl-matrix';
// 默认初始位置都在画布左上角 就可以和画布像素映射
export class ShipGl {
  // 默认16像素大小
  positionLocation;
  program;
  image = new Image();
  isLoad = false;
  constructor(public gl: WebGL2RenderingContext, type?: string) {
    this.init();
    this.images = [ship1, ship2, ship3].map(url => {
      const image = new Image();
      image.src = url;
      return image;
    });
    console.log(this.images);
  }
  ships: any[] = [];
  images: any[] = [];
  bufferPosition: Float32Array = new Float32Array([]);
  typeAttr: Float32Array = new Float32Array([]);
  rotateAttr: Float32Array = new Float32Array([]);
  corrdPosition: Float32Array = new Float32Array([]);
  init() {
    const gl = this.gl;
    const p = (this.program = gl.createProgram());
    const vs = gl.createShader(gl.VERTEX_SHADER);
    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    // 初始化着色器 程序
    gl.shaderSource(vs, vertex);
    gl.shaderSource(fs, fragment);
    gl.compileShader(fs);
    gl.compileShader(vs);
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.linkProgram(p);
  }
  setData(ships) {
    this.ships = [
      { x: 30, y: 30, url: '/assets/map/ship/1.png', type: '1' },
      { x: 60, y: 130, url: '/assets/map/ship/2.png', type: '2' },
      { x: 80, y: 330, url: '/assets/map/ship/3.png', type: '3' }
    ];
    const data = this.ships.reduce((prev, el) => {
      const { x, y } = el;
      prev.push(
        ...[
          // 三角形1
          x - 8,
          y - 8, // 左上角
          x - 8,
          y + 8, // 左下角
          x + 8,
          y + 8, // 右下角
          // 三角形2
          x + 8,
          y + 8, // 右下角
          x + 8,
          y - 8, // 右上角
          x - 8,
          y - 8 // 左上角
        ]
      );
      return prev;
    }, []);
    const dataTypes = this.ships.reduce((prev, el) => {
      const { type } = el;
      prev.push(...new Array(6).fill(Number(type)));
      return prev;
    }, []);
    const rotate = this.ships.reduce((prev, el) => {
      prev.push(...new Array(6).fill(Math.random()));
      return prev;
    }, [])
    const dataCoord = new Float32Array();
    this.bufferPosition = new Float32Array(data);
    this.typeAttr = new Float32Array(dataTypes);
    this.rotateAttr = new Float32Array(rotate);
  }
  draw() {
    const gl = this.gl;
    const p = this.program;
    gl.useProgram(p);
    // 获取gpu索引位置
    const positionLocation = gl.getAttribLocation(p, 'a_position');
    const typeLocation = gl.getAttribLocation(p, 'a_type');
    const resolutionLocation = gl.getUniformLocation(p, 'u_resolution');
    const matrixLocation = gl.getUniformLocation(p, 'u_matrix');
    // const uniformTextcoord = gl.getUniformLocation(p, 'u_texCoord');
    // const rotateALocation = gl.getAttribLocation(p, 'a_rotate');
    // const rotateBuffer = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, rotateBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, this.rotateAttr, gl.STATIC_DRAW);
    // gl.enableVertexAttribArray(rotateALocation);
    // gl.vertexAttribPointer(rotateALocation, 1, gl.FLOAT, false, 0, 0);
    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.bufferPosition, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    const typeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, typeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.typeAttr, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(typeLocation);
    gl.vertexAttribPointer(typeLocation, 1, gl.FLOAT, false, 0, 0);
    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
    const mat = mat3.create();
    gl.uniformMatrix3fv(matrixLocation, false, mat);
    // gl.uniform1fv(uniformTextcoord, new Float32Array([0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0]));
    this.ships.forEach(ship => {});
    const texCoordLocation = gl.getAttribLocation(p, 'a_texCoord'); // 纹理坐标
    var texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0,0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0,0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);
    this.initTexture(gl, p, 0);
    this.initTexture(gl, p, 1);
    this.initTexture(gl, p, 2);
    gl.drawArrays(gl.TRIANGLES, 0, this.ships.length * 3 * 2); // 每组船由2片元三角形组成
  }
  initTexture(gl: WebGL2RenderingContext, p, index: number) {
    const texture1 = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.images[index]);
    // 设置参数，让我们可以绘制任何尺寸的图像
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    const textureLocation1 = gl.getUniformLocation(p, `u_texture${index}`);
    gl.uniform1i(textureLocation1, index); // 使用第i个纹理单元
    gl.activeTexture(gl.TEXTURE0 + index);
    gl.bindTexture(gl.TEXTURE_2D, texture1);
    gl.uniform1i(textureLocation1, index); // 使用第i个纹理单元
  }
}
export interface ShipGLItem {
  x: number;
  y: number;
  type: string;
}
