import { CustomShader, TextureUniform, UniformType, VaryingType } from 'cesium';

export const Shader01 = (UNIFORM: any = {}) => {
  let uniform = {
    ...UNIFORM,
    u_colorIndex: {
      type: UniformType.FLOAT,
      value: 1.0
    },
    u_normalMap: {
      type: UniformType.SAMPLER_2D,
      value: new TextureUniform({
        url: '/assets/images/1.jpg'
      })
    }
  };
  return new CustomShader({
    uniforms: {
      ...uniform
    },
    varyings: {
      v_selectedColor: VaryingType.VEC4
    },

    vertexShaderText: `
           void vertexMain(VertexInput vsInput, inout czm_modelVertexOutput vsOutput) {
              float positiveX = step(0.0, vsOutput.positionMC.x);
              v_selectedColor = mix(
                vsInput.attributes.color_0,
                vec4(1.0, 0.0, sin(u_time), 1.0),
                vsOutput.positionMC.x
              );
              vec4 positionWC = czm_model * vec4(vsInput.attributes.positionMC, 1.0);
              vsOutput.positionMC = (czm_inverseModel * positionWC).xyz;
           }
        `,
    fragmentShaderText: `
      
            void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
            //   int featureId = fsInput.featureIds.featureId_0
            //   if (featureId == 0) {
            //     material.diffuse = vec3(1.0, 0.0, random());
            //   }
              material.diffuse = v_selectedColor.rgb;
            }
        `
  });
};
