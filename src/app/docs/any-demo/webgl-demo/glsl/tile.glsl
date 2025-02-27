precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
vec3 eye = vec3(3., 3., 3.);
vec3 light = vec3 (-3.,3.,3.);
vec3 lookat = vec3(.0,.0,.0);
vec2 tiled(vec2 uv, float zoom) {
    uv *= zoom;
    return fract(uv);
}
void main() {
	vec3 c;
    vec2 r = u_resolution;
    float t = u_time;
    vec2 uv = gl_FragCoord.xy/r.xy;
    uv *= tiled(uv, 10.0);
	gl_FragColor=vec4(uv,1.0,1.0);
}
