precision mediump float;// 精度
varying vec2 v_texcoord;
uniform float u_type;
uniform sampler2D u_texture0;
uniform sampler2D u_texture1;
uniform sampler2D u_texture2;
void main(){
   if(u_type==2.){
      gl_FragColor=texture2D(u_texture2,v_texcoord);
   } else if (u_type == 1.0) {
      gl_FragColor=texture2D(u_texture1,v_texcoord);
   } else if (u_type == .0){
      gl_FragColor=texture2D(u_texture0,v_texcoord);
   } else {
      gl_FragColor= vec4(1.0, 0,0,1.0);
   }  
}