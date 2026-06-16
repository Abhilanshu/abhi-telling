import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useAnimations, useTexture, Environment, useFBO } from '@react-three/drei';
import * as THREE from 'three';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import { RGBELoader } from 'three-stdlib';
import { useLoader } from '@react-three/fiber';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import Crystal from './Crystal';
import Reflector from './Reflector';

const colorsMapBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABAAAAAACCAIAAABJ+DnMAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAABm5JREFUeJytWNtyJLcNPSC75ybtrsvrxHFSdiovefIP5P8/w7FdZcd+2ErWK2l1mZkmEAAkuzndM9JWnC4IOjgA2dPkIXok2m53IerVh9jFrlPQmTfgYRdK6NbiKRUNTyBmMoQxjOZDxaH4kOn6qzAhQ/dhYutFoYFUQveknmC/owFyiuyHLLRahBybB40Z/TEfSSgIAZ6UAAFJhBgmJkrBUimIggSY1zDiAAxBBtAhJiX3sOw+yCPxIWCAPJAcg/kD5D8kT8SPJB9IfiH+F/Gt3YfdBGCIFKDe8FCBzio+t3vhM0CNKrCpRpwmzCM5IIl5Hjw7mGnWmCNwNJ4zqV4f6xFyB7kF/2o3nJnfRO1vjK8TPk94nfBqwFXCesCWza+OWB0QjugOiEez7ogwOB7QJbcBfcIqoWesBqwTNoztAetHdGr3iO9j+OUaN18Cr4ArYA10QHSfQaygPw1bEM6RSxvLMggVj9mRRw1zFrVA9aTPp7urj6h7Y4+bQMoczMIeVE3Xl55UOaBb0D3wEbgB/Qb8BPwI+tFWmepyO/hW8I3gta6E4I1gK9gAG8FabFU0XOsiClZsn0V9J8VHtvW1h9CQEdzHaiED/bBi2PxQN9gFU3yq5HDOjqemT3Zw2/uTPQIf3L7Ds9c/gK+Az32z1ba+5TsH+oj6uCv3vVuWQl+lMIJRH3k/ysfPz9SCVG35KAcHB8f7+hxP1e6zvcXNa7y7wq9v8L3uyrV/0k39sOtT2YRGTgWzLXRwkQQXTAlTxTVroR8d1VXwkxTctFkEP1sqMAXBNRb3LrMHhCcTWLhHeDBdhXegH2w98qq0vrWRyVeLpXo5F3LTHYA/M/4i+IpNqDvBNeM1m0R7se6gprrVo6763Lg4zSdrAdo1SmvQppDx0eWa7Iltt7KuUvW2PZ8h/RX7P2D/Ck9qOxw2eNjifoPbDjdb/LB25fTuO/ex4v60KfRNOxglFNvjXT0aPy5TC37Xlbt4btXH2rCPJdSGbfjgQF8zhz+lx7eyv+b9Wu536XEjd9t0s5a7Pn24Sv/eDT9v0j+tvx6t1+oSx7y4BxfewaXlEkJeZfbQdWWWvH1lP3gfc+3RWODCQ6588tk+OvlkwmsXhmrzpMWaGQ4gPT+fgSJCZ2eJtrZN+irXo2V+437to2LVX1fXrPM+uSqT8qrMKw7YT52s9Q0Pe89nHMAd2Db3W+6+TvEa8W2KV9y/SXHH/Y5pmzqzY1jbu61bp9gl7ofYD6FP0g0h2mssdHZSzcdBopLl7IbuKKXFKBhbzBOVPpnFPHDpL9pWHhnvRgmQS5wcjww35Hj2uDmQqb6iuSlrybGem2w7+ayyvaNlbcyO0x9ZupSuiDcpdUFWw7Am7oR7DKuUYmDN9jSs9FsU6zIPfRjUdxqGIRpQOxrAQOEY0hA+7Pv+IcpD1O9Mm7vIHyPuwuo24n3o3lP8TlVh2+jHNrgGgm+rehUGuQYMi51KctKAeFm0r3omDR9CLkSiBZbSoPMkE1MLgCaseCJlzkyXh3K2M4gLUurhJ2v1OWQq26FAfKfYjwrz30X0hfMF87XIhmUn0kOumDci68RrkRWr595xrxsidu/VhcM3P4tLTI4pf2FucF6JBSiL3QKcyzYkcJmfFcwql3wdflLTkm3lItUyc3I5cFnwrJ9CuTCDLIbI+fBkEjlXMAPLYpkmabBJnST3T/9LSAqwv5CskdIJlrbeKimDPFyohNLO5qfJQRnYfP+oC3+WuUSeFFxOTfYpNS8Z/qfski+MnK+ZsDyXwqeRkPlN5zWnAjwJWyWezoNFCrPJT8lLlWfKFqlLNS/yVZvBNRKqDFuygKrurPqmOP+/YBpL7Tw1Ox6Xy8x4As4Xn5BNOI2qk5yrOZl8zotQkyJMh3jOyMTUeSqWtn5GjuqjZ8MRUyuT9hBQs59NMaGC8iopIM9TQHl9CGY8FlnkmjIPyvwyMcWf1teW2pZVvt4F02yVqaMmXdv64XzYzFCnPQHjfTHNjJPh7ZDmb7Y6g2DJiwft/3vaynKjNpRlmUz1Y3bGzCpfIBvG4CJ1qUb86+opM6VKvcwL8lw1hcJkotxmKps+g8xSzdgyQePLkrTMEhCm7R0xNTu2wC+G064umLNljTrmWV4Ov2xni1leKGsLppRMmBtN8WIUL0OZAD9DfjpT+edCmQZOYJkacfOA/8frv97MSVP380B1AAAAAElFTkSuQmCC";

const colorsMap = new THREE.TextureLoader().load(colorsMapBase64);
colorsMap.minFilter = THREE.LinearFilter;
colorsMap.magFilter = THREE.LinearFilter;
colorsMap.colorSpace = THREE.SRGBColorSpace;

gsap.registerPlugin(ScrollTrigger);

const HOVER_CASE_COLORS = [
new THREE.Color(0xfbe687), // Coinbase Gold
new THREE.Color(0x87acfb), // Salesforce Blue
new THREE.Color(0xc2fac9), // Intel Green/Mint
new THREE.Color(0xffb0fa), // Vogue Pink/Rose
new THREE.Color(0xcbddd9), // Noomo Labs Grey
new THREE.Color(0x4edbef), // Noomo Valentime Cyan
new THREE.Color(0xcef1e2), // AMD Teal
];

const DESKTOP_SEGMENTS = [100, 150, 300, 300, 200, 300, 500, 200, 80, 80, 170, 190, 280, 50, 50, 100, 140, 560, 200, 280];
const MOBILE_SEGMENTS  = [50, 75, 150, 150, 100, 150, 250, 100, 40, 40, 170, 190, 280, 50, 50, 100, 140, 1100, 250, 280];

const getTimelineTime = (prog, isMobile) => {
const segments = isMobile ? MOBILE_SEGMENTS : DESKTOP_SEGMENTS;
const v = window.innerHeight;
const totalPixels = segments.reduce((sum, len) => sum + len * v / 100, 0);
const scrollPixels = prog * totalPixels;

let accumulated = 0;
for (let i = 0; i < segments.length; i++) {
const segmentLength = segments[i] * v / 100;
const start = accumulated;
const end = accumulated + segmentLength;
if (scrollPixels >= start && scrollPixels <= end) {
const fraction = segmentLength > 0 ? (scrollPixels - start) / segmentLength : 0;
return i + fraction;
}
accumulated += segmentLength;
}
return segments.length;
};


// ── CUSTOM SHADERS FOR DOUBLE-PASS GLASS / DISPERSION ─────────────────────

const glassBackVertexShader = `
attribute float _dist;
attribute float _convexity;
attribute float _concavity;

#include <skinning_pars_vertex>

varying float vDist;
varying float vCurvature;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vTangent;
varying vec2 vUv;

uniform float convexityFactor;
uniform float concavityFactor;
uniform float distancesFactor;
uniform float resetDistances;

#define defaultDist 2.

void main() {
float dist = _dist;
#ifdef USE_DEFAULT_DIST
dist = defaultDist;
#endif
if (dist == 0.0) dist = defaultDist;
vDist = mix(dist * distancesFactor, 0.1, resetDistances);
vCurvature = _convexity * convexityFactor - _concavity * concavityFactor;
vUv = uv;

vec3 transformed = position;
vec3 objectNormal = normal;
vec3 objectTangent = tangent.xyz;

#include <skinbase_vertex>
#include <skinnormal_vertex>
#include <skinning_vertex>

vNormal = -objectNormal;
vTangent = objectTangent;

vec4 worldPosition = modelMatrix * vec4(transformed, 1.0);
vPosition = worldPosition.xyz;

gl_Position = projectionMatrix * viewMatrix * worldPosition;
gl_Position.xy /= 1.25;
}
`;

