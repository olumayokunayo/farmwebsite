"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

function Chicken({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshStandardMaterial color="#f4e8c1" />
      <mesh position={[0, 0.2, 0.2]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#f4e8c1" />
      </mesh>
      <mesh position={[0.05, 0.3, 0.25]}>
        <coneGeometry args={[0.05, 0.1, 8]} />
        <meshStandardMaterial color="#ff6b35" />
      </mesh>
    </mesh>
  );
}

function Barn() {
  return (
    <group position={[0, 0, -3]}>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[3, 2, 2]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      <mesh position={[0, 1.8, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[2.2, 2.2, 2]} />
        <meshStandardMaterial color="#a0522d" />
      </mesh>
    </group>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#7cb342" />
    </mesh>
  );
}

function FarmScene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[5, 3, 8]} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3}
        autoRotate
        autoRotateSpeed={0.5}
      />

      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, 10, -10]} intensity={0.5} />

      <Ground />
      <Barn />

      <Chicken position={[1.5, 0, 0]} />
      <Chicken position={[-1, 0, 1]} />
      <Chicken position={[0.5, 0, 2]} />
      <Chicken position={[-2, 0, 0.5]} />
    </>
  );
}

export default function Farm3DScene() {
  return (
    <div className="w-full h-full">
      <Canvas>
        <FarmScene />
      </Canvas>
    </div>
  );
}
