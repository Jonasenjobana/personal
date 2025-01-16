import { mat3 } from 'gl-matrix';
import fragment from './shader/letterF/fragment.glsl';
import vertex from './shader/letterF/vertex.glsl';
export class LetterF {
  // 几何形状坐标
  readonly Geometry: Float32Array = new Float32Array([
    // 左竖
    0, 0, 30, 0, 0, 150, 0, 150, 30, 0, 30, 150,

    // 上横
    30, 0, 100, 0, 30, 30, 30, 30, 100, 0, 100, 30,

    // 中横
    30, 60, 67, 60, 30, 90, 30, 90, 67, 60, 67, 90
  ]);
  modelView;
  program: any;
  modelShape = {
    scaleX: 1,
    scaleY: 1,
    translateX: 0,
    translateY: 0,
    rotate: 0
  };
  matrix;
  constructor(public gl: WebGL2RenderingContext, public gui: any) {
    this.init();
    this.gui.add(this.modelShape, 'translateX', 0, 500, 1);
    this.gui.add(this.modelShape, 'translateY', 0, 500, 1);
    this.gui.add(this.modelShape, 'rotate', 0, 365, 1);
  }
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
  draw() {
    if (!this.program) return;
    const gl = this.gl;
    const p = this.program;
    gl.useProgram(p);
    // 传参
    // 获取gpu索引位置
    const positionLocation = gl.getAttribLocation(p, 'a_position');
    const resolutionLocation = gl.getUniformLocation(p, 'u_resolution');
    const matrixLocation = gl.getUniformLocation(p, 'u_matrix');
    const colorLocation = gl.getUniformLocation(p, 'u_color');
    // 处理顶点缓冲区
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.Geometry, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    // 处理uniform
    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
    gl.uniform4fv(colorLocation, [1, 1, 0, 1]); // 黄色
    this.matrix = mat3.create();
    let translateMatrix = mat3.create();
    let rotateMatrix = mat3.create();
    mat3.translate(translateMatrix, translateMatrix, [this.modelShape.translateX, this.modelShape.translateY]);
    mat3.rotate(rotateMatrix, rotateMatrix, this.modelShape.rotate / (Math.PI*180));
    // 绘制5个F
    for (let i = 0; i < 5; i++) {
      // 矩阵相乘
      mat3.translate(translateMatrix, translateMatrix, [i * 40, i * 40]);
      if (i == 3) {
        mat3.rotate(rotateMatrix, rotateMatrix, (i * Math.PI) / 4);
      }
      mat3.multiply(translateMatrix, translateMatrix, rotateMatrix);
      mat3.multiply(this.matrix, this.matrix, translateMatrix);
      // 设置矩阵
      gl.uniformMatrix3fv(matrixLocation, false, this.matrix);
      gl.drawArrays(gl.TRIANGLES, 0, 6 * 3); // 6个三角形
    }
  }
}