const glassBackFragmentShader = `
#define pi 3.14159265358979323846

varying vec3 vPosition;

varying vec3 vNormal;
varying vec3 vTangent;
varying float vDist;
varying float vCurvature;
varying vec2 vUv;

uniform mat4 modelMatrix;
uniform mat4 projectionMatrix;
uniform sampler2D map;
uniform float envRefraction;
uniform float iorStart;
uniform float iorDelta;
uniform float refractionIridescence;
uniform float fringeCurve;
uniform float fringeMix;
uniform vec3 fringeColor;
uniform float useTransmittance;
uniform sampler2D envMap;
uniform sampler2D colorsMap;
uniform sampler2D noiseMap;
uniform float uvShiftFactor;
uniform float seconds;

#define oneOverPi 0.3183098861837907
vec3 getEnvColor(vec3 ray) {
vec2 uv = vec2(atan(ray.x, ray.z) * 0.5, asin(ray.y));
uv = uv * oneOverPi + 0.5;
uv.x = fract(uv.x);
vec3 color = texture2D(envMap, uv).rgb;
color = 1. - exp(-0.1 * color);
return color;
}

vec3 mixToColor(float f) {
return texture2D(colorsMap, vec2(f, 0.0)).rgb;
}

vec3 getIridescence(vec3 rd, vec3 n) {
float thickness = 1. - abs(dot(n, rd));
return texture2D(colorsMap, vec2(thickness * 0.3 + 0.08, 1.0)).rgb;
}

#ifdef USE_NORMAL_MAP
uniform sampler2D normalMap;
#endif

vec3 getNormal() {
vec3 N = normalize(vNormal);
#ifdef USE_NORMAL_MAP
vec2 uv = vUv;
vec3 mapN = normalize(texture2D(normalMap, uv).xyz * 2.0 - 1.0);
vec3 T = normalize(vTangent);
vec3 B = normalize(cross(N, T));
mat3 tbn = mat3(T, B, N);
vec3 newN = normalize(tbn * mapN);
return normalize(mat3(modelMatrix) * newN);
#else
return normalize(mat3(modelMatrix) * N);
#endif
}

float fresnelSchlick(vec3 ray, vec3 normal) {
float cosTheta = abs(dot(normalize(ray), normal));
float r0 = 0.04;
return r0 + (1. - r0) * pow(1. - cosTheta, 5.);
}

void main() {
vec3 normal = getNormal();
vec3 viewDirection = normalize(vPosition - cameraPosition);
float dotNormalView = dot(normal, viewDirection);

vec3 refractionA = refract(viewDirection, normal, 1. / iorStart);
vec3 refractionB = refract(viewDirection, normal, 1. / (iorStart + iorDelta));

float transmittance = 1. - useTransmittance * fresnelSchlick(refractionA, normal);

vec4 clipA = projectionMatrix * viewMatrix * vec4(vPosition + refractionA * vDist, 1.0);
clipA.xy /= 1.25;
vec4 clipB = projectionMatrix * viewMatrix * vec4(vPosition + refractionB * vDist, 1.0);
clipB.xy /= 1.25;

vec2 uvA = clamp(clipA.xy / clipA.w * 0.5 + 0.5, 0.0, 1.0);
vec2 uvB = clamp(clipB.xy / clipB.w * 0.5 + 0.5, 0.0, 1.0);
vec2 dUv = (uvB - uvA) * uvShiftFactor;
vec2 noiseUv = fract(uvA * 777. + seconds);

vec3 color = vec3(0.0);
vec3 palAccum = vec3(0.0);

float dq = 1. / float(samplesCount);
float blue = texture2D(noiseMap, noiseUv).r;
float mixFactor = blue * dq;
vec2 uv;
vec3 ray, texel, pal;
float fringeness = pow(clamp(1. - abs(dotNormalView), 0.0, 1.0), fringeCurve) * fringeMix;

#pragma unroll_loop_start
for (int i = 0; i < samplesCount; i++) {
uv = uvA + dUv * mixFactor;
texel = texture2D(map, uv).rgb;

ray = normalize(mix(refractionA, refractionB, mixFactor));
if (envRefraction > 0.) {
texel += getEnvColor(ray) * envRefraction;
}

pal = mixToColor(mixFactor);
palAccum += pal;

texel = mix(texel, fringeColor, fringeness);
color += texel * pal * transmittance * (1. + vCurvature * abs(dot(ray, normal)));
mixFactor += dq;
}
#pragma unroll_loop_end

color /= palAccum;

vec3 iridescence = getIridescence(refractionA, normal) - 1.; 
color *= refractionIridescence * iridescence + 1.;

gl_FragColor = vec4(color, 0.0);
}
`;

const glassFrontVertexShader = `
attribute float _thickness;
attribute float _peaks;

varying float vThickness;
varying vec3 vNormal;
varying vec3 vTangent;
varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vGlassColor;

#include <skinning_pars_vertex>

uniform float distancesFactor;
uniform float resetDistances;
uniform vec3 baseColor;
uniform vec3 peaksColor;
uniform float peaksFactor;

void main() {
float thickness = _thickness;
if (thickness == 0.0) thickness = 1.0;
vThickness = mix(thickness * distancesFactor, 0.1, resetDistances);
vUv = uv;

float peaks = _peaks;
if (peaks == 0.0) peaks = 0.5;
vGlassColor = mix(baseColor, peaksColor, clamp(peaks * peaksFactor, 0., 1.));

vec3 transformed = position;
vec3 objectNormal = normal;
vec3 objectTangent = tangent.xyz;

#include <skinbase_vertex>
#include <skinnormal_vertex>
#include <skinning_vertex>

vNormal = objectNormal;
vTangent = objectTangent;

vec4 worldPosition = modelMatrix * vec4(transformed, 1.0);
vPosition = worldPosition.xyz;

gl_Position = projectionMatrix * viewMatrix * worldPosition;
gl_Position.xy /= 1.25;
}
`;

const glassFrontFragmentShader = `
varying vec3 vNormal;

varying vec3 vTangent;
varying vec3 vPosition;
varying float vThickness;
varying vec2 vUv;
varying vec3 vGlassColor;

uniform mat4 modelMatrix;
uniform mat4 projectionMatrix;
uniform float envReflection;
uniform sampler2D map;
uniform float colorFactor;
uniform float iorStart;
uniform float iorDelta;
uniform float reflectionIridescence;
uniform float colorBoost;
uniform float decayFactor;
uniform float maxColorValue;
uniform float useTransmittance;
uniform float fringeCurve;
uniform float fringeMix;
uniform vec3 fringeColor;
uniform float colorCurve;
uniform float colorCurveR;
uniform float colorCurveG;
uniform float colorCurveB;
uniform float uvShiftFactor;
uniform float seconds;
uniform sampler2D envMap;
uniform sampler2D colorsMap;
uniform sampler2D noiseMap;

#define oneOverPi 0.3183098861837907
vec3 getEnvColor(vec3 ray) {
vec2 uv = vec2(atan(ray.x, ray.z) * 0.5, asin(ray.y));
uv = uv * oneOverPi + 0.5;
uv.x = fract(uv.x);
vec3 color = texture2D(envMap, uv).rgb;
color = 1. - exp(-0.1 * color);
return color;
}

vec3 mixToColor(float f) {
return texture2D(colorsMap, vec2(f, 0.0)).rgb;
}

vec3 getIridescence(vec3 rd, vec3 n) {
float thickness = 1. - abs(dot(n, rd));
return texture2D(colorsMap, vec2(thickness * 0.3 + 0.08, 1.0)).rgb;
}

#ifdef USE_NORMAL_MAP
uniform sampler2D normalMap;
#endif

vec3 getNormal() {
vec3 N = normalize(vNormal);
#ifdef USE_NORMAL_MAP
vec2 uv = vUv;
vec3 mapN = normalize(texture2D(normalMap, uv).xyz * 2.0 - 1.0);
vec3 T = normalize(vTangent);
vec3 B = normalize(cross(N, T));
mat3 tbn = mat3(T, B, N);
vec3 newN = normalize(tbn * mapN);
return normalize(mat3(modelMatrix) * newN);
#else
return normalize(mat3(modelMatrix) * N);
#endif
}

float fresnelSchlick(vec3 ray, vec3 normal) {
float cosTheta = abs(dot(ray, normal));
return 0.04 + 0.96 * pow(1. - cosTheta, 5.);
}

void main() {
vec3 normal = getNormal();
vec3 viewDirection = normalize(vPosition - cameraPosition);

vec3 refractionA = refract(viewDirection, normal, 1. / iorStart);
vec3 refractionB = refract(viewDirection, normal, 1. / (iorStart + iorDelta));

float transmittance = 1. - useTransmittance * fresnelSchlick(refractionA, normal);

vec4 clipA = projectionMatrix * viewMatrix * vec4(vPosition + refractionA * vThickness, 1.0);
clipA.xy /= 1.25;
vec4 clipB = projectionMatrix * viewMatrix * vec4(vPosition + refractionB * vThickness, 1.0);
clipB.xy /= 1.25;

vec2 uvA = clamp(clipA.xy / clipA.w * 0.5 + 0.5, 0.0, 1.0);
vec2 uvB = clamp(clipB.xy / clipB.w * 0.5 + 0.5, 0.0, 1.0);
vec2 noiseUv = fract(uvA * 777. + seconds);

vec3 color = vec3(0.0);
vec3 palAccum = vec3(0.0);

float dq = 1. / float(samplesCount);
float blue = texture2D(noiseMap, noiseUv).r;
float mixFactor = blue * dq;
vec2 dUv = (uvB - uvA) * dq * uvShiftFactor;
vec2 uv = uvA + dUv * blue;
vec3 texel;
vec3 pal;

#pragma unroll_loop_start
for (int i = 0; i < samplesCount; i++) {
texel = texture2D(map, uv).rgb;

pal = mixToColor(mixFactor);
palAccum += pal;
color += texel * pal;

uv += dUv;
mixFactor += dq;
}
#pragma unroll_loop_end

color *= transmittance / palAccum;

float fringeness = fringeMix * pow(clamp(1. - abs(dot(viewDirection, normal)), 0.0, 1.0), fringeCurve);
color = mix(color, fringeColor, fringeness);

float luminance = dot(color, vec3(0.2126, 0.7152, 0.0722));
color = (color - luminance) * colorBoost + luminance;
color = max(color, 0.);

float decay = exp(-vThickness * decayFactor);
color *= mix(vGlassColor, vec3(1.), decay);

vec3 iridescence = getIridescence(viewDirection, normal) - 1.; 
iridescence = reflectionIridescence * iridescence + 1.;

color *= colorFactor;
if (color.r < 1.) {
color.r = pow(color.r, colorCurve * colorCurveR);
}
if (color.g < 1.) {
color.g = pow(color.g, colorCurve * colorCurveG);
}
if (color.b < 1.) {
color.b = pow(color.b, colorCurve * colorCurveB);
}

float fresnel = fresnelSchlick(viewDirection, normal);
vec3 ray = reflect(viewDirection, normal);
color += getEnvColor(ray) * envReflection * fresnel * iridescence;

color = clamp(color, 0., maxColorValue);

gl_FragColor = vec4(color, 0.0);
}
`;

// Background color is driven directly via scene.background — no mesh needed.


