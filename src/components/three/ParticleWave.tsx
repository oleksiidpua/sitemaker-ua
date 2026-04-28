"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const COLS = 60;
const ROWS = 36;
const SPACING = 0.32;

function Wave() {
  const ref = useRef<THREE.Points>(null);
  const colorAttrRef = useRef<THREE.BufferAttribute>(null);

  const { positions, colors } = useMemo(() => {
    const count = COLS * ROWS;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const lavender = new THREE.Color("#7c5cff");
    const mint = new THREE.Color("#a8dac4");

    let i = 0;
    for (let x = 0; x < COLS; x++) {
      for (let z = 0; z < ROWS; z++) {
        const px = (x - COLS / 2) * SPACING;
        const pz = (z - ROWS / 2) * SPACING;
        positions[i * 3] = px;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = pz;

        const t = (x / COLS + z / ROWS) / 2;
        const c = lavender.clone().lerp(mint, t);
        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;

        i++;
      }
    }

    return { positions, colors };
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const pos = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;

    let i = 0;
    for (let x = 0; x < COLS; x++) {
      for (let z = 0; z < ROWS; z++) {
        const px = (x - COLS / 2) * SPACING;
        const pz = (z - ROWS / 2) * SPACING;
        const dist = Math.sqrt(px * px + pz * pz);
        const y =
          Math.sin(dist * 0.9 - t * 1.4) * 0.6 +
          Math.sin(px * 0.5 + t * 0.8) * 0.25 +
          Math.cos(pz * 0.6 - t * 0.6) * 0.2;
        arr[i * 3 + 1] = y;
        i++;
      }
    }
    pos.needsUpdate = true;
    ref.current.rotation.y = Math.sin(t * 0.1) * 0.08;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          ref={colorAttrRef}
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export default function ParticleWave() {
  return (
    <Canvas
      camera={{ position: [0, 4.5, 9], fov: 55 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true }}
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={0.5} />
      <group rotation={[-0.25, 0, 0]} position={[0, -1, 0]}>
        <Wave />
      </group>
    </Canvas>
  );
}
