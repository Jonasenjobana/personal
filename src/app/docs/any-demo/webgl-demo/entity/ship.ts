import ship1 from '@/assets/map/ship/1.png';
// import ship2 from '@/assets/map/ship/2.png';
// import ship3 from '@/assets/map/ship/3.png';
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
  }
  ships: any[] = [];
  bufferPosition: Float32Array = new Float32Array([]);
  typeAttr: Float32Array = new Float32Array([]);
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
        const {x, y} = el;
        prev.push(...[
            // 三角形1
            x - 8, y - 8, // 左上角
            x - 8, y + 8, // 左下角
            x + 8, y + 8, // 右下角
            // 三角形2
            x + 8, y + 8, // 右下角
            x + 8, y - 8, // 右上角
            x - 8, y - 8, // 左上角
        ])
        return prev
    }, []);
    const dataTypes = this.ships.reduce((prev, el) => {
        const {type} = el;
        prev.push(...new Array(6).fill(Number(type)));
        return prev;
    }, [])
    const dataCoord = new Float32Array();
    this.bufferPosition = new Float32Array(data);
    this.typeAttr = new Float32Array(dataTypes);
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
    gl.drawArrays(gl.TRIANGLES, 0, this.ships.length * 3 * 2);
    this.ships.forEach(ship => {

    })
    // const texCoordLocation = gl.getAttribLocation(p, 'a_texCoord'); // 纹理坐标
    // var texCoordBuffer = gl.createBuffer();
    // gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, this.TextureCoord, gl.STATIC_DRAW);
    // gl.enableVertexAttribArray(texCoordLocation);
    // gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);
    // const texture = gl.createTexture();
    // // 假设所有的图像维度都不是2的整数次幂
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.image);
    // const uImageLocation = gl.getUniformLocation(this.program, 'u_texture');
    // gl.uniform1i(uImageLocation, 0);
    // this.ships.forEach(el => {
    //     this.drawImage(texture, el.x, el.y);
    // });
  }
  drawImage(texture, x, y) {
    const gl = this.gl;
    const p = this.program;
    const matrixLocation = gl.getUniformLocation(p, 'u_matrix');
    const mat = mat3.create();
    // mat3.translate(mat, mat, [x,y]);
    // gl.uniformMatrix3fv(matrixLocation, false, mat)
    // 从像素空间转换到裁剪空间
    // var matrix = m4.orthographic(0, gl.canvas.width, gl.canvas.height, 0, -1, 1);

    // 平移到 dstX, dstY
    // matrix = m4.translate(matrix, dstX, dstY, 0);

    // 缩放单位矩形的宽和高到 texWidth, texHeight 个单位长度
    // matrix = m4.scale(matrix, texWidth, texHeight, 1);

    // 设置矩阵
    // gl.uniformMatrix4fv(matrixLocation, false, matrix);

    // 告诉着色器使用纹理单元 0
    // gl.uniform1i(textureLocation, 0);

    // 绘制矩形
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}
export interface ShipGLItem {
  x: number;
  y: number;
  type: string;
}
