import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const reflectorVertexShader = `
varying vec2 vUv;
varying vec4 vCustomUV;
varying vec3 vWorldPosition;

uniform mat4 textureMatrix;

void main() {
  vUv = uv;
  vCustomUV = textureMatrix * vec4(position, 1.);
  vCustomUV.xyz = ((vCustomUV.xyz / vCustomUV.w - 0.5) / 1.25 + 0.5) * vCustomUV.w;

  vec4 worldPosition = modelMatrix * vec4(position, 1.);
  vWorldPosition = worldPosition.xyz;

  gl_Position = projectionMatrix * viewMatrix * worldPosition;
  gl_Position.xy /= 1.25;
}
`;

const reflectorFragmentShader = `
precision highp float;

#define pi 3.14159265358979323846

varying vec2 vUv;
varying vec4 vCustomUV;
varying vec3 vWorldPosition;

uniform sampler2D map;
uniform float mixStrength;
uniform float mixEnv;
uniform float opacity;
uniform float seconds;
uniform sampler2D normalMap;
uniform float normalUVScale;
uniform sampler2D envMap;

#define oneOverPi 0.3183098861837907
vec3 getEnvColor(vec3 ray) {
  vec2 uv = vec2(atan(ray.x, ray.z) * 0.5, asin(ray.y));
  uv = uv * oneOverPi + 0.5;
  uv.x = fract(uv.x);
  vec3 color = texture2D(envMap, uv).rgb;
  color = 1. - exp(-0.1 * color);
  return color;
}

vec3 getNormal(vec2 uv) {
  vec2 uv0 = (uv / 103.0) + vec2(seconds / 17.0, seconds / 29.0);
  vec2 uv1 = uv / 107.0 - vec2(seconds / -19.0, seconds / 31.0);
  vec2 uv2 = uv / vec2(8907.0, 9803.0) + vec2(seconds / 101.0, seconds / 97.0);
  vec2 uv3 = uv / vec2(1091.0, 1027.0) - vec2(seconds / 109.0, seconds / -113.0);
  vec3 noise = texture2D(normalMap, uv0).rgb +
    texture2D(normalMap, uv1).rgb +
    texture2D(normalMap, uv2).rgb +
    texture2D(normalMap, uv3).rgb;
  noise = noise * 0.5 - 1.0;
  return normalize(noise.xzy);
}

void main() {
  vec4 uv = vCustomUV;

  vec3 normal = getNormal(vUv * 3e4 * normalUVScale);
  float l = length(vWorldPosition.xz);
  normal.xz += normalize(vWorldPosition.xz) * 0.4 * cos(l * pi - seconds) * smoothstep(0.1, 1., l) * smoothstep(10., 5., l);
  vec3 coord = uv.xyz / uv.w;
  vec2 normal_uv = coord.xy + coord.z * normal.xz * 0.05;
  vec4 texel = texture2D(map, normal_uv);

  vec3 envColor = getEnvColor(reflect(normalize(cameraPosition - vWorldPosition), normal));
  vec3 color = texel.rgb * mixStrength + envColor * mixEnv;

  gl_FragColor = vec4(color, opacity);
}
`;

