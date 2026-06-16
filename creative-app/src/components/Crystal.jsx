import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { audioController } from './AudioComponent';

// Original crystal settings when not hovered
const CRYSTAL_DEFAULT = {
  baseColor: new THREE.Color(0xffffff),
  peaksColor: new THREE.Color(0xffffff),
  fringeColor: new THREE.Color(0xffffff),
  resetDistances: 0.0,
  distancesFactor: 1.0,
  iorStart: 1.2,
  iorDelta: 0.3,
  uvShiftFactor: 1.0,
  envReflection: 1.0,
  envRefraction: 0.0,
  reflectionIridescence: 0.0,
  refractionIridescence: 0.0,
  convexityFactor: 1.0,
  concavityFactor: 1.0,
  peaksFactor: 1.0,
  fringeCurve: 5.0,
  fringeMix: 1.0,
  colorBoost: 2.0,
  colorFactor: 2.0,
  colorCurve: 1.5,
  colorCurveR: 1.0,
  colorCurveG: 1.0,
  colorCurveB: 1.0,
  maxColorValue: 25.0,
  decayFactor: 20.0
};

// Case study crystal hovers from CbdjwYMp.js
const CRYSTAL_HOVERS = [
  {
    baseColor: new THREE.Color(0xfbe687), // Coinbase Gold
    peaksColor: new THREE.Color(0xf8ecde),
    fringeColor: new THREE.Color(0xf6eedb),
    resetDistances: 0.33,
    distancesFactor: 22.22,
    iorStart: 1.3,
    iorDelta: 0.33,
    uvShiftFactor: 1.8,
    envReflection: 0.22,
    envRefraction: 0.72,
    reflectionIridescence: 0.16,
    refractionIridescence: 0.95,
    convexityFactor: 0.72,
    concavityFactor: 0.52,
    peaksFactor: 0.84,
    fringeCurve: 3.23,
    fringeMix: 0.83,
    colorBoost: 0.04,
    colorFactor: 2.58,
    colorCurve: 1.37,
    colorCurveR: 1.0,
    colorCurveG: 1.11,
    colorCurveB: 1.11,
    maxColorValue: 50.0,
    decayFactor: 250.0
  },
  {
    baseColor: new THREE.Color(0x87acfb), // Salesforce Blue
    peaksColor: new THREE.Color(0xf8ecde),
    fringeColor: new THREE.Color(0xf6eedb),
    resetDistances: 0.33,
    distancesFactor: 22.0,
    iorStart: 1.3,
    iorDelta: 0.33,
    uvShiftFactor: 1.8,
    envReflection: 0.22,
    envRefraction: 0.72,
    reflectionIridescence: 0.15,
    refractionIridescence: 0.95,
    convexityFactor: 0.72,
    concavityFactor: 0.52,
    peaksFactor: 0.84,
    fringeCurve: 3.23,
    fringeMix: 0.83,
    colorBoost: 0.04,
    colorFactor: 2.58,
    colorCurve: 1.37,
    colorCurveR: 1.0,
    colorCurveG: 1.11,
    colorCurveB: 1.11,
    maxColorValue: 50.0,
    decayFactor: 250.0
  },
  {
    baseColor: new THREE.Color(0xc2fac9), // Intel Green/Mint
    peaksColor: new THREE.Color(0xfef4f9),
    fringeColor: new THREE.Color(0xcbf7e7),
    resetDistances: 0.0,
    distancesFactor: 15.0,
    iorStart: 1.33,
    iorDelta: 3.0,
    uvShiftFactor: 3.0,
    envReflection: 1.0,
    envRefraction: 0.88,
    reflectionIridescence: 0.47,
    refractionIridescence: 0.8,
    convexityFactor: 1.0,
    concavityFactor: 0.55,
    peaksFactor: 0.58,
    fringeCurve: 2.5,
    fringeMix: 0.7,
    colorBoost: 0.27,
    colorFactor: 2.5,
    colorCurve: 1.8,
    colorCurveR: 1.2,
    colorCurveG: 0.99,
    colorCurveB: 0.92,
    maxColorValue: 65.0,
    decayFactor: 500.0
  },
  {
    baseColor: new THREE.Color(0xffb0fa), // Vogue Pink/Rose
    peaksColor: new THREE.Color(0xe7e2ff),
    fringeColor: new THREE.Color(0xd6e1fc),
    resetDistances: 0.0,
    distancesFactor: 6.0,
    iorStart: 1.65,
    iorDelta: 5.0,
    uvShiftFactor: 2.14,
    envReflection: 0.8,
    envRefraction: 0.75,
    reflectionIridescence: 0.85,
    refractionIridescence: 0.75,
    convexityFactor: 0.22,
    concavityFactor: 0.67,
    peaksFactor: 2.67,
    fringeCurve: 4.8,
    fringeMix: 0.63,
    colorBoost: 0.5,
    colorFactor: 2.0,
    colorCurve: 0.72,
    colorCurveR: 1.14,
    colorCurveG: 1.11,
    colorCurveB: 1.16,
    maxColorValue: 100.0,
    decayFactor: 500.0
  },
  {
    baseColor: new THREE.Color(0xcbddd9), // Noomo Labs Grey
    peaksColor: new THREE.Color(0xf9cfe5),
    fringeColor: new THREE.Color(0xcdd3db),
    resetDistances: 0.0,
    distancesFactor: 4.35,
    iorStart: 1.98,
    iorDelta: 4.0,
    uvShiftFactor: 5.0,
    envReflection: 0.52,
    envRefraction: 0.49,
    reflectionIridescence: 0.5,
    refractionIridescence: 0.17,
    convexityFactor: 0.01,
    concavityFactor: 0.7,
    peaksFactor: 1.2,
    fringeCurve: 2.22,
    fringeMix: 0.65,
    colorBoost: 1.33,
    colorFactor: 2.0,
    colorCurve: 0.45,
    colorCurveR: 1.07,
    colorCurveG: 1.37,
    colorCurveB: 0.94,
    maxColorValue: 35.0,
    decayFactor: 50.0
  },
  {
    baseColor: new THREE.Color(0x4edbef), // Noomo Valentime Cyan
    peaksColor: new THREE.Color(0xc2c0ff),
    fringeColor: new THREE.Color(0xfcfcfc),
    resetDistances: 0.0,
    distancesFactor: 6.0,
    iorStart: 1.22,
    iorDelta: 5.0,
    uvShiftFactor: 1.0,
    envReflection: 0.68,
    envRefraction: 0.34,
    reflectionIridescence: 0.38,
    refractionIridescence: 0.22,
    convexityFactor: 0.21,
    concavityFactor: 0.55,
    peaksFactor: 2.34,
    fringeCurve: 3.02,
    fringeMix: 0.68,
    colorBoost: 0.3,
    colorFactor: 2.0,
    colorCurve: 1.24,
    colorCurveR: 0.28,
    colorCurveG: 1.52,
    colorCurveB: 1.04,
    maxColorValue: 100.0,
    decayFactor: 350.0
  },
  {
    baseColor: new THREE.Color(0xcef1e2), // AMD Teal
    peaksColor: new THREE.Color(0xe4daff),
    fringeColor: new THREE.Color(0xd6efe2),
    resetDistances: 0.0,
    distancesFactor: 24.0,
    iorStart: 1.5,
    iorDelta: 0.5,
    uvShiftFactor: 2.86,
    envReflection: 0.21,
    envRefraction: 0.95,
    reflectionIridescence: 0.9,
    refractionIridescence: 0.88,
    convexityFactor: 0.73,
    concavityFactor: 0.56,
    peaksFactor: 1.77,
    fringeCurve: 4.51,
    fringeMix: 0.71,
    colorBoost: 0.14,
    colorFactor: 2.58,
    colorCurve: 1.16,
    colorCurveR: 1.05,
    colorCurveG: 1.09,
    colorCurveB: 0.93,
    maxColorValue: 100.0,
    decayFactor: 450.0
  }
];

