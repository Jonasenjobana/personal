// 片段着色器
uniform float time;
varying vec2 vUv;

void main() {
    // 极坐标转换
    float radius = length(vUv);
    float angle = atan(vUv.y, vUv.x);
    
    // 动态扭曲
    float warp = 0.1 * sin(time + radius * 10.0);
    vec3 color = vec3(
        sin(angle*5.0 + time)*0.5+0.5,
        cos(angle*3.0 + time)*0.5+0.5,
        sin(angle*7.0 + time)*0.5+0.5
    );
    
    // 深度效果
    float depth = 1.0 - smoothstep(0.5, 1.0, radius);
    color *= depth * 2.0;
    
    gl_FragColor = vec4(color, 1.0);
}