import React from 'react';
import { motion } from 'framer-motion';

/**
 * BackgroundDecoration component adds animated decorative elements to a page background
 * Provides floating shapes with customizable animations
 */
export const BackgroundDecoration = () => {
  const shapes = [
    {
      type: 'circle',
      size: 15,
      color: 'rgba(59, 130, 246, 0.5)', // blue
      position: { top: '15%', left: '10%' },
      animation: {
        y: [-10, 10, -10],
        rotate: [0, 180, 360, 180, 0],
        scale: [1, 1.2, 1],
      }
    },
    {
      type: 'circle',
      size: 25,
      color: 'rgba(139, 92, 246, 0.3)', // purple
      position: { top: '60%', left: '5%' },
      animation: {
        y: [0, 15, 0],
        x: [0, -10, 0],
        scale: [1, 0.8, 1],
      }
    },
    {
      type: 'square',
      size: 20,
      color: 'rgba(16, 185, 129, 0.4)', // green
      position: { top: '25%', right: '15%' },
      animation: {
        rotate: [0, 90, 180, 270, 360],
        scale: [1, 1.1, 1],
      }
    },
    {
      type: 'triangle',
      size: 25,
      color: 'rgba(244, 114, 182, 0.3)', // pink
      position: { bottom: '20%', right: '8%' },
      animation: {
        y: [0, -20, 0],
        rotate: [0, -180, 0],
        scale: [1, 0.9, 1],
      }
    },
    {
      type: 'donut',
      size: 28,
      thickness: 4,
      color: 'rgba(245, 158, 11, 0.4)', // amber
      position: { bottom: '30%', left: '20%' },
      animation: {
        rotate: [0, 360],
        scale: [1, 1.2, 1],
      }
    },
    {
      type: 'circle',
      size: 8,
      color: 'rgba(236, 72, 153, 0.5)', // pink-600
      position: { top: '40%', right: '25%' },
      animation: {
        y: [0, 30, 0],
        x: [0, 15, 0],
      }
    },
    {
      type: 'square',
      size: 12,
      color: 'rgba(6, 182, 212, 0.4)', // cyan-500
      position: { top: '80%', right: '40%' },
      animation: {
        rotate: [45, 0, 45],
        scale: [1, 1.3, 1],
      }
    },
  ];

  const renderShape = (shape) => {
    switch (shape.type) {
      case 'circle':
        return (
          <motion.div
            className="rounded-full absolute"
            style={{
              width: `${shape.size}px`,
              height: `${shape.size}px`,
              backgroundColor: shape.color,
              ...shape.position,
              zIndex: 0,
            }}
            animate={shape.animation}
            transition={{
              repeat: Infinity,
              duration: 8 + Math.random() * 10,
              ease: 'easeInOut',
              repeatType: 'reverse',
            }}
          />
        );
      case 'square':
        return (
          <motion.div
            className="absolute"
            style={{
              width: `${shape.size}px`,
              height: `${shape.size}px`,
              backgroundColor: shape.color,
              borderRadius: '2px',
              ...shape.position,
              zIndex: 0,
            }}
            animate={shape.animation}
            transition={{
              repeat: Infinity,
              duration: 12 + Math.random() * 10,
              ease: 'easeInOut',
              repeatType: 'reverse',
            }}
          />
        );
      case 'triangle':
        return (
          <motion.div
            className="absolute"
            style={{
              width: 0,
              height: 0,
              borderLeft: `${shape.size / 2}px solid transparent`,
              borderRight: `${shape.size / 2}px solid transparent`,
              borderBottom: `${shape.size}px solid ${shape.color}`,
              ...shape.position,
              zIndex: 0,
            }}
            animate={shape.animation}
            transition={{
              repeat: Infinity,
              duration: 15 + Math.random() * 10,
              ease: 'easeInOut',
              repeatType: 'reverse',
            }}
          />
        );
      case 'donut':
        return (
          <motion.div
            className="absolute rounded-full"
            style={{
              width: `${shape.size}px`,
              height: `${shape.size}px`,
              border: `${shape.thickness}px solid ${shape.color}`,
              ...shape.position,
              zIndex: 0,
            }}
            animate={shape.animation}
            transition={{
              repeat: Infinity,
              duration: 20 + Math.random() * 10,
              ease: 'linear',
              repeatType: 'loop',
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {shapes.map((shape, index) => (
        <React.Fragment key={index}>
          {renderShape(shape)}
        </React.Fragment>
      ))}
      
      {/* Add glowing blobs with blur effect */}
      <div className="fixed top-[20%] right-[10%] w-64 h-64 bg-blue-400 rounded-full opacity-10 blur-3xl" />
      <div className="fixed bottom-[30%] left-[20%] w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-3xl" />
      <div className="fixed top-[60%] right-[30%] w-48 h-48 bg-emerald-400 rounded-full opacity-10 blur-3xl" />
    </div>
  );
};

export default BackgroundDecoration;

