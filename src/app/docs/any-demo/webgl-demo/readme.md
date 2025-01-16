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
    ```javascript
        gl.activeTexture(gl.TEXTURE3); // 开启纹理3
        gl.bindTexture(gl.TEXTURE_2D, texture);
        // 着色器绑定到纹理3
        const u_imageLoc = gl.getUniformLocation(program, "u_image");
        gl.uniform1i(u_imageLoc, 3);
    ```  
## 基本流程
1. 创建顶点着色器
    ```javascript
        const glslCode = `
            attribute vec4 a_Position;
            uniform mat4 uModelViewMatrix;
            varying vec2 vTextureCoord;
            void main() {
              gl_Position = uModelViewMatrix * a_Position;
            }
        `
        const shaderVerext = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(shaderVerext, glslCode);
        gl.compileShader(shaderVerext);
    ```
2. 创建片元着色器
    ```javascript
        const glslCode = `
             // 片段着色器
             uniform sampler2D uTexture;
             varying vec2 vTextureCoord;
             void main() {
              gl_FragColor = texture2D(uTexture, vTextureCoord);
            }
        `
        const shaderFragment = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(shaderFragment, glslCode);
        gl.compileShader(shaderFragment);
    ```
3. 创建程序
    ```javascript
        const program = gl.createProgram();
        // 着色器链接
        gl.attachShader(program, shaderVerext);
        gl.attachShader(program, shaderFragment);
        gl.linkProgram(program);
    ```
4. 传attribute属性（顶点不同值不同）
   - 传顶点 
        ```javascript
            const buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
            const positionLocation = gl.getAttribLocation(program, 'aPosition');
            gl.enableVertexAttribArray(positionLocation);
            gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
        ```
5. 传uniform属性（顶点都共用）
    ```javascript
        const uLocation = gl.getUniformLocation(p, 'uModelViewMatrix');
        gl.uniformMatrix4fv(uLocation, false, new Float32Array([...变化矩阵]));
    ```
6. 传texture属性
    - 纹理坐标
        1. 告诉顶点着色器每个顶点对应的纹理坐标，通过varying插值给片元着色器
        2. 当片元着色器只使用一个纹理时候，默认可以不用指定纹理单元 默认为0
    ```javascript
        // 已加载IMAGE资源
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        // 纹理坐标超出范围后采样方式
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT); // 重复
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT); 
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image); //上传纹理
        const textureLocation = gl.getUniformLocation(program, 'uTexture');
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(textureLocation, 0);
    ```
8. 相机
    ```javascript
        // 设置裁剪空间
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    ```
    - 相机的位置可以根据投影矩阵变化顶点着色器
7. 绘图
    - 点
    - 线
    - 面
    ```javascript
        gl.drawArray();
        gl.drawElement();
    ```

## Math
### 线性代数
#### 向量
#### 矩阵
- 变化矩阵
    1. 缩放
        `
            [Sx  0  0  0]
            [ 0 Sy  0  0]
            [ 0  0 Sz  0]
            [ 0  0  0  1]
        `
    2. 位移
        `
            [1  0  0  Tx]
            [0  1  0  Ty]
            [0  0  1  Tz]
            [0  0  0  1]
        `
    3. 旋转
         - x轴
            `
                [1     0      0     0]
                [0  cosθ  -sinθ  0]
                [0  sinθ   cosθ  0]
                [0     0      0     1]
            `
         - y轴
            `
                [ cosθ  0  sinθ  0]
                [    0  1     0  0]
                [-sinθ  0  cosθ  0]
                [    0  0     0  1]
            `
         - z轴
            `
                [cosθ -sinθ  0  0]
                [sinθ  cosθ  0  0]
                [  0      0   1  0]
                [  0      0   0  1]
            `
         - 任意轴
            1. 已知旋转向量(x,y,z)归一化
            2. 旋转角度...
- 线性相关与线性无关
## 着色器编程
### 套路
### 公式
1. fract
- 保留小数点 常用于归一化、网格划分
- 可作用于向量
2. smoothStep(min, max, value)
- 大于max 则返回max
- 小于min 则返回min
- 返回min,max区间插值
3. step(a, b)
- b >  a 则返回1
- b <= a 则返回0
- 常用于简写if else
4. distance(v_1, v_2)
- 计算两向量的距离
5. length(v)
- 向量长度
6. lerp(v1, v2, flag)
- 插值根据flag值 返回v1和v2向量直接的插值 （flag=.5，则表示v1 v2均匀混合
7. cross(v1, v2)
- 叉乘 求两向量的垂直向量
- 常用于计算光线法向量
8. dot(v1, v2)
- 点乘，求两向量的余弦值
- 常用于判断物体在相机的相对位置
10. normalize(v)
- 归一化坐标 长度变为1 方向不变
11. clamp(a, b, c)
- 取abc中间值
12. 
# Three.js
- 
# Cesium.js
- 经纬度转为笛卡尔坐标系