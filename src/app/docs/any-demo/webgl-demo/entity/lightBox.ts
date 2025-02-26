import { mat4, vec3 } from 'gl-matrix';
import * as dat from 'dat.gui';

export class LightBox {
  width: number;
  height: number;
  depth: number;
  program: WebGLProgram;
  positionBuffer: WebGLBuffer;
  normalBuffer: WebGLBuffer;
  gui = new dat.GUI();
  boxVertex: Float32Array = new Float32Array([
  // 前面（+Z方向）
  0.5, -0.5,  0.5,
  0.5,  0.5,  0.5,
  -0.5, -0.5,  0.5,
  -0.5, -0.5,  0.5,
  0.5,  0.5,  0.5,
  -0.5,  0.5,  0.5,

  // 后面（-Z方向）
  -0.5, -0.5, -0.5,
  -0.5,  0.5, -0.5,
  0.5, -0.5, -0.5,
  -0.5,  0.5, -0.5,
  0.5,  0.5, -0.5,
  0.5, -0.5, -0.5,

  // 顶面（+Y方向）
  -0.5,  0.5,  0.5,
  0.5,  0.5,  0.5,
  0.5,  0.5, -0.5,
  -0.5,  0.5,  0.5,
  0.5,  0.5, -0.5,
  -0.5,  0.5, -0.5,

  // 底面（-Y方向）
  -0.5, -0.5, -0.5,
  0.5, -0.5, -0.5,
  0.5, -0.5,  0.5,
  -0.5, -0.5, -0.5,
  0.5, -0.5,  0.5,
  -0.5, -0.5,  0.5,

  // 右面（+X方向）
  0.5, -0.5,  0.5,
  0.5,  0.5, -0.5,
  0.5,  0.5,  0.5,
  0.5,  0.5, -0.5,
  0.5, -0.5,  0.5,
  0.5, -0.5, -0.5,

  // 左面（-X方向）
  -0.5, -0.5, -0.5,
  -0.5, -0.5,  0.5,
  -0.5,  0.5,  0.5,
  -0.5, -0.5, -0.5,
  -0.5,  0.5,  0.5,
  -0.5,  0.5, -0.5,
  ]);
  normal: Float32Array = new Float32Array([
    // 前
    0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 
    // 后
    0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
    // 顶
    0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 
    // 底
    0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,  
    // 右
    1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0
    // 左
    -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 
  ])
  modelMatrix: mat4 = mat4.create();
  viewMatrix: mat4 = mat4.create();
  projectionMatrix: mat4 = mat4.create();
  camera = {
    position: [0, 0, 1],
  }
  constructor(public gl: WebGL2RenderingContext) {
    this.init();
  }
  setGeoPosition() {
    this.positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.boxVertex, this.gl.STATIC_DRAW);
  }
  init() {
    const gl = this.gl;
    const p = (this.program = gl.createProgram());
    const vs = gl.createShader(gl.VERTEX_SHADER);
    const s = gl.createShader(gl.FRAGMENT_SHADER);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST)
    // 初始化着色器 程序
    gl.shaderSource(
      vs,
      /*glsl*/ `
                attribute vec4 a_position;
                attribute vec4 a_normal;
                uniform mat4 uModelMatrix; // 相比于原来初始化 模型内部的变化 
                uniform mat4 uViewMatrix; // 视图坐标系
                uniform mat4 uProjectionMatrix; // 透视相机的值
                varying vec4 vNormal;
                varying vec4 vFragPos;
                varying vec2 vUv;
                void main() {
                  gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * a_position;
                  vNormal = a_normal;
                  vFragPos = uViewMatrix * uModelMatrix * a_position;
                }
                `
    );
    gl.shaderSource(
      s,
      /*glsl*/ `
                precision mediump float;// 精度
                varying vec4 vNormal;
                varying vec4 vFragPos;
                varying vec3 vLightPos;
                uniform mat4 uViewMatrix; // 视图坐标系
                uniform vec3 uLightPos;
                void main() {
                  // 物体位置 光源位置
                  vec3 fragpos = vFragPos.xyz;
                  vec3 lightDir = normalize(uLightPos - fragpos); // 片元位置
                  vec3 normal = normalize(vNormal.xyz);
                  float diff = max(dot(normal, lightDir), .0);
                  vec3 lightColor = vec3(1.0, 1.0, 1.0);
                  vec3 objectColor = vec3(.665, .0, .0);
                  float ambientStrength = 0.1; // 环境光亮度
                  vec3 ambient = ambientStrength * lightColor;
                  vec3 diffuse = diff * lightColor;
                  vec3 result = (ambient + diffuse) * objectColor;
                  gl_FragColor = vec4(result, 1.0);
                }
                `
    );
    gl.compileShader(s);
    gl.compileShader(vs);
    gl.attachShader(p, vs);
    gl.attachShader(p, s);
    gl.linkProgram(p);
    this.setGeoPosition();
    this.setNormal();
    // mat4.scale(this.modelMatrix, this.modelMatrix, [0.5, 0.5, 0.5]);
    mat4.lookAt(this.viewMatrix, [0, 0, -2], [0, 0, 0], [0, -1, 0]);
    mat4.perspective(this.projectionMatrix, Math.PI/4, gl.canvas.width/gl.canvas.height, .1, 1000);
  }
  setNormal() {
    this.normalBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.normal, this.gl.STATIC_DRAW);
  }
  cameraRotate: number = 0;
  draw() {
    const gl = this.gl,
      p = this.program;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.useProgram(p);
    let positionLocation = gl.getAttribLocation(p, 'a_position');
    let normalLocation = gl.getAttribLocation(p, 'a_normal');
    let uLightPosLocation = gl.getUniformLocation(p, 'uLightPos');
    let modelMatrixLocation = gl.getUniformLocation(p, 'uModelMatrix');
    let projectionMatrixLocation = gl.getUniformLocation(p, 'uProjectionMatrix');
    let viewMatrixLocation = gl.getUniformLocation(p, 'uViewMatrix');
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    var size = 3; // 3 components per iteration
    var type = gl.FLOAT; // the data is 32bit loats
    var normalize = false; // don't normalize the data
    var stride = 0; // 0 = move orward size * sizeo(type) each iteration to get the next position
    var offset = 0; // start at the beginning o the buer
    gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);
    gl.enableVertexAttribArray(normalLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    gl.vertexAttribPointer(normalLocation, size, type, normalize, stride, offset);
    // 应用变换
    gl.uniformMatrix4fv(modelMatrixLocation, false, this.modelMatrix);
    gl.uniformMatrix4fv(projectionMatrixLocation, false, this.projectionMatrix);
    // 旋转相机
    mat4.lookAt(this.viewMatrix, [1, Math.sin(this.cameraRotate)*2, Math.cos(this.cameraRotate)*2], [0, 0, 0], [0, 1, 0]);
    this.cameraRotate += Math.PI*0.001;
    gl.uniformMatrix4fv(viewMatrixLocation, false, this.viewMatrix);
    gl.uniform3fv(uLightPosLocation, [this.viewMatrix[12], this.viewMatrix[13], this.viewMatrix[14]]);
    gl.drawArrays(gl.TRIANGLES, 0, this.boxVertex.length/3);
  }
}
