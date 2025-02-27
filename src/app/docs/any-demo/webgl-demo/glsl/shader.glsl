#define T (iTime*5.)
#define A(v) mat2(cos(m.v*3.1416 + vec4(0, -1.5708, 1.5708, 0)))       // rotate
#define H(v) (cos(((v)+.5)*6.2832 + radians(vec3(60, 0, -60)))*.5+.5)  // hue

float map(vec3 u)
{
    float t = T,    // speed
          l = 5.,   // loop to reduce clipping
          w = 40.,  // z warp size
          s = .4,   // object size (max)
          f = 1e20, i = 0., y, z;
    
    u.yz = -u.zy; // 调整坐标系
    u.xy = vec2(atan(u.x, u.y), length(u.xy));  // polar transform 极坐标变化 (θ, r)
    u.x += t/6.;                                // counter rotation 变化θ值
    
    vec3 p;
    for (; i++<l;)
    {
        p = u;
        y = round(max(p.y-i, 0.)/l)*l+i;  // segment y & skip rows
        p.x *= y;                         // scale x with rounded y
        p.x -= sqrt(y*t*t*2.);            // move x
        p.x -= round(p.x/6.2832)*6.2832;  // segment x
        p.y -= y;                         // move y
        p.z += sqrt(y/w)*w;               // curve inner z down
        z = cos(y*t/50.)*.5+.5;           // radial wave // 
        p.z += z*2.;                      // wave z z轴变化
        p = abs(p);
        f = min(f, max(p.x, max(p.y, p.z)) - s*z);  // cubes 正方形
    }
    
    return f;
}
// C 像素颜色 U 当前渲染像素坐标 iResolution 整体画布像素大小
void mainImage( out vec4 C, in vec2 U )
{
    float l = 50.,  // loop
          i = 0., d = i, s, r;
    
    vec2 R = iResolution.xy,
         m = iMouse.z > 0. ?  // clicking?
               (iMouse.xy - R/2.)/R.y:  // mouse coords
               vec2(0, -.17);           // default (noclick)
    
    vec3 o = vec3(0, 20, -120),  // camera 相机位置
         u = normalize(vec3(U - R/2., R.y)),  // 3d coords 坐标原点移到屏幕中心 求出光线方向向量
         c = vec3(0), p;// c 颜色累计
    
    mat2 v = A(y),  // pitch 俯仰角
         h = A(x);  // yaw 偏移
    
    for (; i++<l;)  // raymarch 光线追踪 50步
    {
        p = u*d + o; // 光线位置 = 起点（相机） + 步进距离 * 光线方向向量
        p.yz *= v; // 摄像机如果旋转了
        p.xz *= h;
        
        s = map(p); // 距离
        r = (cos(round(length(p.xz))*T/50.)*.7 - 1.8)/2.;  // color gradient 渐变
        c += min(s, exp(-s/.07))  // black & white s越小 exp越大 白色， s越大 越暗
           * H(r+.5) * (r+2.4);      // color H颜色 r 亮度
        
        if (s < 1e-3 || d > 1e3) break;
        d += s*.7;
    }
    
    C = vec4(exp(log(c)/2.2), 1); // 伽马校正
}