// ── MAIN EXPERIENCE ──────────────────────────────────────────
export default function Experience({ 
isMobile, 
onSelectCase, 
experienceStarted,
clickedCaseIndex = -1,
isTransitioning = false
}) {
const { camera, scene } = useThree();

// 1. Load Animation timelines
const timelineGLTF = useGLTF(isMobile ? '/timelines/cam-mob.glb' : '/timelines/cam.glb');
const devGLTF      = useGLTF('/timelines/dev.glb');

// 2. Load Phoenix (bird) and Feather models
const birdGLTF     = useGLTF('/models/v20.glb');
const featherGLTF  = useGLTF('/models/feather.glb');

// 3. Load detailed textures including noises
const [iceTex, iceNormalTex, waveTexture, mountainsTexture, noiseTexture, sunTexture] = useTexture([
'/textures/ice.jpg',
'/textures/icen.jpg',
'/textures/waves.jpg',
'/textures/mountains.png',
'/textures/LDR_RG01_0.png',
'/textures/icon.png'
]);

iceTex.wrapS = iceTex.wrapT = THREE.RepeatWrapping;
iceNormalTex.wrapS = iceNormalTex.wrapT = THREE.RepeatWrapping;
waveTexture.wrapS = waveTexture.wrapT = THREE.RepeatWrapping;
waveTexture.repeat.set(4, 4);

useEffect(() => {
if (mountainsTexture) {
mountainsTexture.wrapS = mountainsTexture.wrapT = THREE.RepeatWrapping;
mountainsTexture.repeat.set(Math.PI, 1);
}
}, [mountainsTexture]);

// Load HDR map for reflections
const envMapTexture = useLoader(RGBELoader, '/textures/wooden_studio_19_1k.hdr');
envMapTexture.mapping = THREE.EquirectangularReflectionMapping;

// Frame Buffer Object for double pass refraction
const fbo = useFBO(1024, 1024);
const backFbo = useFBO(1024, 1024);

// 4. Setup animation controllers
const mixerCam = useRef();
const mixerDev = useRef();
const actionsCam = useRef([]);
const actionsDev = useRef([]);
const durCam = useRef(0);
const durDev = useRef(0);
const scrollProgress = useRef(0);

// Bird flap control
const birdRef = useRef();
const birdMixer = useRef();
const birdActions = useRef({});
const neckBoneRef = useRef(null);
const neckBoneRotationRef = useRef(new THREE.Euler());
const neckBoneLastRotationRef = useRef(new THREE.Euler());

// Guard: track whether THIS mount has already set up bird glass materials
const birdSetupDone = useRef(false);

// Refs to hold timeline-driven shader variables
const isBurningRef = useRef(0);
const mouseParallax = useRef({ x: 0, y: 0 });
const transitionProgress = useRef(0);
const waterColorRef = useRef(new THREE.Color(0.769, 0.773, 0.945));
const sunSizeAmpRef = useRef(new THREE.Vector2(1, 1));
const sunOpacityRef = useRef(1);
const glassColorRef = useRef(new THREE.Color(0.92, 0.74, 0.96));
const glassPeaksColorRef = useRef(new THREE.Color(0.99, 0.81, 0.86));
const glassFringeColorRef = useRef(new THREE.Color(0.95, 0.82, 0.95));
const fireBackOpacityRef = useRef(0);
const envDarknessRef = useRef(0);

// Hover background states
const hoveredCaseRef = useRef(-1);
const bgHoverProgressRef = useRef(0);
const activeHoverColorRef = useRef(new THREE.Color(1, 1, 1));

// Dummy parameter nodes inside dev.glb
const paramNodes = useRef({});

// Global mouse tracking NDC coordinates (bypasses pointer-events: none on WebGL container)
const mouseTarget = useRef({ x: 0, y: 0 });
useEffect(() => {
  if (isMobile) return;
  const onMove = (e) => {
    mouseTarget.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseTarget.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
  };
  const onTouchMove = (e) => {
    const touch = e.touches[0] || e.changedTouches[0];
    if (touch) {
      mouseTarget.current.x = (touch.clientX / window.innerWidth) * 2 - 1;
      mouseTarget.current.y = -(touch.clientY / window.innerHeight) * 2 + 1;
    }
  };
  window.addEventListener('mousemove', onMove);
  window.addEventListener('touchmove', onTouchMove);
  return () => {
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('touchmove', onTouchMove);
  };
}, [isMobile]);

// Postprocessing FBOs
const composerFbo = useFBO({ samples: 4 });
const bloomFilterFbo = useFBO(256, 256);
const bloomLevel0H = useFBO(256, 256);
const bloomLevel0V = useFBO(256, 256);
const bloomLevel1H = useFBO(128, 128);
const bloomLevel1V = useFBO(128, 128);
const bloomLevel2H = useFBO(64, 64);
const bloomLevel2V = useFBO(64, 64);
const bloomLevel3H = useFBO(32, 32);
const bloomLevel3V = useFBO(32, 32);
const bloomLevel4H = useFBO(16, 16);
const bloomLevel4V = useFBO(16, 16);

// Bloom FBO lists for easier loop indexing
const bloomFboH = useMemo(() => [bloomLevel0H, bloomLevel1H, bloomLevel2H, bloomLevel3H, bloomLevel4H], [bloomLevel0H, bloomLevel1H, bloomLevel2H, bloomLevel3H, bloomLevel4H]);
const bloomFboV = useMemo(() => [bloomLevel0V, bloomLevel1V, bloomLevel2V, bloomLevel3V, bloomLevel4V], [bloomLevel0V, bloomLevel1V, bloomLevel2V, bloomLevel3V, bloomLevel4V]);

// Full-screen Quad and Ortho Camera for postprocessing compositor
const composerQuad = useMemo(() => {
  const geom = new THREE.PlaneGeometry(2, 2);
  const orthoCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  return { geom, orthoCam };
}, []);

useEffect(() => {
  return () => {
    composerQuad.geom.dispose();
  };
}, [composerQuad]);

// Postprocessing Materials
const bloomFilterMat = useMemo(() => {
  return new THREE.ShaderMaterial({
    uniforms: {
      t: { value: null },
      threshold: { value: 1.0 },
      width: { value: 0.25 }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform sampler2D t;
      uniform float threshold;
      uniform float width;
      void main() {
        vec3 color = texture2D(t, vUv).rgb;
        float l = dot(color, vec3(0.299, 0.587, 0.114));
        l = smoothstep(threshold - width, threshold + width, l);
        color = max(color * l, 0.0);
        gl_FragColor = vec4(color, 1.0);
      }
    `,
    depthTest: false,
    depthWrite: false
  });
}, []);

const bloomBlurMats = useMemo(() => {
  const kernels = [3, 5, 7, 9, 11];
  const sizes = [256, 128, 64, 32, 16];
  return kernels.map((k, idx) => {
    const size = sizes[idx];
    return new THREE.ShaderMaterial({
      defines: {
        KERNEL_RADIUS: k,
        SIGMA: k
      },
      uniforms: {
        t: { value: null },
        invSize: { value: new THREE.Vector2(1.0 / size, 1.0 / size) },
        direction: { value: new THREE.Vector2(1.0, 0.0) }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform sampler2D t;
        uniform vec2 invSize;
        uniform vec2 direction;

        float gaussianPdf(float x, float sigma) {
          return 0.39894 * exp(-0.5 * x * x / (sigma * sigma)) / sigma;
        }

        void main() {
          float fSigma = float(SIGMA);
          float weightSum = gaussianPdf(0.0, fSigma);
          vec3 diffuseSum = texture2D(t, vUv).rgb * weightSum;

          for (int i = 1; i < KERNEL_RADIUS; i++) {
            float x = float(i);
            float w = gaussianPdf(x, fSigma);
            vec2 uvOffset = direction * invSize * x;
            vec3 sample1 = texture2D(t, vUv + uvOffset).rgb;
            vec3 sample2 = texture2D(t, vUv - uvOffset).rgb;
            diffuseSum += (sample1 + sample2) * w;
            weightSum += w + w;
          }
          gl_FragColor = vec4(diffuseSum / weightSum, 1.0);
        }
      `,
      depthTest: false,
      depthWrite: false
    });
  });
}, []);

