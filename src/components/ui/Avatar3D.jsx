import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import { motion } from 'framer-motion';
import { cn } from '../../utils/shadcn-utils';

// Default 3D model path - you would replace this with your own models
const DEFAULT_AVATAR_PATH = '/models/default-avatar.glb';

const Avatar3DModel = ({ 
  modelPath = DEFAULT_AVATAR_PATH,
  scale = 2, 
  position = [0, -1, 0],
  rotation = [0, 0, 0],
  color = '#3B82F6',
  onLoad,
  ...props
}) => {
  const groupRef = useRef();
  let model;
  
  try {
    model = useGLTF(modelPath);
    
    useEffect(() => {
      if (onLoad && model) {
        onLoad(model);
      }
    }, [model]);

  } catch (error) {
    console.error('Error loading 3D model:', error);
    // Return a simple sphere as a fallback
    return (
      <mesh position={position} rotation={rotation} scale={[scale, scale, scale]} {...props}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>
    );
  }

  // If we have a model, return it
  if (model) {
    return (
      <group ref={groupRef} position={position} rotation={rotation} scale={[scale, scale, scale]} {...props}>
        <primitive object={model.scene} />
      </group>
    );
  }
  
  return null;
};

// The container component for the 3D Avatar
export const Avatar3D = ({ 
  className,
  style,
  size = 200,
  modelPath,
  autoRotate = true,
  showControls = true,
  backgroundColor = 'transparent',
  intensity = 0.5,
  shadow = true,
  fallbackImage,
  onLoad,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Handle model loading
  const handleModelLoad = (model) => {
    setIsLoaded(true);
    if (onLoad) onLoad(model);
  };

  // Handle error loading model
  const handleModelError = () => {
    setHasError(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn('relative overflow-hidden rounded-full', className)}
      style={{ 
        width: size, 
        height: size, 
        backgroundColor,
        ...style 
      }}
      {...props}
    >
      {/* Fallback image for errors */}
      {hasError && fallbackImage && (
        <img 
          src={fallbackImage} 
          alt="Avatar" 
          className="w-full h-full object-cover"
          onError={() => console.error('Error loading fallback image')}
        />
      )}
      
      {/* 3D Canvas */}
      {!hasError && (
        <Canvas 
          camera={{ position: [0, 0, 4], fov: 50 }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
        >
          <ambientLight intensity={intensity} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <directionalLight position={[0, 10, 5]} intensity={1} castShadow />
          
          {/* The 3D avatar model */}
          <Avatar3DModel 
            modelPath={modelPath}
            onLoad={handleModelLoad}
            onError={handleModelError}
            position={[0, -1, 0]}
            rotation={[0, 0, 0]}
            scale={2}
          />
          
          {/* Environment, shadows and controls */}
          <Environment preset="city" />
          {shadow && <ContactShadows opacity={0.6} scale={5} blur={3} />}
          {showControls && (
            <OrbitControls 
              enableZoom={false}
              enablePan={false}
              minPolarAngle={Math.PI / 2 - 0.5}
              maxPolarAngle={Math.PI / 2 + 0.5}
              autoRotate={autoRotate}
              autoRotateSpeed={1}
            />
          )}
        </Canvas>
      )}
      
      {/* Loading indicator */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 bg-opacity-50 dark:bg-opacity-50">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </motion.div>
  );
};

export default Avatar3D;