export default function Crystal({ 
  id, 
  index, 
  timelineNode, 
  onSelect,
  glassColor,
  glassBackMat,
  glassFrontMat,
  fboTexture,
  backFboTexture,
  noiseTexture,
  envMapTexture,
  onHoverStart,
  onHoverEnd,
  isClicked = false
}) {
  const crystalRef = useRef();
  const innerRef = useRef();
  
  // Load crystal GLB asset and texture map (contains debossed client logo)
  const { nodes } = useGLTF(`/models/crystal${index}.glb`);
  const texture = useTexture(`/textures/crystals/${index}.jpg`);
  
  // Configure texture repeat settings
  useEffect(() => {
    if (texture) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    }
  }, [texture]);

  const [hovered, setHovered] = useState(false);
  
  // Spring target values for smooth scaling & rotation speed
  const scale = useRef(1);
  const targetScale = isClicked ? 1.5 : (hovered ? 1.25 : 1);
  const rotationSpeed = useRef(0.2);
  const targetRotationSpeed = isClicked ? 2.5 : (hovered ? 0.8 : 0.2);
  
  const hoverProgress = useRef(0);

  // Clone materials per crystal and assign its unique logo normal map
  const clonedBackMat = useMemo(() => {
    const mat = glassBackMat.clone();
    if (texture) mat.uniforms.normalMap.value = texture;
    return mat;
  }, [glassBackMat, texture]);

  const clonedFrontMat = useMemo(() => {
    const mat = glassFrontMat.clone();
    if (texture) mat.uniforms.normalMap.value = texture;
    return mat;
  }, [glassFrontMat, texture]);

  // Custom case study names
  const caseNames = [
    "Coinbase - Brand Activation",
    "Salesforce - Agentforce 360",
    "Intel - Event Booth Experience",
    "Vogue Business - Editorial Site",
    "Crystal Labs - 3D Website",
    "Crystal Valentime - 3D Storytelling",
    "AMD - Digital Event Experience"
  ];

  useFrame((state, delta) => {
    // 1. Follow the timeline dummy position if it exists
    if (timelineNode && crystalRef.current) {
      crystalRef.current.position.copy(timelineNode.position);
    }

    if (!crystalRef.current) return;

    // 2. Interpolate spring values for scale & rotation speed
    scale.current += (targetScale - scale.current) * 0.1;
    rotationSpeed.current += (targetRotationSpeed - rotationSpeed.current) * 0.1;

    crystalRef.current.scale.setScalar(scale.current);

    // 3. Rotate the crystal Cube & Icon
    crystalRef.current.rotation.y += rotationSpeed.current * delta;
    crystalRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;

    // 4. Smoothly lerp material uniforms on hover
    const targetProgress = hovered ? 1.0 : 0.0;
    hoverProgress.current += (targetProgress - hoverProgress.current) * 0.1;
    const p = hoverProgress.current;
    
    const h = CRYSTAL_HOVERS[index];
    const d = CRYSTAL_DEFAULT;
    
    const lerpVal = (key) => d[key] + (h[key] - d[key]) * p;

    if (clonedBackMat && clonedFrontMat) {
      // Set texture maps
      clonedBackMat.uniforms.map.value = fboTexture;
      clonedBackMat.uniforms.noiseMap.value = noiseTexture;
      clonedBackMat.uniforms.envMap.value = envMapTexture;

      clonedFrontMat.uniforms.map.value = backFboTexture;
      clonedFrontMat.uniforms.noiseMap.value = noiseTexture;
      clonedFrontMat.uniforms.envMap.value = envMapTexture;

      // Lerp back material uniforms
      clonedBackMat.uniforms.iorStart.value = lerpVal('iorStart');
      clonedBackMat.uniforms.iorDelta.value = lerpVal('iorDelta');
      clonedBackMat.uniforms.envRefraction.value = lerpVal('envRefraction');
      clonedBackMat.uniforms.refractionIridescence.value = lerpVal('refractionIridescence');
      clonedBackMat.uniforms.uvShiftFactor.value = lerpVal('uvShiftFactor');
      clonedBackMat.uniforms.resetDistances.value = lerpVal('resetDistances');
      clonedBackMat.uniforms.distancesFactor.value = lerpVal('distancesFactor');
      clonedBackMat.uniforms.convexityFactor.value = lerpVal('convexityFactor');
      clonedBackMat.uniforms.concavityFactor.value = lerpVal('concavityFactor');
      clonedBackMat.uniforms.fringeCurve.value = lerpVal('fringeCurve');
      clonedBackMat.uniforms.fringeMix.value = lerpVal('fringeMix');
      clonedBackMat.uniforms.fringeColor.value.lerpColors(d.fringeColor, h.fringeColor, p);
      clonedBackMat.uniforms.seconds.value = state.clock.getElapsedTime();

      // Lerp front material uniforms
      clonedFrontMat.uniforms.iorStart.value = lerpVal('iorStart');
      clonedFrontMat.uniforms.iorDelta.value = lerpVal('iorDelta');
      clonedFrontMat.uniforms.envReflection.value = lerpVal('envReflection');
      clonedFrontMat.uniforms.refractionIridescence.value = lerpVal('refractionIridescence');
      clonedFrontMat.uniforms.reflectionIridescence.value = lerpVal('reflectionIridescence');
      clonedFrontMat.uniforms.colorBoost.value = lerpVal('colorBoost');
      clonedFrontMat.uniforms.colorFactor.value = lerpVal('colorFactor');
      clonedFrontMat.uniforms.decayFactor.value = lerpVal('decayFactor');
      clonedFrontMat.uniforms.maxColorValue.value = lerpVal('maxColorValue');
      clonedFrontMat.uniforms.colorCurve.value = lerpVal('colorCurve');
      clonedFrontMat.uniforms.colorCurveR.value = lerpVal('colorCurveR');
      clonedFrontMat.uniforms.colorCurveG.value = lerpVal('colorCurveG');
      clonedFrontMat.uniforms.colorCurveB.value = lerpVal('colorCurveB');
      clonedFrontMat.uniforms.uvShiftFactor.value = lerpVal('uvShiftFactor');
      clonedFrontMat.uniforms.resetDistances.value = lerpVal('resetDistances');
      clonedFrontMat.uniforms.distancesFactor.value = lerpVal('distancesFactor');
      
      clonedFrontMat.uniforms.baseColor.value.lerpColors(d.baseColor, h.baseColor, p);
      clonedFrontMat.uniforms.peaksColor.value.lerpColors(d.peaksColor, h.peaksColor, p);
      clonedFrontMat.uniforms.fringeColor.value.lerpColors(d.fringeColor, h.fringeColor, p);
      clonedFrontMat.uniforms.seconds.value = state.clock.getElapsedTime();
    }
  });

  const handlePointerOver = (e) => {
    e.stopPropagation();
    setHovered(true);
    window.updateCustomCursor?.(true, caseNames[index]);
    audioController.playHover();
    if (onHoverStart) onHoverStart(index);
  };

  const handlePointerOut = () => {
    setHovered(false);
    window.updateCustomCursor?.(false, "");
    if (onHoverEnd) onHoverEnd();
  };

  const handleClick = (e) => {
    e.stopPropagation();
    audioController.playSpirit();
    if (onSelect) onSelect(caseNames[index]);
  };

  const cubeGeometry = nodes.Cube?.geometry;
  const iconGeometry = nodes.Icon?.geometry;

  // Set up required attributes for custom glass shaders
  useEffect(() => {
    if (cubeGeometry) {
      if (!cubeGeometry.attributes.tangent) {
        cubeGeometry.computeTangents();
      }
      if (!cubeGeometry.attributes._dist) {
        const count = cubeGeometry.attributes.position.count;
        const distArray = new Float32Array(count).fill(2.0); // defaultDist is 2.0
        cubeGeometry.setAttribute('_dist', new THREE.BufferAttribute(distArray, 1));
      }
    }
  }, [cubeGeometry]);

  return (
    <group 
      ref={crystalRef}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {/* 1. Main outer crystal geometry with glass refractor shader (Double-Pass) */}
      {cubeGeometry && (
        <>
          <mesh 
            name={`${id}-back`} 
            geometry={cubeGeometry} 
            material={clonedBackMat} 
          />
          <mesh 
            name={`${id}-front`} 
            geometry={cubeGeometry} 
            material={clonedFrontMat} 
          />
        </>
      )}

      {/* 2. Embedded client logo model inside the crystal */}
      {iconGeometry && (
        <mesh 
          name={`${id}-logo`}
          geometry={iconGeometry} 
          scale={0.7} 
          ref={innerRef}
        >
          <meshPhysicalMaterial 
            color="#ffffff" 
            emissive="#ffffff"
            emissiveIntensity={0.2}
            roughness={0.2}
            metalness={0.8}
            clearcoat={1}
          />
        </mesh>
      )}

      {/* 3. Invisible ConvexHull collider mesh for cheaper pointer raycasting */}
      {nodes.ConvexHull && (
        <mesh 
          geometry={nodes.ConvexHull.geometry} 
          visible={false}
        />
      )}
    </group>
  );
}

// Preload assets for instant load
for (let i = 0; i < 7; i++) {
  useGLTF.preload(`/models/crystal${i}.glb`);
}

