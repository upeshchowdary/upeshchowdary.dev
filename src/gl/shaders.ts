// Ashima / Stefan Gustavson 3D simplex noise (MIT)
const noise = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`

export const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uFrom;
uniform float uTo;
uniform float uT;
uniform float uSize;
uniform float uPixel;
uniform float uEmber;
uniform vec3 uMouse;
uniform float uMouseStrength;

attribute vec3 s0;
attribute vec3 s1;
attribute vec3 s2;
attribute vec3 s3;
attribute vec3 s4;
attribute vec3 s5;
attribute vec3 s6;
attribute float aRand;

varying float vAlpha;
varying float vEmber;

${noise}

vec3 shapeAt(float i){
  if(i < 0.5) return s0;
  if(i < 1.5) return s1;
  if(i < 2.5) return s2;
  if(i < 3.5) return s3;
  if(i < 4.5) return s4;
  if(i < 5.5) return s5;
  return s6;
}

void main(){
  // per-particle staggered morph
  float delay = aRand * 0.45;
  float t = smoothstep(delay, delay + 0.55, uT);
  vec3 a = shapeAt(uFrom);
  vec3 b = shapeAt(uTo);
  vec3 p = mix(a, b, t);

  // turbulence peaks mid-morph — particles "dissolve" between forms
  float storm = sin(t * 3.14159);
  vec3 q = p * 0.55 + vec3(aRand * 7.0);
  p += vec3(
    snoise(q + vec3(uTime * 0.25, 0.0, 0.0)),
    snoise(q + vec3(0.0, uTime * 0.25, 13.0)),
    snoise(q + vec3(31.0, 0.0, uTime * 0.25))
  ) * (0.035 + storm * 0.9);

  // ambient breathing
  p += normalize(p + 0.0001) * snoise(p * 0.8 + uTime * 0.18) * 0.04;

  vec4 world = modelMatrix * vec4(p, 1.0);

  // mouse repulsion in screen-aligned plane
  vec2 d = world.xy - uMouse.xy;
  float dist = length(d);
  float push = smoothstep(1.35, 0.0, dist) * uMouseStrength;
  world.xy += normalize(d + 0.0001) * push * 0.55;

  vec4 mv = viewMatrix * world;
  gl_Position = projectionMatrix * mv;

  // signal packets: a sparse set of particles pulse brighter and larger
  float packet = step(0.988, fract(aRand * 517.3));
  float pulse = packet * (0.5 + 0.5 * sin(uTime * 2.6 + aRand * 60.0));

  // depth of field: nearer particles are larger and brighter, far ones recede
  float depth = smoothstep(-13.5, -7.5, mv.z);
  float size = uSize * (0.55 + aRand * 0.9) * (0.75 + depth * 0.5) * (1.0 + pulse * 1.6);
  gl_PointSize = size * uPixel * (10.0 / -mv.z);

  vAlpha = (0.35 + 0.65 * fract(aRand * 43.7)) * (0.75 + storm * 0.25) * mix(0.4, 1.0, depth) + pulse * 0.9;
  vEmber = step(1.0 - uEmber, fract(aRand * 91.3)) + push * 0.8 + packet;
}
`

export const fragmentShader = /* glsl */ `
uniform float uOpacity;
varying float vAlpha;
varying float vEmber;

void main(){
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  if(d > 0.5) discard;
  float core = smoothstep(0.5, 0.0, d);
  float glow = pow(core, 2.2);
  vec3 bone = vec3(0.93, 0.91, 0.87);
  vec3 ember = vec3(1.0, 0.30, 0.12);
  vec3 col = mix(bone, ember, clamp(vEmber, 0.0, 1.0));
  gl_FragColor = vec4(col, glow * vAlpha * uOpacity);
}
`
