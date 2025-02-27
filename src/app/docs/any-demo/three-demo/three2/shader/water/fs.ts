export default /*glsl*/`
// Found this on GLSL sandbox. I really liked it, changed a few things and made it tileable.
// :)
// by David Hoskins.
// Original water turbulence effect by joltz0r


// Redefine below to see the tiling...
// #define SHOW_TILING

#define TAU 6.28318530718
#define MAX_ITER 5
uniform sampler2D tImage;
uniform float uTime;
vec4 water(vec2 uv)
{     
  /** 使用 -uOffset 保证和 progress 动画方向一致*/
  vec2 p = fract(vUv * 10.0 - vec2(uTime * .1, .0));
  vec4 color = texture2D(tImage, vUv);
  //确定颜色
  return vec4( color.rgb , 1.0 );
}

// uniform float waterFlowAngle; // 水流方向
// vec4 water(vec2 uv) 
// {
//     // uv.y += uTime * 0.05; // 0.5为平移速度
// 	uv.x = fract(uv.x * 10.0 + uTime * 0.05);
// 	float time = uTime * .5+23.0;
//     vec4 texture_color = vec4(0.192156862745098, 0.6627450980392157, 0.9333333333333333, 1.0);
    
//     vec4 k = vec4(time);
// 	k.xy = uv * 7.0;
//     float val1 = length(0.5-fract(k.xyw*=mat3(vec3(-2.0,-1.0,0.0), vec3(3.0,-1.0,1.0), vec3(1.0,-1.0,-1.0))*0.5));
//     float val2 = length(0.5-fract(k.xyw*=mat3(vec3(-2.0,-1.0,0.0), vec3(3.0,-1.0,1.0), vec3(1.0,-1.0,-1.0))*0.2));
//     float val3 = length(0.5-fract(k.xyw*=mat3(vec3(-2.0,-1.0,0.0), vec3(3.0,-1.0,1.0), vec3(1.0,-1.0,-1.0))*0.5));
//     vec4 color = vec4 ( pow(min(min(val1,val2),val3), 7.0) * 3.0)+texture_color;
// 	return color;
// }
`