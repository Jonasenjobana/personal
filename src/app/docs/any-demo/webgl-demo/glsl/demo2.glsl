precision mediump float;
uniform sampler2D u_texture_A1;
uniform vec2 u_resolution;
uniform float u_time;
void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv*=2.0;
	vec4 textureImage = texture2D(u_texture_A1, uv);
    gl_FragColor = vec4(textureImage.x * sin(u_time), textureImage.y * sin(u_time), .0, 1.0);
}