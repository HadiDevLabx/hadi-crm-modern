import React from 'react';
import { motion } from 'framer-motion';
import { FiActivity, FiBarChart2, FiDatabase, FiGrid, FiPieChart, FiTrendingUp } from 'react-icons/fi';

const Particles = ({ count = 20 }) => {
  // Create an array of random particles
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 6 + 2,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 5,
  }));
  
  return (
    <div className="particles">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.3, 0],
            scale: [0, 1, 0],
            y: [0, -50, -100],
            x: [0, Math.random() * 20 - 10, Math.random() * 40 - 20],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

const FloatingIcons = () => {
  const icons = [
    { Icon: FiActivity, delay: 0, x: '20%', y: '20%', size: 32 },
    { Icon: FiBarChart2, delay: 0.7, x: '80%', y: '15%', size: 28 },
    { Icon: FiDatabase, delay: 1.2, x: '75%', y: '70%', size: 30 },
    { Icon: FiGrid, delay: 0.5, x: '15%', y: '65%', size: 26 },
    { Icon: FiPieChart, delay: 1.7, x: '50%', y: '80%', size: 34 },
    { Icon: FiTrendingUp, delay: 0.9, x: '30%', y: '40%', size: 32 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map((item, index) => {
        const { Icon, delay, x, y, size } = item;
        return (
          <motion.div
            key={index}
            className="absolute text-white/20"
            style={{ left: x, top: y, width: size, height: size }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 0.7, 
              scale: 1,
              y: [0, -10, 0, -5, 0],
              rotate: [0, 10, -10, 5, 0]
            }}
            transition={{
              opacity: { duration: 0.5, delay },
              scale: { duration: 0.8, delay },
              y: { repeat: Infinity, duration: 5 + index, repeatType: "reverse" },
              rotate: { repeat: Infinity, duration: 7 + index, repeatType: "reverse" }
            }}
          >
            <Icon size={size} />
          </motion.div>
        );
      })}
    </div>
  );
};

export { Particles, FloatingIcons };