const Reflector = React.forwardRef(({
  position,
  normalMap,
  envMap,
  opacity = 1.0,
  mixStrength = 0.2,
  mixEnv = 0.15,
  normalUVScale = 1.0,
  resolution = 512
}, ref) => {
  const localMeshRef = useRef();
  const meshRef = ref || localMeshRef;
  const { gl, scene, camera } = useThree();

  const virtualCamera = useMemo(() => new THREE.PerspectiveCamera(), []);
  
  const renderTarget = useMemo(() => {
    return new THREE.WebGLRenderTarget(resolution, resolution, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      type: THREE.UnsignedByteType,
      colorSpace: THREE.SRGBColorSpace
    });
  }, [resolution]);

  const reflectorPlane = useMemo(() => new THREE.Plane(), []);
  const normal = useMemo(() => new THREE.Vector3(), []);
  const reflectorWorldPosition = useMemo(() => new THREE.Vector3(), []);
  const cameraWorldPosition = useMemo(() => new THREE.Vector3(), []);
  const rotationMatrix = useMemo(() => new THREE.Matrix4(), []);
  const lookAtPosition = useMemo(() => new THREE.Vector3(0, 0, -1), []);
  const clipPlane = useMemo(() => new THREE.Vector4(), []);
  const view = useMemo(() => new THREE.Vector3(), []);
  const target = useMemo(() => new THREE.Vector3(), []);
  const q = useMemo(() => new THREE.Vector4(), []);
  const textureMatrix = useMemo(() => new THREE.Matrix4(), []);

  const materialRef = useRef();

  const uniforms = useMemo(() => ({
    map: { value: null },
    textureMatrix: { value: textureMatrix },
    normalMap: { value: normalMap },
    normalUVScale: { value: normalUVScale },
    mixStrength: { value: mixStrength },
    mixEnv: { value: mixEnv },
    opacity: { value: opacity },
    seconds: { value: 0 },
    envMap: { value: envMap }
  }), [normalMap, envMap, normalUVScale, mixStrength, mixEnv, opacity]);

  useEffect(() => {
    uniforms.normalMap.value = normalMap;
  }, [normalMap, uniforms]);

  useEffect(() => {
    uniforms.envMap.value = envMap;
  }, [envMap, uniforms]);

  useEffect(() => {
    uniforms.opacity.value = opacity;
  }, [opacity, uniforms]);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    // Synchronize virtual camera settings
    virtualCamera.fov = camera.fov;
    virtualCamera.aspect = camera.aspect;
    virtualCamera.near = camera.near;
    virtualCamera.far = camera.far;

    reflectorWorldPosition.setFromMatrixPosition(mesh.matrixWorld);
    cameraWorldPosition.setFromMatrixPosition(camera.matrixWorld);

    rotationMatrix.extractRotation(mesh.matrixWorld);

    normal.set(0, 0, 1);
    normal.applyMatrix4(rotationMatrix);

    view.subVectors(reflectorWorldPosition, cameraWorldPosition);

    // Avoid rendering when reflector is facing away (the camera is below the floor)
    const isFacingAway = view.dot(normal) > 0;
    if (isFacingAway) return;

    view.reflect(normal).negate();
    view.add(reflectorWorldPosition);

    rotationMatrix.extractRotation(camera.matrixWorld);

    lookAtPosition.set(0, 0, -1);
    lookAtPosition.applyMatrix4(rotationMatrix);
    lookAtPosition.add(cameraWorldPosition);

    target.subVectors(reflectorWorldPosition, lookAtPosition);
    target.reflect(normal).negate();
    target.add(reflectorWorldPosition);

    virtualCamera.position.copy(view);
    virtualCamera.up.set(0, 1, 0);
    virtualCamera.up.applyMatrix4(rotationMatrix);
    virtualCamera.up.reflect(normal);
    virtualCamera.lookAt(target);

    virtualCamera.far = camera.far;
    virtualCamera.updateMatrixWorld();
    virtualCamera.projectionMatrix.copy(camera.projectionMatrix);

    // Update texture matrix
    textureMatrix.set(
      0.5, 0.0, 0.0, 0.5,
      0.0, 0.5, 0.0, 0.5,
      0.0, 0.0, 0.5, 0.5,
      0.0, 0.0, 0.0, 1.0
    );
    textureMatrix.multiply(virtualCamera.projectionMatrix);
    textureMatrix.multiply(virtualCamera.matrixWorldInverse);
    textureMatrix.multiply(mesh.matrixWorld);

    // Oblique view frustum clipping
    reflectorPlane.setFromNormalAndCoplanarPoint(normal, reflectorWorldPosition);
    reflectorPlane.applyMatrix4(virtualCamera.matrixWorldInverse);

    clipPlane.set(reflectorPlane.normal.x, reflectorPlane.normal.y, reflectorPlane.normal.z, reflectorPlane.constant);

    const projectionMatrix = virtualCamera.projectionMatrix;

    q.x = (Math.sign(clipPlane.x) + projectionMatrix.elements[8]) / projectionMatrix.elements[0];
    q.y = (Math.sign(clipPlane.y) + projectionMatrix.elements[9]) / projectionMatrix.elements[5];
    q.z = -1.0;
    q.w = (1.0 + projectionMatrix.elements[10]) / projectionMatrix.elements[14];

    clipPlane.multiplyScalar(2.0 / clipPlane.dot(q));

    projectionMatrix.elements[2] = clipPlane.x;
    projectionMatrix.elements[6] = clipPlane.y;
    projectionMatrix.elements[10] = clipPlane.z + 1.0;
    projectionMatrix.elements[14] = clipPlane.w;

    // Render reflection
    mesh.visible = false;

    const currentRenderTarget = gl.getRenderTarget();
    const currentXrEnabled = gl.xr.enabled;
    const currentShadowAutoUpdate = gl.shadowMap.autoUpdate;

    gl.xr.enabled = false;
    gl.shadowMap.autoUpdate = false;

    gl.setRenderTarget(renderTarget);
    gl.state.buffers.depth.setMask(true);
    
    // Clear and render using virtual camera
    gl.clear();
    gl.render(scene, virtualCamera);

    gl.xr.enabled = currentXrEnabled;
    gl.shadowMap.autoUpdate = currentShadowAutoUpdate;
    gl.setRenderTarget(currentRenderTarget);

    mesh.visible = true;

    // Update seconds uniform
    if (materialRef.current) {
      materialRef.current.uniforms.seconds.value = state.clock.getElapsedTime();
      materialRef.current.uniforms.map.value = renderTarget.texture;
    }
  });

  useEffect(() => {
    return () => {
      renderTarget.dispose();
    };
  }, [renderTarget]);

  return (
    <mesh
      ref={meshRef}
      name="FloorModel"
      rotation={[-Math.PI / 2, 0, 0]}
      position={position}
    >
      <planeGeometry args={[2000, 2000]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={reflectorVertexShader}
        fragmentShader={reflectorFragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={true}
      />
    </mesh>
  );
});

Reflector.displayName = 'Reflector';

export default Reflector;
