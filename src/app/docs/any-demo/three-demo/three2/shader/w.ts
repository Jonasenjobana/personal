export const wfs = /*glsl*/`
// #define TAU 6.28318530718
// #define MAX_ITER 5
// varying vec2 vUv;
// uniform float iTime;
// // https://www.shadertoy.com/view/Msf3WH
// // simplex noise
// vec2 hash( vec2 p ) // replace this by something better
// {
//     p = vec2( dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)) );
//     return -1.0 + 2.0*fract(sin(p)*43758.5453123);
// }

// float noise( in vec2 p )
// {
//     const float K1 = 0.366025404; // (sqrt(3)-1)/2;
//     const float K2 = 0.211324865; // (3-sqrt(3))/6;

//     vec2  i = floor( p + (p.x+p.y)*K1 );
//     vec2  a = p - i + (i.x+i.y)*K2;
//     float m = step(a.y,a.x); 
//     vec2  o = vec2(m,1.0-m);
//     vec2  b = a - o + K2;
//     vec2  c = a - 1.0 + 2.0*K2;
//     vec3  h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
//     vec3  n = h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
//     return dot( n, vec3(70.0) );
// }
// vec4 mainImage() 
// {
// 	float time = iTime * .01;
//     // uv should be the 0-1 uv of texture...
// 	vec2 uv = vUv;
// 	uv.y = noise(uv);
// 	uv.x = fract(uv.x * 5.0 - time);
// #ifdef SHOW_TILING
// 	vec2 p = mod(uv*TAU*2.0, TAU)-250.0;
// #else
//     vec2 p = mod(uv*TAU, TAU)-250.0;
// #endif
// 	vec2 i = vec2(p);
// 	float c = 1.0;
// 	float inten = .005;

// 	for (int n = 0; n < MAX_ITER; n++) 
// 	{
// 		float t = time * (1.0 - (3.5 / float(n+1)));
// 		i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
// 		c += 1.0/length(vec2(p.x / (sin(i.x+t)/inten),p.y / (cos(i.y+t)/inten)));
// 	}
// 	c /= float(MAX_ITER);
// 	c = 1.17-pow(c, 1.4);
// 	vec3 colour = vec3(pow(abs(c), 8.0));
//     colour = clamp(colour + vec3(0.0, 0.35, 0.5), 0.0, 1.0);

// 	#ifdef SHOW_TILING
// 	// Flash tile borders...
// 	vec2 pixel = 2.0 / iResolution.xy;
// 	uv *= 2.0;
// 	float f = floor(mod(iTime*.5, 2.0)); 	// Flash value.
// 	vec2 first = step(pixel, uv) * f;		   	// Rule out first screen pixels and flash.
// 	uv  = step(fract(uv), pixel);				// Add one line of pixels per tile.
// 	colour = mix(colour, vec3(1.0, 1.0, 0.0), (uv.x + uv.y) * first.x * first.y); // Yellow line
// 	#endif
    
// 	return vec4(colour, 1.0);
// }
// void main() {
// 	gl_FragColor = mainImage();
// }
#define PI 3.1415926
uniform sampler2D tImage;
uniform float iTime;
uniform vec2 uRepeat;
varying vec2 vUv;
vec2 hash( vec2 p ) // replace this by something better
{
    p = vec2( dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}

float noise( in vec2 p )
{
    const float K1 = 0.366025404; // (sqrt(3)-1)/2;
    const float K2 = 0.211324865; // (3-sqrt(3))/6;

    vec2  i = floor( p + (p.x+p.y)*K1 );
    vec2  a = p - i + (i.x+i.y)*K2;
    float m = step(a.y,a.x); 
    vec2  o = vec2(m,1.0-m);
    vec2  b = a - o + K2;
    vec2  c = a - 1.0 + 2.0*K2;
    vec3  h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
    vec3  n = h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
    return dot( n, vec3(70.0) );
}
vec2 rotate2(vec2 uv, float radain) {
    mat2 rotateMatrix = mat2(vec2(cos(radain), sin(radain)), 
                             vec2(sin(radain), cos(radain)));
    return rotateMatrix * uv;
}
vec4 mainImage()
{
    vec2 uv = vUv;
	vec2 uv2 = vUv;
 	uv.y = fract(uv.y * 3.0);
    uv2.y = fract(uv2.y * uRepeat.y);
    uv2.x = uv.x = fract(uv.x * uRepeat.x - iTime * .01);
	uv.y = noise(uv2);
    vec2 bl = step(vec2(0.45), uv2);
    vec2 tr = step(vec2(0.45),1.0-uv2);
    //background texture
   	//vec4 texture_color = texture(iChannel0, uv);
    
   	//background color rgb( 49/255, 169/255, 238/255, 255/255 ) -- 0.192156862745098, 0.6627450980392157, 0.9333333333333333
    vec4 texture_color = vec4(0.192156862745098, 0.6627450980392157, 0.9333333333333333, 1.0);
    
    vec4 k = vec4(iTime)*0.1;
	k.xy = uv * 7.0;
    float val1 = length(0.5-fract(k.xyw*=mat3(vec3(-2.0,-1.0,0.0), vec3(3.0,-1.0,1.0), vec3(1.0,-1.0,-1.0))*0.5));
    float val2 = length(0.5-fract(k.xyw*=mat3(vec3(-2.0,-1.0,0.0), vec3(3.0,-1.0,1.0), vec3(1.0,-1.0,-1.0))*0.2));
    float val3 = length(0.5-fract(k.xyw*=mat3(vec3(-2.0,-1.0,0.0), vec3(3.0,-1.0,1.0), vec3(1.0,-1.0,-1.0))*0.5));
    vec4 color = vec4 ( pow(min(min(val1,val2),val3), 7.0) * 3.0)+texture_color;
    return mix(color, vec4(1.0), bl.x * bl.y * tr.x * tr.y);
}
void main() {
    vec2 uv = vUv;
    // uv = rotate2(uv, PI / 2.0);
    // uv.y = fract(uv.y * uRepeat.x - iTime * .01);
    // vec4 c = texture2D(tImage, uv);
   
    vec4 c2 = mainImage();
    // pipe arrow line
    gl_FragColor = c2;
}
`