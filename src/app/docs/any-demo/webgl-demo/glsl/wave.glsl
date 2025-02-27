precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;
/* Color palette */
#define WHITE           vec4(0.8431, 0.9176, 1.0, 1.0)
vec4 wave(vec2 st) {
    float isWave = 1.0 - step(.3 + sin(st.x * 2.0 + u_time) * .05, st.y);
    vec4 cokeColor = vec4(0.3608, 0.0, 0.0, 1.0);
    return mix(WHITE, cokeColor, isWave);
}
vec4 wave2(vec2 st) {
    float isWave = 1.0 - step(.3 + cos(st.x * 2.0 + u_time * .3) * .05, st.y);
    vec4 cokeColor = vec4(0.2471, 0.0902, 0.0902, 1.0);
    return mix(WHITE, cokeColor, isWave);   
}
float createDot(vec2 st) {
    return .5;
}
// TODO 比例缩放
void main() {
    // 归一坐标
    vec2 st = (gl_FragCoord.xy / u_resolution.xy);
    // 动画进度
    float progress = fract(u_time * .2);
    float hearR = 1.0 * sin(progress);
    // 扩大坐标范围 放大20倍 坐标区域[-10,10]
    vec2 newST = st * 20.0 - 10.0;
    // 心型函数 左加右减
    float inHeart = 1.0 - step(hearR, pow(newST.x + 4.0, 2.0) + pow(((newST.y + 4.0) - pow(pow(newST.x + 4.0, 2.0), 1.0/3.0)), 2.0));
    vec4 currentColor = vec4(1.0, 1.0, 1.0, 1.0);
    vec4 cokeColor = wave(st);
    vec4 cokeColor2 = wave2(st);
    currentColor = mix(cokeColor, cokeColor2, .3);
    float randomMoveX = sin(cos(u_time) * .1);
    vec2 boatPos = vec2(.3+randomMoveX, .3 + sin(st.x * 2.0 + u_time) * .05);
    const float boatLen = .005;
    float onRange = 1.0 - step(boatLen, distance(st, boatPos));
    currentColor = mix(currentColor, vec4(0.0118, 1.0, 0.5059, max(.7,progress)), onRange);
    // currentColor = mix(currentColor, vec4(1.0, .0,.0,1.0), inHeart);
    gl_FragColor = currentColor;
}