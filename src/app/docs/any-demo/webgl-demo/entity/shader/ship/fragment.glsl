precision mediump float;// 精度
varying vec2 v_texcoord;
varying float v_type;
uniform sampler2D u_texture1;
uniform sampler2D u_texture2;
uniform sampler2D u_texture3;
void main(){
   if(v_type==1.){
      gl_FragColor=texture2D(u_texture1,v_texcoord);
   }else if(v_type==2.){
      gl_FragColor=texture2D(u_texture2,v_texcoord);
      
   }else{
      gl_FragColor=texture2D(u_texture3,v_texcoord);
      
   }
   
}