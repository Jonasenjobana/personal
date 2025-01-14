# Webgl
## 基本流程
1. 创建顶点着色器
    ```javascript
        const glslCode = `
            attribute vec4 a_Position;
            void main() {
              gl_Position = a_Position;
            }
        `
        const shaderVerext = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(shaderVerext, glslCode);
        gl.compileShader(shaderVerext);
    ```
2. 创建片元着色器
    ```javascript
        const glslCode = `
             void main() {
              gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
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
5. 传uniform属性（顶点都共用）
6. 传texture属性
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
        gl.drawArray()
    ```

## Math
### 线性代数
#### 向量
#### 矩阵
- 变化矩阵
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
11. 
# Three.js
- 
# Cesium.js
- 经纬度转为笛卡尔坐标系