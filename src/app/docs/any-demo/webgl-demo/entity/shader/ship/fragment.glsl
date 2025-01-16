precision mediump float;// 精度
varying vec2 v_texcoord;
varying float v_type;
uniform sampler2D u_texture;

void main(){
   if(v_type==1.0){
      gl_FragColor=vec4(1.,0,0,1.);
   }else if (v_type == 2.0){
      gl_FragColor=vec4(.0431,1.,.0902,1.);
   } else {
      gl_FragColor=vec4(0.0, 0.4314, 1.0, 1.0);
   }
}