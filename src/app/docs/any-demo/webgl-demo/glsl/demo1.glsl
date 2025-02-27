precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;
/* Color palette */
/* Color palette */
#define BLACK           vec3(0.0, 0.0, 0.0)
#define WHITE           vec3(1.0, 1.0, 1.0)
#define GREEN           vec3(0.0, 1.0, 0.0)
void main() {
	vec3 c;
    vec2 r = u_resolution;
    float t = u_time;
	float l,z = t;
	for(int i=0;i<3;i++) {
		vec2 uv,p=gl_FragCoord.xy/r.xy;
		uv=p;
        // p = uv 偏移到[-.5, -.5] [.5, .5]
		p-=.5;
        // 比例
		// p.x*=r.x/r.y;
		z+=.07;
        // 偏移后中心距离变化量
		l=length(p);
		uv+=p/l*(sin(z)+1.)*abs(sin(l*9.-z-z));
		c[i]=.01/length(mod(uv,1.)-.5);
	}
	gl_FragColor=vec4(c/l,t);
}