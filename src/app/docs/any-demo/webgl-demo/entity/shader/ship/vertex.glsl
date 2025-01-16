attribute vec2 a_position;
attribute vec2 a_texCoord;
attribute float a_type;
uniform vec2 u_resolution;// 画布像素大小
uniform mat3 u_matrix; // 变形矩阵
varying vec2 v_texcoord;
varying float v_type;
void main(){
   vec2 position=(u_matrix * vec3(a_position, 1.0)).xy;
   // convert the position from pixels to 0.0 to 1.0
   vec2 zeroToOne=position/u_resolution;// 归一
   
   // convert from 0->1 to 0->2
   vec2 zeroToTwo=zeroToOne*2.;
   
   // convert from 0->2 to -1->+1 (clipspace)
   vec2 clipSpace=zeroToTwo-1.;
   gl_Position=vec4(clipSpace*vec2(1,-1),0,1);
   v_texcoord=a_texCoord;
   v_type = a_type;
}