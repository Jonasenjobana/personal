attribute vec2 aPosition;
attribute vec2 aTexCoord;
varying vec2 v_texcoord;// 片元纹理坐标
uniform mat3 uModel;// 模型矩阵（平移+旋转+缩放）
uniform mat3 uProjection;// 投影矩阵
void main(){
   vec3 pos=uProjection*uModel*vec3(aPosition,1.);
   gl_Position=vec4(pos.xy,0.,1.);
   v_texcoord=aTexCoord;
}