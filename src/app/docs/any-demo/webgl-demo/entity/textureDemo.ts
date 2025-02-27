import fragment from './shader/ship/fragment.glsl';
import vertex from './shader/ship/vertex.glsl';
import ship1 from '@/assets/map/ship/1.png';
import ship2 from '@/assets/map/ship/2.png';
import ship3 from '@/assets/map/ship/3.png';
import { mat3 } from 'gl-matrix';
import { position } from 'html2canvas/dist/types/css/property-descriptors/position';
import { rotate } from 'three/examples/jsm/nodes/Nodes';
export class TextureDemo {
  constructor(public gl: WebGL2RenderingContext) {
    this.loadSource();
    gl.canvas.addEventListener('mousemove', (e: MouseEvent) => {
      this.mouse = [e.x, e.y];
    });
  }
  mouse;
  program: WebGLProgram;
  images: HTMLImageElement[] = [];
  isLoaded: number = 0;
  loadSource() {
    this.images = [ship1, ship2, ship3].map(url => {
      const image = new Image();
      image.src = url;
      image.onload = () => {
        this.isLoaded++;
      };
      return image;
    });
  }
  getProgress() {
    return this.isLoaded / this.images.length;
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
  ships = new Array(1).fill(0).map(el => {
    return {
      position: [50, 50],
      rotate: 60,
      type: Math.floor(Math.random() * 3)
    };
  });
  draw() {
    const progress = this.getProgress();
    if (progress != 1) return;
    this.init();
    this.ships.forEach(ship => {
      const { position, rotate, type } = ship;
      this.render(position, rotate, type);
    });
  }
  render(position, rotate, type) {
    const gl = this.gl;
    const p = this.program;
    gl.useProgram(p);
    const [x, y] = position;
    // prettier-ignore
    // 顶点数据（船舶的几何形状和纹理坐标）
    const vertices = new Float32Array([
      // 位置X, 位置Y, 纹理X, 纹理Y
       -0.5, -0.5,    0.0, 1.0,  // 左下
        0.5, -0.5,    1.0, 1.0,  // 右下
        0.5,  0.5,    1.0, 0.0,  // 右上
       -0.5,  0.5,    0.0, 0.0   // 左上
    ]);
    // 获取gpu索引位置
    const positionLocation = gl.getAttribLocation(p, 'aPosition');
    const uProjection = gl.getUniformLocation(p, 'uProjection');
    const matrixLocation = gl.getUniformLocation(p, 'uModel');
    const aTexCoord = gl.getAttribLocation(p, 'aTexCoord');
    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, 16, 8);
    gl.enableVertexAttribArray(aTexCoord);
    const mat = mat3.create();
    mat3.translate(mat, mat, [x, y]);
    mat3.rotate(mat, mat, rotate * (Math.PI / 180));
    gl.uniformMatrix3fv(matrixLocation, false, mat);
    this.initTexture(gl, p, 0);
    this.initTexture(gl, p, 1);
    this.initTexture(gl, p, 2);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
  }
  initTexture(gl: WebGL2RenderingContext, p, index: number) {
    const texture1 = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture1);
    // 设置参数，让我们可以绘制任何尺寸的图像
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.images[index]);
    const textureLocation1 = gl.getUniformLocation(p, `u_texture${index}`);
    gl.uniform1i(textureLocation1, index); // 使用第i个纹理单元
    gl.activeTexture(gl.TEXTURE0 + index);
    gl.bindTexture(gl.TEXTURE_2D, texture1);
  }
}
