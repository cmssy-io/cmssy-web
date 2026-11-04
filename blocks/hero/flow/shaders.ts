const SNOISE = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`;

export const VERTEX = /* glsl */ `
precision highp float;
attribute float aLag;
uniform float uTime;
uniform float uAspect;
uniform float uDpr;
uniform float uScale;
uniform float uMobile;
uniform vec2 uMouse;
varying float vAlpha;
varying vec3 vColor;
${SNOISE}

const vec3 ELEKTRYK = vec3(0.0, 0.659, 0.941);
const vec3 SKY = vec3(0.357, 0.776, 0.969);
const vec3 PAPER = vec3(0.98, 0.98, 0.972);

void main() {
  float trail = aLag / 16.0;
  float t = uTime - aLag * 0.3;
  float depth = position.z;
  float persp = mix(0.38, 1.0, depth);
  float halfW = 1.35 * uAspect / persp;
  float speed = mix(0.07, 0.22, depth) * (0.7 + 0.6 * fract(position.x * 7.31));
  float x = mod(position.x * halfW * 2.0 + t * speed, halfW * 2.0) - halfW;
  float y0 = (position.y * 2.0 - 1.0) * 1.3 / persp;
  float cx = x * persp / uAspect;
  float conv = (1.0 - uMobile) * smoothstep(-0.7, 0.45, cx);
  y0 = mix(y0, -0.05 / persp, conv * 0.72);
  float n1 = snoise(vec3(x * 0.42 + depth * 2.0, y0 * 0.7, uTime * 0.05));
  float n2 = snoise(vec3(x * 1.1, y0 * 1.6 + 11.0, uTime * 0.08 + depth));
  vec2 p = vec2(x + n2 * 0.06, y0 + (n1 * 0.55 + n2 * 0.11) * (1.0 - conv * 0.55)) * persp;
  p += uMouse * (depth - 0.5) * vec2(0.09 * uAspect, 0.06) * (1.0 - uMobile);

  vec2 m = vec2(uMouse.x * uAspect, uMouse.y);
  vec2 d = p - m;
  float r = length(d);
  p += (d / max(r, 0.001)) * exp(-r * r * 7.0) * 0.16 * mix(0.4, 1.0, depth);

  vec2 clip = vec2(p.x / uAspect, p.y);
  float edge = smoothstep(0.0, 0.3, 1.25 - abs(clip.x)) * smoothstep(0.0, 0.3, 1.1 - abs(clip.y));
  float typeDesktop = smoothstep(0.2, -0.3, clip.x) * smoothstep(-0.25, 0.3, clip.y);
  float typeMobile = smoothstep(-0.2, 0.5, clip.y);
  float typeZone = mix(typeDesktop, typeMobile, uMobile);
  float density = mix(0.45, 1.0, smoothstep(-0.7, 0.5, clip.x));
  float alpha = mix(0.42, 1.0, depth) * pow(1.0 - trail, 1.4) * edge * density * (1.0 + conv * 0.35) * (1.0 - typeZone * 0.75);

  float h = fract(position.x * 31.7 + position.y * 17.3);
  vColor = h < 0.62 ? ELEKTRYK : (h < 0.9 ? SKY : PAPER * 0.8);
  vAlpha = alpha;

  float size = mix(1.4, 3.4, depth) * (0.8 + 0.6 * fract(position.y * 13.7)) * (1.0 - trail * 0.6) * uScale;
  gl_PointSize = max(size, 0.6) * uDpr;
  gl_Position = vec4(clip, 0.0, 1.0);
}
`;

export const FRAGMENT = /* glsl */ `
precision highp float;
varying float vAlpha;
varying vec3 vColor;
void main() {
  float r = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.12, r);
  gl_FragColor = vec4(vColor, a * vAlpha);
}
`;
