import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Sphere, Box, Torus, Octahedron, RoundedBox } from '@react-three/drei';
import { motion } from 'framer-motion';
import { cn } from '../../utils/shadcn-utils';
import * as THREE from 'three';

// Animated 3D Icon component
const Icon3DObject = ({ 
  shape = 'sphere', 
  size = 1, 
  color = '#3B82F6',
  hoverColor = '#60A5FA',
  text,
  textColor = 'white',
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  spin = true,
  spinAxis = 'y',
  spinSpeed = 0.01,
  onClick,
  ...props 
}) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const currentColor = hovered ? hoverColor : color;
  
  // Animation for continuous rotation
  useFrame(() => {
    if (spin && meshRef.current) {
      meshRef.current.rotation[spinAxis] += spinSpeed;
    }
  });

  // Determine which 3D shape to render
  const ShapeComponent = useMemo(() => {
    switch (shape.toLowerCase()) {
      case 'box':
        return <Box args={[size, size, size]} />;
      case 'roundedbox':
        return <RoundedBox args={[size, size, size]} radius={0.1} />;
      case 'torus':
        return <Torus args={[size * 0.6, size * 0.2, 16, 32]} />;
      case 'octahedron':
        return <Octahedron args={[size * 0.8, 0]} />;
      case 'sphere':
      default:
        return <Sphere args={[size * 0.8, 32, 32]} />;
    }
  }, [shape, size]);

  return (
    <group position={position} rotation={rotation} {...props}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
      >
        {ShapeComponent}
        <meshStandardMaterial 
          color={currentColor}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
      
      {text && (
        <Text
          position={[0, -size * 1.5, 0]}
          fontSize={size * 0.4}
          color={textColor}
          anchorX="center"
          anchorY="middle"
          maxWidth={size * 5}
          textAlign="center"
        >
          {text}
        </Text>
      )}
    </group>
  );
};

// Container component for the 3D Icon
export const Icon3D = ({ 
  className, 
  style,
  size = 80,
  shape = 'sphere',
  color = '#3B82F6',
  hoverColor = '#60A5FA',
  text,
  backgroundColor = 'transparent',
  onClick,
  ...props 
}) => {
  const handleClick = (e) => {
    if (onClick) {
      e.stopPropagation();
      onClick(e);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={cn('relative cursor-pointer', className)}
      style={{ 
        width: size, 
        height: size,
        backgroundColor,
        ...style 
      }}
      onClick={handleClick}
      {...props}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 40 }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <directionalLight position={[0, 0, 5]} intensity={1} />
        
        <Icon3DObject
          shape={shape}
          size={1}
          color={color}
          hoverColor={hoverColor}
          text={text}
          position={[0, 0, 0]}
          spin={true}
        />
      </Canvas>
    </motion.div>
  );
};

// Icon set for navigation with predefined shapes
export const NavigationIcon3D = ({ 
  icon, 
  label, 
  active = false, 
  onClick, 
  size = 60,
  ...props 
}) => {
  // Map common icons to 3D shapes
  const iconShapeMap = {
    home: 'roundedbox',
    dashboard: 'octahedron',
    contacts: 'sphere',
    deals: 'torus',
    settings: 'torus',
    tasks: 'box',
    calendar: 'roundedbox',
    reports: 'octahedron',
    default: 'sphere'
  };

  const shape = iconShapeMap[icon] || iconShapeMap.default;
  const color = active ? '#6366F1' : '#94A3B8';
  const hoverColor = active ? '#818CF8' : '#64748B';

  return (
    <div className="flex flex-col items-center">
      <Icon3D
        shape={shape}
        size={size}
        color={color}
        hoverColor={hoverColor}
        onClick={onClick}
        className="mb-2"
        {...props}
      />
      <span className={cn(
        'text-sm font-medium',
        active ? 'text-primary' : 'text-gray-500'
      )}>
        {label}
      </span>
    </div>
  );
};

export default Icon3D;