const composerMaterial = useMemo(() => {
  return new THREE.ShaderMaterial({
    uniforms: {
      map: { value: null },
      bloomLevel0: { value: null },
      bloomLevel1: { value: null },
      bloomLevel2: { value: null },
      bloomLevel3: { value: null },
      bloomLevel4: { value: null },
      bloomRadius: { value: 0.6667 },
      bloomPower: { value: 0.1667 },
      aspectRatio: { value: new THREE.Vector2(1, 1) },
      haloPower: { value: 0.5 },
      haloMin: { value: 0.5 },
      haloMax: { value: 0.75 },
      haloShift: { value: 0.6667 },
      haloAnaglyphWidth: { value: 12.5 },
      exposure: { value: 1.0 },
      seconds: { value: 0 },
      texelSize: { value: new THREE.Vector2(1/1024, 1/1024) }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      #define saturate(x) clamp(x, 0., 1.)
      varying vec2 vUv;
      uniform sampler2D map;
      uniform vec2 texelSize;

      uniform sampler2D bloomLevel0;
      uniform sampler2D bloomLevel1;
      uniform sampler2D bloomLevel2;
      uniform sampler2D bloomLevel3;
      uniform sampler2D bloomLevel4;
      uniform float bloomRadius;
      uniform float bloomPower;

      uniform vec2 aspectRatio;
      uniform float haloPower;
      uniform float haloMin;
      uniform float haloMax;
      uniform float haloShift;
      uniform float haloAnaglyphWidth;

      uniform float exposure;
      uniform float seconds;

      float rand(vec2 c) {
        return fract(sin(dot(fract(c), vec2(12.9898, 78.233))) * 43758.5453);
      }

      vec3 NeutralToneMapping(vec3 color) {
        const float StartCompression = 0.8 - 0.04;
        const float Desaturation = 0.15;
        color *= exposure;
        float x = min(color.r, min(color.g, color.b));
        float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
        color -= offset;
        float peak = max(color.r, max(color.g, color.b));
        if (peak < StartCompression) return color;
        float d = 1. - StartCompression;
        float newPeak = 1. - d * d / (peak + d - StartCompression);
        color *= newPeak / peak;
        float g = 1. - 1. / (Desaturation * (peak - newPeak) + 1.);
        return mix(color, vec3(newPeak), g);
      }

      vec3 LinearTosRGB(vec3 value) {
        return vec3(
          mix(
            pow(value.rgb, vec3(.41666)) * 1.055 - vec3(.055),
            value.rgb * 12.92,
            vec3(lessThanEqual(value.rgb, vec3(.0031308)))
          )
        );
      }

      void main() {
        vec2 uv = vUv;
        vec3 color = texture2D(map, uv).rgb;

        // 1. Inject Bloom
        vec3 bloom = (
          mix(1.0, 0.2, bloomRadius) * texture2D(bloomLevel0, uv).rgb +
          mix(0.8, 0.4, bloomRadius) * texture2D(bloomLevel1, uv).rgb +
          0.6 * texture2D(bloomLevel2, uv).rgb +
          mix(0.4, 0.8, bloomRadius) * texture2D(bloomLevel3, uv).rgb +
          mix(0.2, 1.0, bloomRadius) * texture2D(bloomLevel4, uv).rgb
        );
        color += bloomPower * bloom * bloom;

        // 2. Inject Halo
        {
          vec2 fromCenter = (vUv - 0.5) * aspectRatio;
          vec2 direction = normalize(fromCenter);
          vec2 st = 0.5 - fromCenter + direction * haloShift;
          vec2 anaglyph = direction * texelSize.y * haloAnaglyphWidth;
          vec3 halo = 0.25 * vec3(
            texture2D(bloomLevel2, st - anaglyph).r,
            texture2D(bloomLevel2, st).g,
            texture2D(bloomLevel2, st + anaglyph).b
          );
          halo += vec3(
            texture2D(bloomLevel4, st - anaglyph * 8.).r,
            texture2D(bloomLevel4, st).g,
            texture2D(bloomLevel4, st + anaglyph * 8.).b
          );
          color += halo * haloPower * smoothstep(haloMin, haloMax, length(fromCenter));
        }

        // 3. Tone Mapping
        color = max(color, vec3(0.0));
        color = NeutralToneMapping(color);

        // 4. Color space conversion (Linear to sRGB)
        color = LinearTosRGB(color);

        // 5. Film Grain / Noise
        float rnd = rand(vUv + fract(seconds));
        color += rnd / 256. - 1. / 512.;

        gl_FragColor = vec4(saturate(color), 1.0);
      }
    `,
    depthTest: false,
    depthWrite: false
  });
}, []);

// Sun ref and uniforms
const sunRef = useRef();
const sunUniforms = useMemo(() => ({
color: { value: new THREE.Color(1.0, 1.0, 1.0) },
amp: { value: 1.0 },
opacity: { value: 1.0 },
size: { value: 1.0 },
map: { value: null }
}), []);

useEffect(() => {
if (sunTexture) {
sunTexture.minFilter = THREE.NearestFilter;
sunTexture.magFilter = THREE.NearestFilter;
sunUniforms.map.value = sunTexture;
}
}, [sunTexture, sunUniforms]);

// Scene background color — driven by Env_background animation node (matches original exactly)
const sceneBgColor = useRef(new THREE.Color(0.769, 0.773, 0.945));

// Background meshes refs
const mountainsRef = useRef();
const fireBackRef = useRef();
const fireBackMatRef = useRef();
const spotsRef = useRef();
const spotsMatRef = useRef();
const floorMatRef = useRef();


// Create Double-Pass Glass Materials
const glassBackMat = useMemo(() => {
return new THREE.ShaderMaterial({
defines: {
samplesCount: '5',
USE_NORMAL_MAP: '',
USE_TANGENT: ''
},
uniforms: {
map: { value: null },
noiseMap: { value: null },
envMap: { value: null },
colorsMap: { value: colorsMap },
normalMap: { value: iceNormalTex },
iorStart: { value: 1.2 },
iorDelta: { value: 0.3 },
envRefraction: { value: 0.0 },
refractionIridescence: { value: 0.0 },
fringeCurve: { value: 5.0 },
fringeMix: { value: 1.0 },
fringeColor: { value: new THREE.Color(1.0, 1.0, 1.0) },
useTransmittance: { value: 1.0 },
uvShiftFactor: { value: 1.0 },
seconds: { value: 0 },
convexityFactor: { value: 1.0 },
concavityFactor: { value: 1.0 },
distancesFactor: { value: 1.0 },
resetDistances: { value: 0.0 },
projectionMatrix: { value: new THREE.Matrix4() },
viewMatrix: { value: new THREE.Matrix4() },
},
vertexShader: glassBackVertexShader,
fragmentShader: glassBackFragmentShader,
side: THREE.BackSide,
transparent: false,
depthTest: false,
depthWrite: false
});
}, [iceNormalTex]);

const glassFrontMat = useMemo(() => {
return new THREE.ShaderMaterial({
defines: {
samplesCount: '12',
USE_NORMAL_MAP: '',
USE_TANGENT: ''
},
uniforms: {
map: { value: null },
noiseMap: { value: null },
envMap: { value: null },
colorsMap: { value: colorsMap },
normalMap: { value: iceNormalTex },
iorStart: { value: 1.2 },
iorDelta: { value: 0.3 },
envReflection: { value: 1.0 },
refractionIridescence: { value: 0.0 },
reflectionIridescence: { value: 0.0 },
colorBoost: { value: 2.0 },
colorFactor: { value: 2.0 },
decayFactor: { value: 20.0 },
maxColorValue: { value: 25.0 },
useTransmittance: { value: 1.0 },
fringeCurve: { value: 5.0 },
fringeMix: { value: 1.0 },
fringeColor: { value: new THREE.Color(1.0, 1.0, 1.0) },
colorCurve: { value: 1.5 },
colorCurveR: { value: 1.0 },
colorCurveG: { value: 1.0 },
colorCurveB: { value: 1.0 },
uvShiftFactor: { value: 1.0 },
seconds: { value: 0 },
convexityFactor: { value: 1.0 },
concavityFactor: { value: 1.0 },
distancesFactor: { value: 1.0 },
resetDistances: { value: 0.0 },
baseColor: { value: new THREE.Color(1.0, 1.0, 1.0) },
peaksColor: { value: new THREE.Color(1.0, 1.0, 1.0) },
peaksFactor: { value: 1.0 },
projectionMatrix: { value: new THREE.Matrix4() },
viewMatrix: { value: new THREE.Matrix4() },
},
vertexShader: glassFrontVertexShader,
fragmentShader: glassFrontFragmentShader,
side: THREE.FrontSide,
transparent: false,
depthTest: true,
depthWrite: true
});
}, [iceNormalTex]);

const birdGlassBackMat = useMemo(() => {
return new THREE.ShaderMaterial({
defines: {
samplesCount: '5',
USE_NORMAL_MAP: '',
skinning: true,
USE_TANGENT: ''
},
uniforms: {
map: { value: null },
noiseMap: { value: null },
envMap: { value: null },
colorsMap: { value: colorsMap },
normalMap: { value: iceNormalTex },
iorStart: { value: 1.2 },
iorDelta: { value: 0.3 },
envRefraction: { value: 0.0 },
refractionIridescence: { value: 0.0 },
fringeCurve: { value: 5.0 },
fringeMix: { value: 1.0 },
fringeColor: { value: new THREE.Color(1.0, 1.0, 1.0) },
useTransmittance: { value: 1.0 },
uvShiftFactor: { value: 1.0 },
seconds: { value: 0 },
convexityFactor: { value: 1.0 },
concavityFactor: { value: 1.0 },
distancesFactor: { value: 1.0 },
resetDistances: { value: 0.0 },
projectionMatrix: { value: new THREE.Matrix4() },
viewMatrix: { value: new THREE.Matrix4() },
},
vertexShader: glassBackVertexShader,
fragmentShader: glassBackFragmentShader,
side: THREE.BackSide,
transparent: false,
depthTest: false,
depthWrite: false
});
}, [iceNormalTex]);

const birdGlassFrontMat = useMemo(() => {
return new THREE.ShaderMaterial({
defines: {
samplesCount: '12',
USE_NORMAL_MAP: '',
skinning: true,
USE_TANGENT: ''
},
uniforms: {
map: { value: null },
noiseMap: { value: null },
envMap: { value: null },
colorsMap: { value: colorsMap },
normalMap: { value: iceNormalTex },
iorStart: { value: 1.2 },
iorDelta: { value: 0.3 },
envReflection: { value: 1.0 },
refractionIridescence: { value: 0.0 },
reflectionIridescence: { value: 0.0 },
colorBoost: { value: 2.0 },
colorFactor: { value: 2.0 },
decayFactor: { value: 20.0 },
maxColorValue: { value: 25.0 },
useTransmittance: { value: 1.0 },
fringeCurve: { value: 5.0 },
fringeMix: { value: 1.0 },
fringeColor: { value: new THREE.Color(1.0, 1.0, 1.0) },
colorCurve: { value: 1.5 },
colorCurveR: { value: 1.0 },
colorCurveG: { value: 1.0 },
colorCurveB: { value: 1.0 },
uvShiftFactor: { value: 1.0 },
seconds: { value: 0 },
convexityFactor: { value: 1.0 },
concavityFactor: { value: 1.0 },
distancesFactor: { value: 1.0 },
resetDistances: { value: 0.0 },
baseColor: { value: new THREE.Color(1.0, 1.0, 1.0) },
peaksColor: { value: new THREE.Color(1.0, 1.0, 1.0) },
peaksFactor: { value: 1.0 },
projectionMatrix: { value: new THREE.Matrix4() },
viewMatrix: { value: new THREE.Matrix4() },
},
    vertexShader: glassFrontVertexShader.replace('if (peaks == 0.0) peaks = 0.5;', ''),
    fragmentShader: glassFrontFragmentShader,
side: THREE.FrontSide,
transparent: false,
depthTest: true,
depthWrite: true
});
}, [iceNormalTex]);

// Process bird scene graph: assign single-pass glass material to all bird meshes
const birdScene = useMemo(() => {
  if (!birdGLTF) return null;

  console.log("Experience.jsx: Cloning and processing bird scene graph...");
  const clonedScene = SkeletonUtils.clone(birdGLTF.scene);

  // Rename geometry attributes to lowercase so custom shaders can find them
  clonedScene.traverse((child) => {
    if (child.isMesh && child.geometry) {
      const geom = child.geometry;
      const uppercaseAttrs = ['_DIST', '_THICKNESS', '_PEAKS', '_CONVEXITY', '_CONCAVITY'];
      uppercaseAttrs.forEach(upperName => {
        if (geom.attributes[upperName]) {
          const lowerName = upperName.toLowerCase();
          geom.setAttribute(lowerName, geom.attributes[upperName]);
        }
      });

      if (!geom.attributes.tangent) {
        geom.computeTangents();
      }
    }

    if (child.isBone && child.name === 'b_neck') {
      neckBoneRef.current = child;
      neckBoneRotationRef.current.copy(child.rotation);
      neckBoneLastRotationRef.current.copy(child.rotation);
      console.log("Experience.jsx: Found b_neck bone inside birdScene!");
    }
  });

  // Collect meshes to duplicate to avoid modifying the scene graph during traversal
  const meshesToDuplicate = [];
  clonedScene.traverse((child) => {
    if (child.isMesh) {
      if (child.name === 'trail') {
        child.visible = false;
      } else {
        meshesToDuplicate.push(child);
      }
    }
  });

  // Duplicate each mesh into front and back passes
  meshesToDuplicate.forEach((child) => {
    const frontName = child.name + '-front';
    child.name = frontName;
    child.material = birdGlassFrontMat;
    child.renderOrder = 2; // Render front-pass second

    // Clone child to create back mesh
    const backMesh = child.clone();
    backMesh.name = child.name.replace('-front', '-back');
    backMesh.material = birdGlassBackMat;
    backMesh.renderOrder = 1; // Render back-pass first

    // Bind skeleton if SkinnedMesh
    if (child.isSkinnedMesh) {
      backMesh.bind(child.skeleton, child.bindMatrix);
    }

    // Add back mesh to the same parent
    const parent = child.parent;
    parent.add(backMesh);
    
    // Ensure backMesh is placed BEFORE child in the children array for correct render ordering
    const index = parent.children.indexOf(child);
    const backIndex = parent.children.indexOf(backMesh);
    if (index !== -1 && backIndex !== -1) {
      parent.children.splice(backIndex, 1); // Remove from end
      parent.children.splice(index, 0, backMesh); // Insert before child
    }
  });

  return clonedScene;
}, [birdGLTF, birdGlassFrontMat, birdGlassBackMat]);

const featherScene = useMemo(() => {
  if (!featherGLTF) return null;

  console.log("Experience.jsx: Cloning and processing feather scene graph...");
  const clonedScene = SkeletonUtils.clone(featherGLTF.scene);

  // Rename geometry attributes to lowercase so custom shaders can find them
  clonedScene.traverse((child) => {
    if (child.isMesh && child.geometry) {
      const geom = child.geometry;
      const uppercaseAttrs = ['_DIST', '_THICKNESS', '_PEAKS', '_CONVEXITY', '_CONCAVITY'];
      uppercaseAttrs.forEach(upperName => {
        if (geom.attributes[upperName]) {
          const lowerName = upperName.toLowerCase();
          geom.setAttribute(lowerName, geom.attributes[upperName]);
        }
      });

      if (!geom.attributes.tangent) {
        geom.computeTangents();
      }
    }
  });

  const meshesToDuplicate = [];
  clonedScene.traverse((child) => {
    if (child.isMesh) {
      meshesToDuplicate.push(child);
    }
  });

  meshesToDuplicate.forEach((child) => {
    const frontName = child.name + '-front';
    child.name = frontName;
    child.material = glassFrontMat;

    const backMesh = child.clone();
    backMesh.name = child.name.replace('-front', '-back');
    backMesh.material = glassBackMat;

    child.parent.add(backMesh);
  });

  return clonedScene;
}, [featherGLTF, glassFrontMat, glassBackMat]);




// Track if bird materials have been modified to prevent multiple duplicates
const birdMaterialReplacedRef = useRef(false);

useEffect(() => {
window.THREE = THREE;
window.__experience = {
scene,
camera,
paramNodes: paramNodes.current,
mixerDev: mixerDev.current,
actionsDev: actionsDev.current
};
if (envMapTexture) {
  scene.environment = envMapTexture;
}
return () => {
delete window.THREE;
delete window.__experience;
};
}, [scene, camera, envMapTexture]);

// Initialize Spots matrices and colors on Fibonacci Sphere
useEffect(() => {
if (!spotsRef.current) return;

const count = 32;
const radius = 50;
const tempPosition = new THREE.Vector3();
const tempRotation = new THREE.Quaternion();
const tempScale = new THREE.Vector3(1, 1, 1);
const tempMatrix = new THREE.Matrix4();

const colors = [
new THREE.Color(0xd0c3d0),
new THREE.Color(0xaf9ec8),
new THREE.Color(0xadccf2),
new THREE.Color(0xd6e7ff),
new THREE.Color(0xd7fab8),
new THREE.Color(0xfbc000),
new THREE.Color(0xe5d5cf),
];

const angleIncrement = Math.PI * (3 - Math.sqrt(5));

for (let i = 0; i < count; i++) {
const t = i / (count - 1);
const inclination = Math.acos(1 - 2 * t);
const azimuth = angleIncrement * i;

tempPosition.set(
Math.sin(inclination) * Math.cos(azimuth) * radius,
Math.cos(inclination) * radius,
Math.sin(inclination) * Math.sin(azimuth) * radius
);

const lookTarget = new THREE.Vector3(0, 0, 0);
const matrix = new THREE.Matrix4().lookAt(tempPosition, lookTarget, new THREE.Vector3(0, 1, 0));
tempRotation.setFromRotationMatrix(matrix);

tempMatrix.compose(tempPosition, tempRotation, tempScale);
spotsRef.current.setMatrixAt(i, tempMatrix);

const color = colors[Math.floor(Math.random() * colors.length)];
spotsRef.current.setColorAt(i, color);
}

spotsRef.current.instanceMatrix.needsUpdate = true;
spotsRef.current.instanceColor.needsUpdate = true;
}, []);

useEffect(() => {
mixerCam.current = new THREE.AnimationMixer(timelineGLTF.scene);
actionsCam.current = [];
timelineGLTF.animations.forEach((clip) => {
const action = mixerCam.current.clipAction(clip);
action.enabled = true;
action.play();
actionsCam.current.push(action);
durCam.current = Math.max(durCam.current, clip.duration);
});

mixerDev.current = new THREE.AnimationMixer(devGLTF.scene);
if (birdGLTF && birdScene) {
  birdMixer.current = new THREE.AnimationMixer(birdScene);
  birdGLTF.animations.forEach((clip) => {
    birdActions.current[clip.name] = birdMixer.current.clipAction(clip);
  });
  const idleAction = birdActions.current['Idle_MainPose_flying'] || birdActions.current[Object.keys(birdActions.current)[0]];
  if (idleAction) idleAction.play();
}

actionsDev.current = [];
devGLTF.animations.forEach((clip) => {
const action = mixerDev.current.clipAction(clip);
action.enabled = true;
action.play();
actionsDev.current.push(action);
durDev.current = Math.max(durDev.current, clip.duration);
});

const names = [
'isBurning',
'Water_color',
'Water_opacity',
'Water_emissionXWhitenessType',
'Fire_opacity',
'Glass_color',
'Glass_peaksColor',
'Glass_fringeColor',
'Glass_fringeCurveMix',
'Glass_convexConcavePeaks',
'Sun_sizeAmp',
'Glass_iorVDeltaXshift',
'FireBack_opacity',
'Env_darkness',
'Glass_distResetX',
'Glass_reflectionVIri',
'Glass_refractionVIri',
'Glass_colorMaxvalDecayUsetransmittance',
'Glass_colorCurveRGB',
'Glass_colorBoostFactorCurve',
'Env_background',
'Camera_pointerInfluence',
'isFollowing',
'Post_halo',
'Post_haloMinMaxShift'
];
names.forEach(name => {
paramNodes.current[name] = devGLTF.scene.getObjectByName(name);
});



return () => {
if (mixerCam.current) mixerCam.current.stopAllAction();
if (birdMixer.current) birdMixer.current.stopAllAction();
if (mixerDev.current) mixerDev.current.stopAllAction();
};
}, [timelineGLTF, devGLTF, glassBackMat, glassFrontMat, birdGlassBackMat, birdGlassFrontMat, birdScene]);

// Bind scroll progress to virtual lerp scroll (App.jsx drives via RAF)
// App.jsx sets --scroll-progress (0→1) directly, just read it
useEffect(() => {
if (!experienceStarted) return;
let raf;
const update = () => {
const prog = parseFloat(document.documentElement.style.getPropertyValue('--scroll-progress') || '0');
scrollProgress.current = Math.max(0, Math.min(prog, 1));
raf = requestAnimationFrame(update);
};
raf = requestAnimationFrame(update);
return () => cancelAnimationFrame(raf);
}, [experienceStarted]);

// Render loop
useFrame((state, delta) => {
if (birdMixer.current) birdMixer.current.update(delta);
if (!mixerCam.current || !mixerDev.current) return;

// Seek animations to current scroll position using section-by-section mapping
const targetTime = getTimelineTime(scrollProgress.current, isMobile);

if (state.clock.getElapsedTime() * 60 % 120 < 1) {

}

mixerCam.current.setTime(Math.min(targetTime, durCam.current));
mixerDev.current.setTime(Math.min(targetTime, durDev.current));

timelineGLTF.scene.updateMatrixWorld(true);
devGLTF.scene.updateMatrixWorld(true);

// Read animation states from dev timeline
const isBurningNode  = paramNodes.current['isBurning'];
const waterColorNode = paramNodes.current['Water_color'];
const glassColorNode = paramNodes.current['Glass_color'];
const sunSizeAmpNode = paramNodes.current['Sun_sizeAmp'];
const sunOpacityNode = timelineGLTF.scene.getObjectByName('Sun_opacity');
const fireBackOpacityNode = paramNodes.current['FireBack_opacity'];
const envDarknessNode = paramNodes.current['Env_darkness'];

// Retrieve parameter timeline nodes
const distResetNode = paramNodes.current['Glass_distResetX'];
const iorDeltaNode = paramNodes.current['Glass_iorVDeltaXshift'];
const reflectionIriNode = paramNodes.current['Glass_reflectionVIri'];
const refractionIriNode = paramNodes.current['Glass_refractionVIri'];
const colorMaxvalDecayNode = paramNodes.current['Glass_colorMaxvalDecayUsetransmittance'];
const colorCurveRGBNode = paramNodes.current['Glass_colorCurveRGB'];
const colorBoostFactorNode = paramNodes.current['Glass_colorBoostFactorCurve'];
const fringeCurveMixNode = paramNodes.current['Glass_fringeCurveMix'];
const convexConcavePeaksNode = paramNodes.current['Glass_convexConcavePeaks'];
const waterEmissionNode = paramNodes.current['Water_emissionXWhitenessType'];

// Update global state refs for background shaders
if (isBurningRef)   isBurningRef.current = isBurningNode ? isBurningNode.position.x : 0;
if (sunOpacityRef)  sunOpacityRef.current = sunOpacityNode ? sunOpacityNode.position.x : 1;
if (fireBackOpacityRef) fireBackOpacityRef.current = fireBackOpacityNode ? fireBackOpacityNode.position.x : 0;
if (envDarknessNode) envDarknessRef.current = envDarknessNode.position.x;

const glassPeaksColorNode = paramNodes.current['Glass_peaksColor'];
const glassFringeColorNode = paramNodes.current['Glass_fringeColor'];

if (waterColorNode) {
waterColorRef.current.setRGB(waterColorNode.position.x / 255.0, waterColorNode.position.y / 255.0, waterColorNode.position.z / 255.0);
}
if (glassColorNode) {
glassColorRef.current.setRGB(glassColorNode.position.x / 255.0, glassColorNode.position.y / 255.0, glassColorNode.position.z / 255.0);
}
if (glassPeaksColorNode) {
glassPeaksColorRef.current.setRGB(glassPeaksColorNode.position.x / 255.0, glassPeaksColorNode.position.y / 255.0, glassPeaksColorNode.position.z / 255.0);
}
if (glassFringeColorNode) {
glassFringeColorRef.current.setRGB(glassFringeColorNode.position.x / 255.0, glassFringeColorNode.position.y / 255.0, glassFringeColorNode.position.z / 255.0);
}

if (sunSizeAmpNode) {
sunSizeAmpRef.current.set(sunSizeAmpNode.position.x, sunSizeAmpNode.position.y);
}

const isBurningVal = isBurningRef.current;
const darknessVal = envDarknessRef.current;

// Extract precise glass uniforms from dev timeline
const resetDistVal = distResetNode ? distResetNode.position.x : 0.0;
const distFactorVal = distResetNode ? distResetNode.position.y : 1.0;

const iorStartVal = iorDeltaNode ? iorDeltaNode.position.x : 1.2;
const iorDeltaVal = iorDeltaNode ? iorDeltaNode.position.y : 0.3;
const uvShiftVal  = iorDeltaNode ? iorDeltaNode.position.z : 1.0;

const envReflectionVal = reflectionIriNode ? reflectionIriNode.position.x : 1.0;
const reflectionIriVal = reflectionIriNode ? reflectionIriNode.position.y : 0.0;

const envRefractionVal = refractionIriNode ? refractionIriNode.position.x : 0.0;
const refractionIriVal = refractionIriNode ? refractionIriNode.position.y : 0.0;

const maxColorVal = colorMaxvalDecayNode ? colorMaxvalDecayNode.position.x : 25.0;
const decayFactorVal = colorMaxvalDecayNode ? colorMaxvalDecayNode.position.y : 20.0;
const useTransmittanceVal = colorMaxvalDecayNode ? colorMaxvalDecayNode.position.z : 1.0;

const colorBoostVal  = colorBoostFactorNode ? colorBoostFactorNode.position.x : 1.0;
const colorFactorVal = colorBoostFactorNode ? colorBoostFactorNode.position.y : 1.0;
const colorCurveVal  = colorBoostFactorNode ? colorBoostFactorNode.position.z : 1.0;

const colorCurveRVal = colorCurveRGBNode ? colorCurveRGBNode.position.x : 1.0;
const colorCurveGVal = colorCurveRGBNode ? colorCurveRGBNode.position.y : 1.0;
const colorCurveBVal = colorCurveRGBNode ? colorCurveRGBNode.position.z : 1.0;

const fringeCurveVal = fringeCurveMixNode ? fringeCurveMixNode.position.x : 5.0;
const fringeMixVal   = fringeCurveMixNode ? fringeCurveMixNode.position.y : 1.0;

const convexityFactorVal = convexConcavePeaksNode ? convexConcavePeaksNode.position.x : 1.0;
const concavityFactorVal = convexConcavePeaksNode ? convexConcavePeaksNode.position.y : 1.0;
const peaksFactorVal     = convexConcavePeaksNode ? convexConcavePeaksNode.position.z : 1.0;

// Update glass back shader uniforms
glassBackMat.uniforms.projectionMatrix.value.copy(camera.projectionMatrix);
glassBackMat.uniforms.viewMatrix.value.copy(camera.matrixWorldInverse);
glassBackMat.uniforms.map.value = fbo.texture;
glassBackMat.uniforms.noiseMap.value = noiseTexture;
glassBackMat.uniforms.envMap.value = envMapTexture;
glassBackMat.uniforms.iorStart.value = iorStartVal;
glassBackMat.uniforms.iorDelta.value = iorDeltaVal;
glassBackMat.uniforms.envRefraction.value = envRefractionVal;
glassBackMat.uniforms.refractionIridescence.value = refractionIriVal;
glassBackMat.uniforms.fringeColor.value.copy(glassFringeColorRef.current);
glassBackMat.uniforms.useTransmittance.value = useTransmittanceVal;
glassBackMat.uniforms.uvShiftFactor.value = uvShiftVal;
glassBackMat.uniforms.resetDistances.value = resetDistVal;
glassBackMat.uniforms.distancesFactor.value = distFactorVal;
glassBackMat.uniforms.fringeCurve.value = fringeCurveVal;
glassBackMat.uniforms.fringeMix.value = fringeMixVal;
glassBackMat.uniforms.convexityFactor.value = convexityFactorVal;
glassBackMat.uniforms.concavityFactor.value = concavityFactorVal;
glassBackMat.uniforms.seconds.value = state.clock.getElapsedTime();

// Update bird glass back shader uniforms
birdGlassBackMat.uniforms.projectionMatrix.value.copy(camera.projectionMatrix);
birdGlassBackMat.uniforms.viewMatrix.value.copy(camera.matrixWorldInverse);
birdGlassBackMat.uniforms.map.value = fbo.texture;
birdGlassBackMat.uniforms.noiseMap.value = noiseTexture;
birdGlassBackMat.uniforms.envMap.value = envMapTexture;
birdGlassBackMat.uniforms.iorStart.value = iorStartVal;
birdGlassBackMat.uniforms.iorDelta.value = iorDeltaVal;
birdGlassBackMat.uniforms.envRefraction.value = envRefractionVal;
birdGlassBackMat.uniforms.refractionIridescence.value = refractionIriVal;
birdGlassBackMat.uniforms.fringeColor.value.copy(glassFringeColorRef.current);
birdGlassBackMat.uniforms.useTransmittance.value = useTransmittanceVal;
birdGlassBackMat.uniforms.uvShiftFactor.value = uvShiftVal;
birdGlassBackMat.uniforms.resetDistances.value = resetDistVal;
birdGlassBackMat.uniforms.distancesFactor.value = distFactorVal;
birdGlassBackMat.uniforms.fringeCurve.value = fringeCurveVal;
birdGlassBackMat.uniforms.fringeMix.value = fringeMixVal;
birdGlassBackMat.uniforms.convexityFactor.value = convexityFactorVal;
birdGlassBackMat.uniforms.concavityFactor.value = concavityFactorVal;
birdGlassBackMat.uniforms.seconds.value = state.clock.getElapsedTime();

// Update glass front shader uniforms
glassFrontMat.uniforms.projectionMatrix.value.copy(camera.projectionMatrix);
glassFrontMat.uniforms.viewMatrix.value.copy(camera.matrixWorldInverse);
glassFrontMat.uniforms.map.value = backFbo.texture;
glassFrontMat.uniforms.noiseMap.value = noiseTexture;
glassFrontMat.uniforms.envMap.value = envMapTexture;
glassFrontMat.uniforms.iorStart.value = iorStartVal;
glassFrontMat.uniforms.iorDelta.value = iorDeltaVal;
glassFrontMat.uniforms.envReflection.value = envReflectionVal;
glassFrontMat.uniforms.refractionIridescence.value = refractionIriVal;
glassFrontMat.uniforms.reflectionIridescence.value = reflectionIriVal;
glassFrontMat.uniforms.colorBoost.value = colorBoostVal;
glassFrontMat.uniforms.colorFactor.value = colorFactorVal;
glassFrontMat.uniforms.decayFactor.value = decayFactorVal;
glassFrontMat.uniforms.maxColorValue.value = maxColorVal;
glassFrontMat.uniforms.useTransmittance.value = useTransmittanceVal;
glassFrontMat.uniforms.fringeColor.value.copy(glassFringeColorRef.current);
glassFrontMat.uniforms.colorCurve.value = colorCurveVal;
glassFrontMat.uniforms.colorCurveR.value = colorCurveRVal;
glassFrontMat.uniforms.colorCurveG.value = colorCurveGVal;
glassFrontMat.uniforms.colorCurveB.value = colorCurveBVal;
glassFrontMat.uniforms.uvShiftFactor.value = uvShiftVal;
glassFrontMat.uniforms.resetDistances.value = resetDistVal;
glassFrontMat.uniforms.distancesFactor.value = distFactorVal;
glassFrontMat.uniforms.fringeCurve.value = fringeCurveVal;
glassFrontMat.uniforms.fringeMix.value = fringeMixVal;
glassFrontMat.uniforms.peaksFactor.value = peaksFactorVal;
glassFrontMat.uniforms.seconds.value = state.clock.getElapsedTime();
glassFrontMat.uniforms.baseColor.value.copy(glassColorRef.current);
glassFrontMat.uniforms.peaksColor.value.copy(glassPeaksColorRef.current);

// Update bird glass front shader uniforms
birdGlassFrontMat.uniforms.projectionMatrix.value.copy(camera.projectionMatrix);
birdGlassFrontMat.uniforms.viewMatrix.value.copy(camera.matrixWorldInverse);
birdGlassFrontMat.uniforms.map.value = backFbo.texture;
birdGlassFrontMat.uniforms.noiseMap.value = noiseTexture;
birdGlassFrontMat.uniforms.envMap.value = envMapTexture;
birdGlassFrontMat.uniforms.iorStart.value = iorStartVal;
birdGlassFrontMat.uniforms.iorDelta.value = iorDeltaVal;
birdGlassFrontMat.uniforms.envReflection.value = envReflectionVal;
birdGlassFrontMat.uniforms.refractionIridescence.value = refractionIriVal;
birdGlassFrontMat.uniforms.reflectionIridescence.value = reflectionIriVal;
birdGlassFrontMat.uniforms.colorBoost.value = colorBoostVal;

birdGlassFrontMat.uniforms.colorFactor.value = colorFactorVal;
birdGlassFrontMat.uniforms.decayFactor.value = decayFactorVal;
birdGlassFrontMat.uniforms.maxColorValue.value = maxColorVal;
birdGlassFrontMat.uniforms.useTransmittance.value = useTransmittanceVal;
birdGlassFrontMat.uniforms.fringeColor.value.copy(glassFringeColorRef.current);
birdGlassFrontMat.uniforms.colorCurve.value = colorCurveVal;
birdGlassFrontMat.uniforms.colorCurveR.value = colorCurveRVal;
birdGlassFrontMat.uniforms.colorCurveG.value = colorCurveGVal;
birdGlassFrontMat.uniforms.colorCurveB.value = colorCurveBVal;
birdGlassFrontMat.uniforms.uvShiftFactor.value = uvShiftVal;
birdGlassFrontMat.uniforms.resetDistances.value = resetDistVal;
birdGlassFrontMat.uniforms.distancesFactor.value = distFactorVal;
birdGlassFrontMat.uniforms.fringeCurve.value = fringeCurveVal;
birdGlassFrontMat.uniforms.fringeMix.value = fringeMixVal;
birdGlassFrontMat.uniforms.peaksFactor.value = peaksFactorVal;
birdGlassFrontMat.uniforms.seconds.value = state.clock.getElapsedTime();
birdGlassFrontMat.uniforms.baseColor.value.copy(glassColorRef.current);
birdGlassFrontMat.uniforms.peaksColor.value.copy(glassPeaksColorRef.current);

// Update Spots darkness uniform
if (spotsMatRef.current) {
spotsMatRef.current.uniforms.uDarkness.value = darknessVal;
}

// Update FireBack opacity uniform
if (fireBackMatRef.current) {
fireBackMatRef.current.uniforms.opacity.value = fireBackOpacityRef.current;
}

// Update floor material dynamically from dev timeline
if (floorMatRef.current && floorMatRef.current.material) {
  const mat = floorMatRef.current.material;
  const waterOpacityNode = paramNodes.current['Water_opacity'];
  if (waterOpacityNode && mat.uniforms && mat.uniforms.opacity) {
    mat.uniforms.opacity.value = waterOpacityNode.position.x;
  }
}

// Update bird mixer manually BEFORE we override the neck bone


// Smooth mouse parallax (using global mouseTarget instead of state.pointer which is blocked by CSS pointer-events: none)
mouseParallax.current.x = THREE.MathUtils.lerp(mouseParallax.current.x, mouseTarget.current.x, 0.05);
mouseParallax.current.y = THREE.MathUtils.lerp(mouseParallax.current.y, mouseTarget.current.y, 0.05);

// Update transition progress
if (isTransitioning && clickedCaseIndex !== -1) {
transitionProgress.current = THREE.MathUtils.lerp(transitionProgress.current, 1.0, 0.05);
} else {
transitionProgress.current = THREE.MathUtils.lerp(transitionProgress.current, 0.0, 0.05);
}

// Copy camera coordinates using spherical orbital parallax relative to target
const timelineCam = timelineGLTF.scene.getObjectByName('Camera');
const timelineTarget = timelineGLTF.scene.getObjectByName('Target');
if (timelineCam && timelineTarget) {
const camPos = timelineCam.position.clone();
const targetPos = timelineTarget.position.clone();

// Vector from target to camera position
const offsetVec = new THREE.Vector3().subVectors(camPos, targetPos);

// Convert to spherical coordinates
const spherical = new THREE.Spherical().setFromVector3(offsetVec);

// Get pointer influence from dev timeline
const pointerInfluenceNode = paramNodes.current['Camera_pointerInfluence'];
const pointerInfluence = pointerInfluenceNode ? pointerInfluenceNode.position.x : 5.0;

// Convert pointer offset to angles (radians)
const sX = (mouseParallax.current.x / 180.0) * Math.PI;
const sY = (mouseParallax.current.y / 180.0) * Math.PI;

const t = transitionProgress.current;
const influence = pointerInfluence * (1.0 - t);

spherical.theta += sX * influence;
spherical.phi = Math.max(0.01, Math.min(Math.PI - 0.01, spherical.phi - sY * influence));

// Compute base camera and target positions with mouse parallax
const baseCamPos = new THREE.Vector3().setFromSpherical(spherical).add(targetPos);
const baseTargetPos = targetPos.clone();

let finalCamPos = baseCamPos.clone();
let finalTargetPos = baseTargetPos.clone();

if (clickedCaseIndex !== -1) {
const selectedNode = timelineGLTF.scene.getObjectByName(`project${clickedCaseIndex}`);
if (selectedNode) {
const crystalPos = selectedNode.position.clone();

// Destination camera position: look at the crystal, placed 2.0 units back
const dir = new THREE.Vector3().subVectors(crystalPos, camPos).normalize();
const targetCamPos = crystalPos.clone().sub(dir.multiplyScalar(2.0));

// Lerp between base timeline camera/target and clicked camera/target
finalCamPos.lerp(targetCamPos, t);
finalTargetPos.lerp(crystalPos, t);
}
}

camera.position.copy(finalCamPos);
camera.lookAt(finalTargetPos);

camera.fov = THREE.MathUtils.lerp(25, 15, t);
camera.updateProjectionMatrix();
}

// Position bird model using dummy Phoenix transform
const dummyPhoenix = timelineGLTF.scene.getObjectByName('Phoenix');
if (dummyPhoenix && birdRef.current) {
  dummyPhoenix.getWorldPosition(birdRef.current.position);
  dummyPhoenix.getWorldQuaternion(birdRef.current.quaternion);
  dummyPhoenix.getWorldScale(birdRef.current.scale);
  dummyPhoenix.visible = false;
}

// Update neck bone mouse tracking (on the REAL bird!)
const neckBone = birdScene ? birdScene.getObjectByName('DEF-neck02') : null;
if (neckBone) {
  const eps = 0.0001;
  const rotationChanged = 
    Math.abs(neckBone.rotation.x - neckBoneLastRotationRef.current.x) > eps ||
    Math.abs(neckBone.rotation.y - neckBoneLastRotationRef.current.y) > eps ||
    Math.abs(neckBone.rotation.z - neckBoneLastRotationRef.current.z) > eps;

  if (rotationChanged) {
    neckBoneRotationRef.current.copy(neckBone.rotation);
  }

  const isFollowingNode = paramNodes.current['isFollowing'];
  const isFollowing = isFollowingNode ? isFollowingNode.position.x : 0.0;

  if (isFollowing > 0) {
    const rotationX = mouseParallax.current.y * 0.5 - Math.PI;
    const rotationY = Math.PI * 0.25 - mouseParallax.current.x * 0.5;

    const lerp = (a, b, val) => a + (b - a) * val;
    neckBone.rotation.x = lerp(neckBoneRotationRef.current.x, rotationX, isFollowing);
    neckBone.rotation.y = lerp(neckBoneRotationRef.current.y, rotationY, isFollowing);

    neckBoneLastRotationRef.current.copy(neckBone.rotation);
  }
}

// Position feather
const featherNode = timelineGLTF.scene.getObjectByName('Feather');
const featherModel = scene.getObjectByName('FeatherModel');
if (featherNode && featherModel) {
featherModel.position.copy(featherNode.position);
featherModel.rotation.copy(featherNode.rotation);
featherModel.position.y += Math.sin(state.clock.getElapsedTime() * 2) * 0.05;
}

// Bind Mountains, Floor, and FireBack height to timeline "Floor" height
const floorNode = timelineGLTF.scene.getObjectByName('Floor');
if (floorNode) {
const floorY = floorNode.position.y;

const floorModel = scene.getObjectByName('FloorModel');
if (floorModel) {
floorModel.position.set(camera.position.x, floorY, camera.position.z);
}

if (mountainsRef.current) {
mountainsRef.current.position.set(camera.position.x, floorY + 6.25, camera.position.z);
}

if (fireBackRef.current) {
fireBackRef.current.position.set(camera.position.x, floorY, camera.position.z);
}
}

// Move Spots mesh to center around camera, and spin slowly
if (spotsRef.current) {
spotsRef.current.position.copy(camera.position);
spotsRef.current.rotation.y += 0.015 * delta;
spotsRef.current.rotation.x += 0.008 * delta;
}

// Animate floor texture repeat
waveTexture.offset.y -= 0.04 * delta;
waveTexture.offset.x += 0.015 * delta;

// Read Env_background node from dev timeline and apply as scene background color
// This matches the original site exactly: renderer clear color = Env_background.position (RGB 0-255)
const envBgNode = paramNodes.current['Env_background'];
if (envBgNode) {
  sceneBgColor.current.setRGB(
    envBgNode.position.x / 255.0,
    envBgNode.position.y / 255.0,
    envBgNode.position.z / 255.0
  );
} else {
  sceneBgColor.current.setRGB(196 / 255.0, 197 / 255.0, 241 / 255.0);
}

const targetProgress = hoveredCaseRef.current !== -1 ? 1.0 : 0.0;
bgHoverProgressRef.current += (targetProgress - bgHoverProgressRef.current) * 0.08;

const baseBgColor = new THREE.Color()
.copy(sceneBgColor.current)
.lerp(activeHoverColorRef.current, bgHoverProgressRef.current);

const transitionColor = new THREE.Color(0, 0, 0);
const finalBgColor = new THREE.Color().lerpColors(baseBgColor, transitionColor, transitionProgress.current);

// Apply as scene background (rendered as clear color — matches original renderer.setClearColor approach)
scene.background = finalBgColor;

// Position and scale sun mesh
const sunNode = timelineGLTF.scene.getObjectByName('Sun');
if (sunNode && sunRef.current) {
sunRef.current.position.copy(sunNode.position);
sunRef.current.lookAt(camera.position);
sunRef.current.rotation.z = state.clock.getElapsedTime() * (1 / (6 * Math.PI));

const pulse = 1 + Math.sin(state.clock.getElapsedTime() * (Math.PI * 2 / 11)) * 0.05;
const sizeParam = sunSizeAmpRef.current.x; // Sun_sizeAmp.x

sunRef.current.scale.copy(sunNode.scale).multiplyScalar(pulse);

sunUniforms.size.value = sizeParam;
sunUniforms.amp.value = sunSizeAmpRef.current.y; // Sun_sizeAmp.y
sunUniforms.opacity.value = THREE.MathUtils.lerp(sunOpacityRef.current, 0.1, bgHoverProgressRef.current);
}

if (birdRef.current) {
  birdRef.current.updateMatrixWorld(true);
}
const fModel = scene.getObjectByName('FeatherModel');
if (fModel) {
  fModel.updateMatrixWorld(true);
}

// ─── FBO DOUBLE PASS RENDER PIPELINE ──────────────────────────────────

// Gather all front, back, logo, and background meshes
const frontMeshes = [];
const backMeshes = [];
const logoMeshes = [];
const bgMeshes = [
  mountainsRef.current,
  sunRef.current,
  spotsRef.current,
  fireBackRef.current,
  floorMatRef.current
].filter(Boolean);

scene.traverse((child) => {
  if (child.isMesh || child.isSkinnedMesh) {
    if (child.name) {
      if (child.name.endsWith('-front')) {
        frontMeshes.push(child);
      } else if (child.name.endsWith('-back')) {
        backMeshes.push(child);
      } else if (child.name.endsWith('-logo')) {
        logoMeshes.push(child);
      }
    }
  }
});

// Save original renderer state
const oldClearColor = new THREE.Color();
state.gl.getClearColor(oldClearColor);
const oldClearAlpha = state.gl.getClearAlpha();

// --- PASS 1: Render background (no glass/logos) to fbo ---
frontMeshes.forEach(m => m.visible = false);
backMeshes.forEach(m => m.visible = false);
logoMeshes.forEach(m => m.visible = false);
bgMeshes.forEach(m => m.visible = true);

state.gl.setClearColor(finalBgColor, 1.0);
state.gl.setRenderTarget(fbo);
state.gl.clear();

const savedBg = scene.background;
scene.background = null;
state.gl.render(scene, camera);
scene.background = savedBg;

// --- PASS 2: Render back faces & logos to backFbo (no background/front faces) ---
frontMeshes.forEach(m => m.visible = false);
backMeshes.forEach(m => m.visible = true);
logoMeshes.forEach(m => m.visible = true);
bgMeshes.forEach(m => m.visible = false);

// Make sure the main bird and feather root groups are visible so their child back meshes are visible
if (birdRef.current) birdRef.current.visible = true;
if (featherModel) featherModel.visible = true;

state.gl.setClearColor(new THREE.Color(0, 0, 0), 0.0);
state.gl.setRenderTarget(backFbo);
state.gl.clear();

const savedBgPass2 = scene.background;
scene.background = null;
state.gl.render(scene, camera);
scene.background = savedBgPass2;

// --- PASS 3: Render complete scene to composerFbo ---
frontMeshes.forEach(m => m.visible = true);
backMeshes.forEach(m => m.visible = false);
logoMeshes.forEach(m => m.visible = false);
bgMeshes.forEach(m => m.visible = true);

if (birdRef.current) birdRef.current.visible = true;
if (featherModel) featherModel.visible = true;

state.gl.setClearColor(finalBgColor, 1.0);
state.gl.setRenderTarget(composerFbo);
state.gl.clear();

const savedBgPass3 = scene.background;
scene.background = null;
state.gl.render(scene, camera);
scene.background = savedBgPass3;

// --- PASS 4: Bloom Filter (Threshold) ---
bloomFilterMat.uniforms.t.value = composerFbo.texture;
state.gl.setRenderTarget(bloomFilterFbo);
state.gl.clear();
const filterMesh = new THREE.Mesh(composerQuad.geom, bloomFilterMat);
state.gl.render(filterMesh, composerQuad.orthoCam);

// --- PASS 5: Bloom Blur Cascade ---
let currentSource = bloomFilterFbo;
for (let o = 0; o < 5; o++) {
  const blurMat = bloomBlurMats[o];
  // Horizontal pass
  blurMat.uniforms.t.value = currentSource.texture;
  blurMat.uniforms.direction.value.set(1.0, 0.0);
  state.gl.setRenderTarget(bloomFboH[o]);
  state.gl.clear();
  const blurMeshH = new THREE.Mesh(composerQuad.geom, blurMat);
  state.gl.render(blurMeshH, composerQuad.orthoCam);

  // Vertical pass
  blurMat.uniforms.t.value = bloomFboH[o].texture;
  blurMat.uniforms.direction.value.set(0.0, 1.0);
  state.gl.setRenderTarget(bloomFboV[o]);
  state.gl.clear();
  const blurMeshV = new THREE.Mesh(composerQuad.geom, blurMat);
  state.gl.render(blurMeshV, composerQuad.orthoCam);

  currentSource = bloomFboV[o];
}

// --- PASS 6: Final Composer Screen ---
composerMaterial.uniforms.map.value = composerFbo.texture;
composerMaterial.uniforms.bloomLevel0.value = bloomLevel0V.texture;
composerMaterial.uniforms.bloomLevel1.value = bloomLevel1V.texture;
composerMaterial.uniforms.bloomLevel2.value = bloomLevel2V.texture;
composerMaterial.uniforms.bloomLevel3.value = bloomLevel3V.texture;
composerMaterial.uniforms.bloomLevel4.value = bloomLevel4V.texture;

// Read Post_halo and Post_haloMinMaxShift values from dev timeline
const postHaloNode = paramNodes.current['Post_halo'];
const postHaloMinMaxShiftNode = paramNodes.current['Post_haloMinMaxShift'];

const postHaloVal = postHaloNode ? postHaloNode.position.x : 0.5;
const postHaloMinVal = postHaloMinMaxShiftNode ? postHaloMinMaxShiftNode.position.x : 0.5;
const postHaloMaxVal = postHaloMinMaxShiftNode ? postHaloMinMaxShiftNode.position.y : 0.75;
const postHaloShiftVal = postHaloMinMaxShiftNode ? postHaloMinMaxShiftNode.position.z : 0.6667;

// Default bloom settings from original site
composerMaterial.uniforms.bloomRadius.value = 0.6667;
composerMaterial.uniforms.bloomPower.value = 0.1667;
composerMaterial.uniforms.haloPower.value = postHaloVal;
composerMaterial.uniforms.haloMin.value = postHaloMinVal;
composerMaterial.uniforms.haloMax.value = postHaloMaxVal;
composerMaterial.uniforms.haloShift.value = postHaloShiftVal;
composerMaterial.uniforms.exposure.value = 1.0;
composerMaterial.uniforms.seconds.value = state.clock.getElapsedTime();

const aspect = state.size.width / state.size.height;
const aspectX = aspect > 1.0 ? aspect : 1.0;
const aspectY = aspect > 1.0 ? 1.0 : 1.0 / aspect;
composerMaterial.uniforms.aspectRatio.value.set(aspectX, aspectY);
composerMaterial.uniforms.texelSize.value.set(1.0 / state.size.width, 1.0 / state.size.height);

state.gl.setRenderTarget(null);
state.gl.setClearColor(oldClearColor, oldClearAlpha);
state.gl.clear();

const finalMesh = new THREE.Mesh(composerQuad.geom, composerMaterial);
state.gl.render(finalMesh, composerQuad.orthoCam);
}, 1);

// Extract timeline nodes for crystals
const crystalNodes = Array.from({ length: 7 }, (_, i) => 
timelineGLTF.scene.getObjectByName(`project${i}`)
);

const sunNode = timelineGLTF.scene.getObjectByName('Sun');

return (
<>
{/* 1. Reflections environment map */}
<primitive object={envMapTexture} attach="environment" />

{/* 3. Lights Setup */}
<ambientLight intensity={1.4} color="#dbe2ff" />
<directionalLight 
position={[8, 15, 8]} 
intensity={2.8} 
color="#fdebfd" 
/>
<pointLight position={[-10, 5, -5]} intensity={1.2} color="#cebdf8" />

{/* 4. Rigged Bird (Phoenix) Primitive */}
{birdScene && (
  <primitive 
    object={birdScene} 
    ref={birdRef} 
    scale={0.8}
  />
)}

{/* 5. Floating Feather */}
{featherScene && (
  <primitive 
    object={featherScene} 
    name="FeatherModel"
    scale={0.5}
  />
)}

{/* 6. Case Study Crystals with custom shaders */}
{crystalNodes.map((node, i) => (
<Crystal
key={`crystal-${i}`}
id={`crystal${i}`}
index={i}
timelineNode={node}
onSelect={(name) => {
const links = [
'/cases/coinbase-warriors',
'/cases/salesforce-agentforce-360',
'/cases/intel-ai-io',
'/cases/vogue-business-archival',
'/cases/noomo-labs',
'/cases/noomo-valentime',
'/cases/amd-ai-factory'
];
onSelectCase(links[i], i);
}}
isClicked={clickedCaseIndex === i}
glassColor={glassColorRef.current}
fboTexture={fbo.texture}
backFboTexture={backFbo.texture}
noiseTexture={noiseTexture}
envMapTexture={envMapTexture}
colorsMap={colorsMap}
glassBackMat={glassBackMat}
glassFrontMat={glassFrontMat}
onHoverStart={(idx) => {
hoveredCaseRef.current = idx;
activeHoverColorRef.current.copy(HOVER_CASE_COLORS[idx]);
}}
onHoverEnd={() => {
hoveredCaseRef.current = -1;
}}
/>
))}


{/* 7. Curved Mountains cylinder background silhouette */}
<mesh ref={mountainsRef} position={[0, -2.5 + 6.25, 0]} rotation={[0, 0, 0]}>
<cylinderGeometry args={[100, 100, 12.5, 64, 1, true, 0, Math.PI]} />
<meshBasicMaterial 
map={mountainsTexture} 
transparent={true} 
side={THREE.DoubleSide} 
/>
</mesh>

{/* 8. Giant back fire glow sphere */}
<mesh ref={fireBackRef} position={[0, -2.5, 0]}>
<sphereGeometry args={[90, 16, 8]} />
<shaderMaterial
ref={fireBackMatRef}
transparent={true}
depthWrite={false}
blending={THREE.NormalBlending}
side={THREE.DoubleSide}
uniforms={{
color: { value: new THREE.Color(1.0, 0.25, 0.0) },
intensity: { value: 1.0 },
falloff: { value: 0.07 },
opacity: { value: 0.0 }
}}
vertexShader={`
varying vec2 vUv;
varying vec3 vPosition;
void main() {
vUv = uv;
vec4 worldPosition = modelMatrix * vec4(position, 1.0);
vPosition = position;
gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
`}
fragmentShader={`
varying vec2 vUv;
varying vec3 vPosition;
uniform vec3 color;
uniform float intensity;
uniform float falloff;
uniform float opacity;
void main() {
vec3 res = color * intensity;
float y = vPosition.y;
res *= exp(-falloff * abs(y)) * step(0.0, y);
gl_FragColor = vec4(res, opacity);
}
`}
/>
</mesh>

{/* 9. Rotating Instanced spots particles (Fairy dust starfield) */}
<instancedMesh ref={spotsRef} args={[null, null, 32]}>
<planeGeometry args={[1.5, 1.5]} />
<instancedBufferAttribute
attach="instanceColor"
args={[new Float32Array(32 * 3), 3]}
/>
<shaderMaterial
ref={spotsMatRef}
transparent={true}
depthWrite={false}
depthTest={false}
side={THREE.DoubleSide}
uniforms={{
uDarkness: { value: 0.0 }
}}
vertexShader={`
varying vec3 vColor;
varying vec2 vUv;
varying vec3 vPosition;
void main() {
vColor = instanceColor;
vUv = uv;
vec4 worldPosition = modelMatrix * instanceMatrix * vec4(position, 1.0);
vPosition = worldPosition.xyz;
gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
`}
fragmentShader={`
varying vec3 vColor;
varying vec2 vUv;
uniform float uDarkness;
void main() {
vec3 color = vColor;
vec2 uv = vUv * (1.0 - vUv) * 0.99 + 0.005;
float a = pow(16.0 * uv.x * uv.y, 2.0);
gl_FragColor = vec4(color, a * (1.0 - uDarkness));
}
`}
/>
</instancedMesh>

{/* 10. Liquid Floor Reflection Plane */}
<Reflector
  ref={floorMatRef}
  position={[0, -2.5, 0]}
  normalMap={waveTexture}
  envMap={envMapTexture}
  opacity={1.0}
/>

{/* 11. 3D Billboard Sun Mesh */}
{sunNode && (
<mesh ref={sunRef} renderOrder={-80}>
<planeGeometry args={[2, 2]} />
<shaderMaterial
transparent={true}
depthWrite={false}
depthTest={false}
blending={THREE.AdditiveBlending}
uniforms={sunUniforms}
vertexShader={`
varying vec2 vUv;
uniform float size;
void main() {
vUv = uv;
gl_Position = projectionMatrix * modelViewMatrix * vec4(position * size, 1.0);
}
`}
fragmentShader={`
varying vec2 vUv;
uniform vec3 color;
uniform float amp;
uniform float opacity;
uniform sampler2D map;
void main() {
gl_FragColor = texture2D(map, vUv);
gl_FragColor.rgb *= color * amp;
gl_FragColor.a *= opacity;
}
`}
/>
</mesh>
)}
</>
);
}

useGLTF.preload('/timelines/cam.glb');
useGLTF.preload('/timelines/cam-mob.glb');
useGLTF.preload('/timelines/dev.glb');
useGLTF.preload('/models/v20.glb');
useGLTF.preload('/models/feather.glb');

