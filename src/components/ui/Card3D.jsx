import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Environment, PresentationControls } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { cn } from '../../utils/shadcn-utils';

const Card3D = ({ 
  width = 4,
  height = 3,
  depth = 0.1,
  color = '#ffffff',
  hoverColor = '#f0f0f0',
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  onClick,
  children,
  ...props
}) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  // Animation for card hovering
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y = meshRef.current.rotation.y += 0.005;
    }
  });

  // Spring animation for hover effect
  const { scale, materialColor } = useSpring({
    scale: hovered ? [1.1, 1.1, 1.1] : [1, 1, 1],
    materialColor: hovered ? hoverColor : color,
    config: { mass: 1, tension: 170, friction: 26 }
  });

  return (
    <animated.mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      {...props}
    >
      <boxGeometry args={[width, height, depth]} />
      <animated.meshStandardMaterial color={materialColor} />
      {children}
    </animated.mesh>
  );
};

// Container component that wraps the Canvas
export const Card3DContainer = ({ 
  className, 
  style, 
  width = 300,
  height = 200,
  backgroundColor = 'transparent',
  ambientLight = true,
  directionalLight = true,
  environmentPreset = 'city',
  autoRotate = true,
  children,
  ...props 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn('relative overflow-hidden rounded-lg', className)}
      style={{ width, height, backgroundColor, ...style }}
      {...props}
    >
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
      >
        {ambientLight && <ambientLight intensity={0.5} />}
        {directionalLight && <directionalLight position={[10, 10, 5]} intensity={1} />}
        <Environment preset={environmentPreset} />
        <PresentationControls
          global
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 4, Math.PI / 4]}
          azimuth={[-Math.PI / 4, Math.PI / 4]}
          config={{ mass: 2, tension: 400 }}
          snap={{ mass: 4, tension: 400 }}
          cursor={true}
          zoom={1}
          speed={1.5}
          enabled={true}
        >
          {children}
        </PresentationControls>
      </Canvas>
    </motion.div>
  );
};

// Example usage
export const Feature3DCard = ({ title, description, iconName, color = '#3B82F6' }) => {
  return (
    <div className="relative h-[280px] w-full">
      <Card3DContainer 
        width="100%" 
        height="100%"
        className="shadow-lg"
      >
        <Card3D 
          width={3.5} 
          height={2.5} 
          depth={0.2} 
          color={color}
          hoverColor="#4C93FB"
          position={[0, 0, 0]}
        />
        <Text
          position={[0, 0.5, 0.11]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="/fonts/inter-medium.woff"
        >
          {title}
        </Text>
      </Card3DContainer>
      <div className="absolute bottom-0 left-0 w-full p-4 bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 rounded-b-lg">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
      </div>
    </div>
  );
};

export default Card3D;

