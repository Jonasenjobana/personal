#version 330 core

uniform vec3 cameraPos; // 相机位置
uniform vec3 cameraDir; // 相机方向
uniform vec3 spherePos; // 球体位置
uniform float sphereRadius; // 球体半径

out vec4 fragColor;

bool intersectSphere(vec3 rayOrigin, vec3 rayDir) {
  vec3 L = spherePos - rayOrigin;
  float tca = dot(L, rayDir);
  if (tca < 0) return false;
  float d2 = dot(L, L) - tca * tca;
  if (d2 > sphereRadius * sphereRadius) return false;
  return true;
}

void main() {
  vec2 uv = gl_FragCoord.xy / vec2(800, 600); // 获取像素坐标
  vec3 rayDir = normalize(vec3(uv * 2.0 - 1.0, 1.0)); // 计算像素对应的光线方向
  rayDir = mat3(vec3(1, 0, 0), vec3(0, 1, 0), vec3(0, 0, 1)) * rayDir; // 转换到世界坐标系

  if (intersectSphere(cameraPos, rayDir)) {
    fragColor = vec4(1, 1, 1, 1); // 如果相交，设置像素为白色
  } else {
    fragColor = vec4(0, 0, 0, 1); // 如果不相交，设置像素为黑色
  }
}