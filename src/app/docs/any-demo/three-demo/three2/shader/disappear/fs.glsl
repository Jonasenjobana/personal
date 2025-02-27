uniform float progress;
uniform float edgeWidth;
uniform vec3 edgeColor;
uniform sampler2D mainTexture;
uniform sampler2D noiseTexture;
varying vec2 vUv;
void main(void){
    
    vec4 originalColor=texture2D(mainTexture,vUv);
    
    float noiseValue=texture2D(noiseTexture,vUv).r;
    
    vec4 finalColor=originalColor;
    // 
    if(noiseValue>progress)
    
    {
        
        discard;
        
    }
    
    if(noiseValue+edgeWidth>progress){
        
        finalColor=vec4(edgeColor,1.);
        
    }
    
    gl_FragColor=finalColor;
    
}