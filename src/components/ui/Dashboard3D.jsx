import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, PerspectiveCamera, Html, useHelper } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/shadcn-utils';
import { useGSAPStagger } from '../../utils/gsap-animations';
import Chart from './Chart';

// Dashboard Panel component
const DashboardPanel = ({
  width = 4,
  height = 3,
  depth = 0.1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  color = '#ffffff',
  title,
  children,
  ...props
}) => {
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);
  const meshRef = useRef();
  
  // Spotlight on hover
  const spotlightRef = useRef();
  useHelper(hovered ? spotlightRef : null, THREE.SpotLightHelper, 'red');

  // Panel animation
  useFrame(() => {
    if (!meshRef.current) return;
    
    // Subtle floating animation
    meshRef.current.position.y = position[1] + Math.sin(Date.now() * 0.001) * 0.05;
    
    // Hover effect
    meshRef.current.material.color.lerp(
      new THREE.Color(hovered ? '#f0f0f0' : color),
      0.1
    );
  });

  // Handle click to zoom in
  const handleClick = () => {
    setActive(!active);
  };

  return (
    <group position={position} rotation={rotation} {...props}>
      {/* Spotlight for hover effect */}
      <spotLight
        ref={spotlightRef}
        position={[0, 3, 0]}
        angle={0.3}
        penumbra={0.5}
        intensity={hovered ? 1 : 0}
        distance={10}
        castShadow
        color="#ffffff"
      />
      
      {/* Panel mesh */}
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.1}
          roughness={0.2}
          envMapIntensity={1}
        />
        
        {/* Panel title */}
        <Text
          position={[0, height / 2 - 0.3, depth / 2 + 0.01]}
          fontSize={0.2}
          color="#1f2937"
          anchorX="center"
          anchorY="middle"
          maxWidth={width - 0.2}
        >
          {title || 'Dashboard Panel'}
        </Text>
        
        {/* Panel content */}
        <Html
          transform
          distanceFactor={1.5}
          position={[0, 0, depth / 2 + 0.01]}
          style={{
            width: `${width * 10}em`,
            height: `${height * 10}em`,
            padding: '0.5em',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: 0.9
          }}
        >
          <div className="w-full h-full overflow-hidden bg-white bg-opacity-90 rounded-lg shadow-inner flex items-center justify-center p-2">
            {children}
          </div>
        </Html>
      </mesh>
      
      {/* Expanded view when active */}
      {active && (
        <Html
          zIndexRange={[100, 0]}
          position={[0, 0, 2]}
          style={{
            width: '500px',
            height: '400px'
          }}
        >
          <div className="bg-white rounded-lg shadow-xl p-4 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{title || 'Dashboard Panel'}</h2>
              <button 
                className="p-1 rounded-full hover:bg-gray-100" 
                onClick={() => setActive(false)}
              >
                ✕
              </button>
            </div>
            <div className="overflow-auto h-[calc(100%-40px)]">
              {children}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

// Scene setup with camera controls
const Scene = ({ children }) => {
  const { camera } = useThree();
  const cameraRef = useRef(camera);
  
  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.lookAt(0, 0, 0);
    }
  }, []);

  return children;
};

// Container component for the 3D Dashboard
export const Dashboard3D = ({
  className,
  style,
  height = 600,
  backgroundColor = 'transparent',
  children,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn('relative overflow-hidden rounded-lg', className)}
      style={{ 
        height, 
        backgroundColor,
        ...style 
      }}
      {...props}
    >
      <Canvas shadows dpr={[1, 2]}>
        <fog attach="fog" args={['#f0f0f0', 10, 20]} />
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <PerspectiveCamera makeDefault position={[0, 1, 7]} fov={50} />
        <Scene>
          {children}
          
          {/* Ground/Floor */}
          <mesh 
            rotation={[-Math.PI / 2, 0, 0]} 
            position={[0, -2, 0]} 
            receiveShadow
          >
            <planeGeometry args={[50, 50]} />
            <shadowMaterial transparent opacity={0.2} />
          </mesh>
        </Scene>
      </Canvas>
    </motion.div>
  );
};

// Demo layout for the dashboard
export const Dashboard3DDemo = () => {
  // Sample data for charts
  const salesData = [
    { month: 'Jan', value: 1200 },
    { month: 'Feb', value: 1900 },
    { month: 'Mar', value: 1300 },
    { month: 'Apr', value: 1700 },
    { month: 'May', value: 1500 },
    { month: 'Jun', value: 2300 },
  ];
  
  const pieData = [
    { name: 'Product A', value: 400 },
    { name: 'Product B', value: 300 },
    { name: 'Product C', value: 200 },
    { name: 'Product D', value: 100 },
  ];
  
  // Use GSAP for staggered animation of panels
  const containerRef = useGSAPStagger({
    y: 0,
    opacity: 1,
    stagger: 0.1,
    duration: 1,
    ease: 'power3.out',
    from: { y: 20, opacity: 0 },
  }, '.panel-item');

  return (
    <div ref={containerRef} className="w-full">
      <Dashboard3D height={600} className="w-full bg-gray-50">
        {/* Sales Chart Panel */}
        <DashboardPanel 
          position={[-3, 0, 0]} 
          rotation={[0, Math.PI * 0.05, 0]}
          width={3.5}
          height={2.5}
          title="Sales Performance"
          className="panel-item"
        >
          <Chart
            type="line"
            data={salesData}
            xAxisKey="month"
            series={[{ dataKey: 'value', name: 'Sales' }]}
            height={220}
          />
        </DashboardPanel>
        
        {/* KPI Stats Panel */}
        <DashboardPanel 
          position={[0, 0.5, 0]} 
          width={3}
          height={2}
          title="Key Metrics"
          className="panel-item"
        >
          <div className="grid grid-cols-2 gap-3 w-full h-full">
            <div className="flex flex-col items-center justify-center bg-blue-50 rounded-lg p-2">
              <div className="text-blue-500 font-bold text-2xl">$245K</div>
              <div className="text-gray-600 text-xs">Revenue</div>
            </div>
            <div className="flex flex-col items-center justify-center bg-green-50 rounded-lg p-2">
              <div className="text-green-500 font-bold text-2xl">+18%</div>
              <div className="text-gray-600 text-xs">Growth</div>
            </div>
            <div className="flex flex-col items-center justify-center bg-purple-50 rounded-lg p-2">
              <div className="text-purple-500 font-bold text-2xl">68</div>
              <div className="text-gray-600 text-xs">New Deals</div>
            </div>
            <div className="flex flex-col items-center justify-center bg-yellow-50 rounded-lg p-2">
              <div className="text-yellow-500 font-bold text-2xl">82%</div>
              <div className="text-gray-600 text-xs">Satisfaction</div>
            </div>
          </div>
        </DashboardPanel>
        
        {/* Product Distribution Panel */}
        <DashboardPanel 
          position={[3, -0.3, 0]} 
          rotation={[0, -Math.PI * 0.05, 0]}
          width={3}
          height={2.5}
          title="Product Distribution"
          className="panel-item"
        >
          <Chart
            type="pie"
            data={pieData}
            xAxisKey="name"
            series={[{ dataKey: 'value', name: 'Sales' }]}
            height={220}
          />
        </DashboardPanel>
      </Dashboard3D>
    </div>
  );
};

export default Dashboard3D;

