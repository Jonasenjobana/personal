import { mat4 } from 'gl-matrix';
import textureImage from '@/assets/images/1.jpg';
export class SquareGL {
  img: HTMLImageElement;

  constructor(public gl: WebGL2RenderingContext, public gui: any) {
    this.square();
    let obj = { value: 0 };
    this.gui.add(obj, 'value', 0, 1, 0.01).onChange(value => {
      this.mat4v = mat4.create();
      mat4.translate(this.mat4v, this.mat4v, [value, -value, 0]);
    });
  }
  mat4v = mat4.create();
  program: any;
  draw() {
    if (!this.program) return;
    const gl = this.gl;
    const p = this.program;
    this.gl.useProgram(this.program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5]), gl.STATIC_DRAW);
    const aVertexPosition = gl.getAttribLocation(p, 'aVertexPosition');
    gl.enableVertexAttribArray(aVertexPosition);
    gl.vertexAttribPointer(aVertexPosition, 2, gl.FLOAT, false, 0, 0);
    const uTime = gl.getUniformLocation(p, 'uTime');
    const uLocation = gl.getUniformLocation(p, 'uModelViewMatrix');
    const texCoordLocation = gl.getAttribLocation(p, 'a_texCoord'); // 纹理坐标
    var texCoordBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);
    // 创建纹理
    var texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    const a = gl.getUniformLocation(p, 'u_image2')
    gl.uniform1i(a, 0)
    // 设置参数，让我们可以绘制任何尺寸的图像
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    // 将图像上传到纹理
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.img);
    // const uImageLocation = gl.getUniformLocation(p, 'u_image');
    // gl.uniform1i(uImageLocation, 1);
    gl.uniformMatrix4fv(uLocation, false, this.mat4v);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
  square() {
    const i = (this.img = new Image());
    this.img.src = textureImage;
    i.onload = () => {
      const gl = this.gl;
      const p = (this.program = gl.createProgram());
      const vs = gl.createShader(gl.VERTEX_SHADER);
      const fs = gl.createShader(gl.FRAGMENT_SHADER);
      const glslVs = `
              attribute vec4 aVertexPosition;
              uniform mat4 uModelViewMatrix;
              uniform float uTime;
              varying vec4 vColor;
              attribute vec2 a_texCoord;// 顶点纹理坐标
              varying vec2 v_texCoord; // 传给片元
              void main() {
                v_texCoord = a_texCoord;
                vColor = uModelViewMatrix * aVertexPosition;
                gl_Position = uModelViewMatrix * aVertexPosition;
              }
            `;
      gl.shaderSource(vs, glslVs);
      gl.compileShader(vs);
      const glslFs = `
              precision mediump float;
              // 纹理
              uniform sampler2D u_image2;
              uniform sampler2D u_image;
              // 从顶点着色器传入的纹理坐标
              varying vec2 v_texCoord;
              uniform float uTime;
              varying vec4 vColor;
              void main() {
                gl_FragColor = texture2D(u_image2, v_texCoord);
              }
            `;
      gl.shaderSource(fs, glslFs);
      gl.compileShader(fs);
      gl.attachShader(p, vs);
      gl.attachShader(p, fs);
      gl.linkProgram(p);
    };
  }
}
