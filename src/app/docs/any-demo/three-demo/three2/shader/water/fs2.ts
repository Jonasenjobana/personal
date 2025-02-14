export default /*glsl */`
const vec2 vel = vec2(1., 0.);
const float tiles = 8.;
const vec3 color = vec3(.0, 1., 1.);

float random(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

vec4 water2(vec2 uv)
{
    // vec2 uv = fragCoord/iResolution.y;
    
    //wave
    vec2 wave = uv;
    wave.x += sin(uv.y*5.+uTime * .1)*0.01;
    wave.y += cos(uv.x*5.+uTime * .1)*0.01;
    uv += wave;
    
    uv+=vel*uTime;
    
    vec2 index = floor(tiles * uv)/tiles;
    float t = floor(random(index)*4.)/4.;
    
    uv = 2.0 * fract(tiles * uv) - 1.0;
    uv *= rotate2d(t*3.1415926*2.);
    
    float c = step(uv.x, uv.y)*0.9;
    c=abs(sin(uTime*.01*fract((random(index+c)+0.1))));
	return vec4((c*.5+0.5) * color,1.0);
}
`