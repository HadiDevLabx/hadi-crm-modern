import React, { useState, Suspense, useRef, useEffect, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { Canvas } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/web';
import { Environment, Float, OrbitControls, useAnimations, Stars } from '@react-three/drei';
import BackgroundDecoration from 'components/ui/BackgroundDecoration';
import LottieAnimation from 'components/ui/LottieAnimation';
import Tilt from 'react-parallax-tilt';
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiShield, 
         FiActivity, FiBarChart2, FiGrid, FiCpu, FiDatabase, 
         FiTrendingUp, FiSend, FiKey, FiRefreshCw } from 'react-icons/fi';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import '../../styles/login.css';

// Lazy load components
const FloatingIcons = lazy(() => import('components/ui/LoginEffects').then(module => ({ default: module.FloatingIcons })));
const Particles = lazy(() => import('components/ui/LoginEffects').then(module => ({ default: module.Particles })));

// 3D Avatar component using a simplified geometry
const Avatar3D = () => {
  const group = useRef();
  
  // Animation with GSAP
  useEffect(() => {
    if (group.current) {
      // Initial animation
      gsap.fromTo(
        group.current.position,
        { y: -10 },
        { y: 0, duration: 1.5, ease: "elastic.out(1, 0.3)" }
      );
      
      // Continuous floating animation
      gsap.to(group.current.rotation, {
        y: Math.PI * 2,
        duration: 20,
        repeat: -1,
        ease: "none"
      });
      
      gsap.to(group.current.position, {
        y: "+=0.2",
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }
  }, []);

  return (
    <group ref={group}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        {/* Head */}
        <mesh position={[0, 2, 0]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color="#4f46e5" metalness={0.5} roughness={0.3} />
        </mesh>
        
        {/* Body */}
        <mesh position={[0, 0, 0]}>
          <capsuleGeometry args={[1.2, 2, 8, 16]} />
          <meshStandardMaterial color="#8b5cf6" metalness={0.4} roughness={0.3} />
        </mesh>
        
        {/* Eyes */}
        <mesh position={[0.4, 2.3, 0.8]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.2} />
        </mesh>
        <mesh position={[-0.4, 2.3, 0.8]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.2} />
        </mesh>
        
        {/* Pupils */}
        <mesh position={[0.4, 2.3, 0.95]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="black" />
        </mesh>
        <mesh position={[-0.4, 2.3, 0.95]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="black" />
        </mesh>
        
        {/* Accessories - Holographic display */}
        <mesh position={[1.8, 2, 0]} rotation={[0, -Math.PI/4, 0]}>
          <planeGeometry args={[1.5, 1, 6, 6]} />
          <meshStandardMaterial color="#4f46e5" transparent opacity={0.3} emissive="#4f46e5" emissiveIntensity={0.5} />
        </mesh>
      </Float>
      
      {/* Add stars for ambient effect */}
      <Stars radius={30} depth={60} count={1000} factor={4} saturation={0} fade speed={1} />
    </group>
  );
};

// Scene wrapper for the avatar
const AvatarScene = () => {
  return (
    <Canvas camera={{ position: [0, 2, 6], fov: 45 }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <Suspense fallback={null}>
        <Avatar3D />
        <Environment preset="sunset" />
        <OrbitControls 
          enableZoom={false} 
          autoRotate={true}
          autoRotateSpeed={0.5}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Suspense>
    </Canvas>
  );
};

// Animated background gradient component using react-spring
const AnimatedBackground = () => {
  const props = useSpring({
    from: { background: 'linear-gradient(120deg, #34d399 0%, #3b82f6 100%)' },
    to: async (next) => {
      while (true) {
        await next({ background: 'linear-gradient(120deg, #3b82f6 0%, #8b5cf6 100%)' });
        await next({ background: 'linear-gradient(120deg, #8b5cf6 0%, #10b981 100%)' });
        await next({ background: 'linear-gradient(120deg, #10b981 0%, #3b82f6 100%)' });
      }
    },
    config: { duration: 8000 },
  });

  return (
    <animated.div
      style={{
        ...props,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
      }}
    />
  );
};

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [webGLAvailable, setWebGLAvailable] = useState(true);
  const [useAvatar3D, setUseAvatar3D] = useState(true);
  const [currentAnimation, setCurrentAnimation] = useState('crm-avatar');
  const [errors, setErrors] = useState({});
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const canvasRef = useRef();
  const loginCardRef = useRef();
  const formRef = useRef();
  
  // Function to toggle between 3D avatar and Lottie animations
  const toggleAvatarType = () => {
    setUseAvatar3D(prev => !prev);
  };
  
  // Add GSAP animations for the form elements
  useEffect(() => {
    if (loginCardRef.current) {
      // Create a glowing effect on the card
      gsap.to(loginCardRef.current, {
        boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }
  }, []);

  // Check if WebGL is available when component mounts
  React.useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setWebGLAvailable(!!gl);
    } catch (e) {
      setWebGLAvailable(false);
    }
  }, []);
  
  // Load remembered email if available
  React.useEffect(() => {
    const rememberedEmail = localStorage.getItem('hadi_crm_remembered_email');
    if (rememberedEmail) {
      setFormData(prev => ({
        ...prev,
        email: rememberedEmail,
        rememberMe: true
      }));
    }
  }, []);
  
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };
  
  const formVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    show: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        delay: 0.3,
        duration: 0.5
      }
    }
  };
  
  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1 },
    hover: { 
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(16, 185, 129, 0.3)",
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }
    },
    tap: { scale: 0.95 }
  };
  
  const logoVariants = {
    hidden: { scale: 0, rotate: -180 },
    show: { 
      scale: 1, 
      rotate: 0,
      transition: { 
        type: "spring", 
        stiffness: 200,
        damping: 20,
        duration: 1
      }
    }
  };

  // Mock credentials for different user types
  const mockCredentials = [
    { email: 'sales.rep@hadi-crm.com', password: 'SalesRep123!', role: 'Sales Representative' },
    { email: 'sales.manager@hadi-crm.com', password: 'Manager456!', role: 'Sales Manager' },
    { email: 'sales.director@hadi-crm.com', password: 'Director789!', role: 'Sales Director' },
    { email: 'admin@hadi-crm.com', password: 'Admin2024!', role: 'System Administrator' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Shake animation for form validation errors
      if (formRef.current) {
        gsap.to(formRef.current, {
          x: [-10, 10, -10, 10, 0],
          duration: 0.5,
          ease: "power2.out"
        });
      }
      return;
    }

    if (failedAttempts >= 3) {
      setErrors({ general: 'Too many failed attempts. Please try again later.' });
      // More pronounced shake for security lockout
      if (formRef.current) {
        gsap.to(formRef.current, {
          x: [-15, 15, -15, 15, -10, 10, 0],
          duration: 0.7,
          ease: "power2.out"
        });
      }
      return;
    }

    setIsLoading(true);
    setErrors({});

    // Simulate API call delay
    setTimeout(() => {
      const validCredential = mockCredentials.find(
        cred => cred.email === formData.email && cred.password === formData.password
      );

      if (validCredential) {
        // Store user info in localStorage for demo purposes
        const userData = {
          email: validCredential.email,
          role: validCredential.role,
          loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('hadi_crm_user', JSON.stringify(userData));
        
        // If remember me is checked, store the email (but not password for security)
        if (formData.rememberMe) {
          localStorage.setItem('hadi_crm_remembered_email', formData.email);
        } else {
          localStorage.removeItem('hadi_crm_remembered_email');
        }
        
        setFailedAttempts(0);
        
        // Success animation before redirect
        if (loginCardRef.current) {
          gsap.to(loginCardRef.current, {
            y: -20,
            opacity: 0,
            duration: 0.5,
            ease: "power3.out",
            onComplete: () => navigate('/sales-dashboard')
          });
        } else {
          navigate('/sales-dashboard');
        }
      } else {
        setFailedAttempts(prev => prev + 1);
        
        // Error animation for invalid credentials
        if (formRef.current) {
          gsap.to(formRef.current, {
            x: [-10, 10, -10, 10, -5, 5, 0],
            duration: 0.6,
            ease: "power2.out"
          });
        }
        setErrors({ 
          general: `Invalid email or password. ${3 - failedAttempts - 1} attempts remaining.` 
        });
      }
      
      setIsLoading(false);
    }, 1500);
  };

  const handleForgotPassword = () => {
    alert('Password reset functionality would be implemented here. For demo, use the provided mock credentials.');
  };

  return (
    <div className="login-container min-h-screen flex flex-col md:flex-row items-stretch overflow-hidden relative">
      {/* Animated background gradient */}
      <AnimatedBackground />
      
      {/* Import Particles and FloatingIcons from LoginEffects.jsx */}
      <Suspense fallback={null}>
        <FloatingIcons />
        <Particles />
      </Suspense>
      
      {/* Left panel with 3D Avatar or Lottie Animation */}
      <div className="avatar-container w-full md:w-1/2 h-80 sm:h-96 md:h-auto relative z-0 overflow-hidden order-2 md:order-1">
        {/* Overlay graphic elements */}
        <div className="noise-texture"></div>
        <div className="grid-pattern"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-violet-600/5 to-purple-600/10"></div>
        {/* Show only one Lottie animation using DotLottieReact at the top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 flex items-start justify-center w-full">
          <div className="w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] md:w-[620px] md:h-[620px]">
            <DotLottieReact
              src="https://lottie.host/12fca160-f65d-4341-9692-e1fd3e11e1e1/Osfgski51c.lottie"
              loop
              autoplay
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </div>
        
        {/* Overlay with brand info */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent pt-24 pb-8 px-8 text-white"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <motion.div
            className="flex items-center gap-4 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="bg-gradient-to-br from-indigo-600 to-violet-500 p-2 rounded-xl">
              <FiActivity className="text-white h-6 w-6" />
            </div>
            <div className="h-px flex-grow bg-gradient-to-r from-white/50 to-transparent"></div>
          </motion.div>
          
          <motion.h2 
            className="text-3xl md:text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-white"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            Welcome to Hadi CRM Sales
          </motion.h2>
          
          <motion.p 
            className="text-lg opacity-90 max-w-md"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
          >
            <span className="text-indigo-300 font-semibold">Boost your sales performance</span> with our powerful CRM solution.
            <span className="block mt-2 text-sm opacity-80 leading-relaxed">Track leads, manage contacts, and close more deals with our comprehensive suite of tools.</span>
          </motion.p>
          
          {/* Feature badges */}
          <motion.div 
            className="flex gap-3 mt-6 flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <motion.span 
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-xs"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
            >
              <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
              Real-time Analytics
            </motion.span>
            <motion.span 
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-xs"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
            >
              <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse"></span>
              Smart Automation
            </motion.span>
            <motion.span 
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-xs"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
            >
              <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse"></span>
              Pipeline Management
            </motion.span>
          </motion.div>
          
          {/* Feature buttons */}
          <motion.div 
            className="mt-6 flex items-center space-x-3 flex-wrap gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
          >
            {['Contacts', 'Deals', 'Analytics', 'Tasks', 'Reports', 'Forecasts'].map((item, i) => (
              <motion.div
                key={item}
                className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium backdrop-blur-sm border border-white/10"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5 + (i * 0.1) }}
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: 'rgba(255,255,255,0.2)'
                }}
              >
                {item}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
      
      {/* Right panel with login form */}
      <motion.div 
        className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8 lg:p-12 z-10 order-1 md:order-2 min-h-[40vh] md:min-h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Tilt
          className="w-full max-w-md"
          tiltMaxAngleX={5}
          tiltMaxAngleY={5}
          perspective={1000}
          transitionSpeed={1500}
          scale={1.02}
          gyroscope={true}
        >
        {/* Logo and Branding */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.img 
            src="/assets/images/hadi-crm-logo.svg" 
            alt="Hadi CRM Sales Logo" 
            className="h-16 w-auto mx-auto mb-4"
            variants={logoVariants}
            initial="hidden"
            animate="show"
            whileHover={{ 
              rotate: [0, -5, 5, -5, 0], 
              scale: 1.1,
              transition: { duration: 0.5 } 
            }}
          />
          <motion.h1 
            className="text-3xl font-bold text-text-primary font-heading mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            Hadi CRM Sales
          </motion.h1>
          <motion.p 
            className="text-text-secondary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            Sign in to your account
          </motion.p>
        </motion.div>

        {/* Login Card */}
        <motion.div 
          className="card p-8 shadow-2xl bg-white/90 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/30"
          ref={loginCardRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            boxShadow: [
              "0 10px 25px -5px rgba(59, 130, 246, 0.3), 0 8px 10px -6px rgba(59, 130, 246, 0.2)",
              "0 15px 35px -5px rgba(139, 92, 246, 0.35), 0 10px 15px -3px rgba(139, 92, 246, 0.2)",
              "0 10px 25px -5px rgba(59, 130, 246, 0.3), 0 8px 10px -6px rgba(59, 130, 246, 0.2)"
            ]
          }}
          transition={{ 
            delay: 0.3, 
            duration: 1.5, 
            type: "spring", 
            stiffness: 100,
            boxShadow: {
              repeat: Infinity,
              repeatType: "reverse",
              duration: 3
            }
          }}
          whileHover={{ 
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.3)",
            scale: 1.02,
            transition: { type: "spring", stiffness: 300, damping: 10 }
          }}
        >
          <motion.form 
            ref={formRef}
            onSubmit={handleSubmit} 
            className="space-y-6"
            variants={formVariants}
            initial="hidden"
            animate="show"
          >
            {/* General Error Message */}
            <AnimatePresence>
              {errors.general && (
                <motion.div 
                  className="bg-error-50 border border-error-200 rounded-lg p-4 flex items-center space-x-3"
                  initial={{ opacity: 0, x: -20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: "auto" }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Icon name="AlertCircle" size={20} className="text-error flex-shrink-0" />
                  <span className="text-error text-sm">{errors.general}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Field */}
            <motion.div variants={itemVariants}>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2 flex items-center">
                <FiMail className="mr-2 text-indigo-500" />
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={formData.email ? { rotate: [0, -10, 10, -10, 0] } : {}}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <FiMail size={20} className="text-indigo-500" />
                  </motion.div>
                </div>
                <div className="relative">
                  <motion.input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`input-field pl-10 pr-10 w-full py-3 rounded-lg border ${errors.email ? 'border-error focus:ring-error focus:border-error' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} shadow-sm focus:ring-2 focus:ring-opacity-50 transition-all duration-200`}
                    placeholder="Enter your email"
                    disabled={isLoading}
                    whileFocus={{ 
                      scale: 1.01, 
                      boxShadow: "0px 0px 8px rgba(30, 58, 138, 0.2)",
                      transition: { type: "spring", stiffness: 300, damping: 10 }
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    onFocus={() => {
                      if (loginCardRef.current) {
                        gsap.to(loginCardRef.current, {
                          boxShadow: '0 0 25px rgba(37, 99, 235, 0.5)',
                          duration: 0.4,
                        });
                      }
                    }}
                    onBlur={() => {
                      if (loginCardRef.current) {
                        gsap.to(loginCardRef.current, {
                          boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
                          duration: 0.4,
                        });
                      }
                    }}
                  />
                  
                  {/* Animated border effect when typing */}
                  {formData.email && (
                    <motion.div 
                      className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-blue-400 to-purple-500"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  
                  {/* Clear button */}
                  {formData.email && (
                    <motion.button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, email: '' }))}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.7 }}
                      whileHover={{ opacity: 1, scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FiRefreshCw size={16} className="text-gray-400" />
                    </motion.button>
                  )}
                </div>
              </div>
              <AnimatePresence>
                {errors.email && (
                  <motion.p 
                    className="mt-1 text-sm text-error flex items-center space-x-1"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon name="AlertCircle" size={16} />
                    <span>{errors.email}</span>
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Password Field */}
            <motion.div variants={itemVariants}>
              <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2 flex items-center">
                <FiKey className="mr-2 text-indigo-500" />
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={formData.password ? { rotate: [0, -10, 10, -10, 0] } : {}}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <FiLock size={20} className="text-indigo-500" />
                  </motion.div>
                </div>
                <div className="relative">
                  <motion.input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`input-field pl-10 pr-10 w-full py-3 rounded-lg border ${errors.password ? 'border-error focus:ring-error focus:border-error' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'} shadow-sm focus:ring-2 focus:ring-opacity-50 transition-all duration-200`}
                    placeholder="Enter your password"
                    disabled={isLoading}
                    whileFocus={{ 
                      scale: 1.01, 
                      boxShadow: "0px 0px 8px rgba(30, 58, 138, 0.2)",
                      transition: { type: "spring", stiffness: 300, damping: 10 }
                    }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 20,
                      delay: 0.1 
                    }}
                    onFocus={() => {
                      if (loginCardRef.current) {
                        gsap.to(loginCardRef.current, {
                          boxShadow: '0 0 25px rgba(139, 92, 246, 0.5)',
                          duration: 0.4,
                        });
                      }
                    }}
                    onBlur={() => {
                      if (loginCardRef.current) {
                        gsap.to(loginCardRef.current, {
                          boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
                          duration: 0.4,
                        });
                      }
                    }}
                  />
                  
                  {/* Animated strength indicator when typing */}
                  {formData.password && (
                    <motion.div 
                      className={`absolute bottom-0 left-0 h-[2px] ${
                        formData.password.length < 6 
                          ? 'bg-red-400' 
                          : formData.password.length < 10 
                            ? 'bg-yellow-400' 
                            : 'bg-green-400'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${Math.min((formData.password.length / 12) * 100, 100)}%` 
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </div>
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={isLoading}
                  whileHover={{ 
                    scale: 1.2,
                    rotate: [0, 15, -15, 0],
                    transition: { duration: 0.5 }
                  }}
                  whileTap={{ scale: 0.8 }}
                  initial={{ opacity: 0.7 }}
                  animate={{ 
                    opacity: 1,
                    scale: [1, 1.1, 1],
                    transition: { 
                      opacity: { duration: 0.2 },
                      scale: { 
                        duration: 0.4,
                        repeat: 2,
                        repeatType: "reverse"
                      }
                    }
                  }}
                >
                  <motion.div
                    initial={{ scale: 1 }}
                    animate={showPassword ? { 
                      scale: [1, 0, 1],
                      rotateY: [0, 90, 180] 
                    } : { 
                      scale: [1, 0, 1],
                      rotateY: [180, 90, 0] 
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {showPassword ? 
                      <FiEyeOff size={20} className="text-indigo-500" /> : 
                      <FiEye size={20} className="text-gray-400" />
                    }
                  </motion.div>
                </motion.button>
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p 
                    className="mt-1 text-sm text-error flex items-center space-x-1"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon name="AlertCircle" size={16} />
                    <span>{errors.password}</span>
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Remember Me Checkbox */}
            <motion.div 
              className="flex items-center justify-between"
              variants={itemVariants}
            >
              <div className="flex items-center">
                <div className="relative">
                  <motion.input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-border rounded opacity-0 absolute inset-0 cursor-pointer z-10"
                    disabled={isLoading}
                  />
                  <motion.div 
                    className={`h-5 w-5 rounded border-2 flex items-center justify-center ${
                      formData.rememberMe 
                        ? 'bg-primary border-primary' 
                        : 'bg-white border-gray-300'
                    }`}
                    whileHover={{ 
                      scale: 1.1,
                      borderColor: formData.rememberMe ? '#4338ca' : '#6366f1'
                    }}
                    whileTap={{ scale: 0.9 }}
                    initial={false}
                    animate={formData.rememberMe ? {
                      backgroundColor: '#4f46e5',
                      borderColor: '#4338ca',
                      transition: { duration: 0.2 }
                    } : {
                      backgroundColor: '#ffffff',
                      borderColor: '#d1d5db',
                      transition: { duration: 0.2 }
                    }}
                  >
                    <motion.svg 
                      className="w-3 h-3 text-white"
                      initial={{ scale: 0 }}
                      animate={{ 
                        scale: formData.rememberMe ? 1 : 0,
                        opacity: formData.rememberMe ? 1 : 0
                      }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 300, 
                        damping: 20 
                      }}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </motion.svg>
                  </motion.div>
                </div>
                <motion.label 
                  htmlFor="rememberMe" 
                  className="ml-2 block text-sm text-text-secondary cursor-pointer"
                  whileHover={{ color: '#4f46e5' }}
                  animate={{ color: formData.rememberMe ? '#4f46e5' : '#64748b' }}
                  transition={{ duration: 0.2 }}
                >
                  Remember me
                </motion.label>
                
                {/* Ripple effect on click */}
                {formData.rememberMe && (
                  <motion.div
                    className="absolute h-8 w-8 bg-primary rounded-full -z-10"
                    style={{ left: -2, top: -2 }}
                    initial={{ opacity: 0.5, scale: 0 }}
                    animate={{ opacity: 0, scale: 2 }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </div>
              
              <motion.button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-primary hover:text-primary-700 transition-colors duration-150 ease-out relative group"
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Forgot password?
                <motion.div 
                  className="absolute -bottom-0.5 left-0 h-[1px] bg-primary origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.div 
                  className="absolute -right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100"
                  initial={{ x: -5 }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiSend size={12} className="text-primary" />
                </motion.div>
              </motion.button>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading || failedAttempts >= 3}
              className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group h-12 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white font-medium shadow-lg"
              variants={buttonVariants}
              initial="hidden"
              animate="show"
              whileHover="hover"
              whileTap="tap"
              onMouseEnter={() => {
                if (loginCardRef.current) {
                  gsap.to(loginCardRef.current, {
                    boxShadow: '0 0 30px rgba(79, 70, 229, 0.6)',
                    duration: 0.4,
                  });
                }
              }}
              onMouseLeave={() => {
                if (loginCardRef.current) {
                  gsap.to(loginCardRef.current, {
                    boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
                    duration: 0.4,
                  });
                }
              }}
            >
              {/* Animated background gradient for button */}
              <motion.div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                animate={{ 
                  backgroundPosition: ['0% 0%', '100% 100%']
                }}
                transition={{
                  duration: 3,
                  ease: 'linear',
                  repeat: Infinity,
                  repeatType: 'mirror'
                }}
              />
              
              {/* Animated light effect */}
              <motion.div 
                className="absolute inset-0 opacity-0 group-hover:opacity-40"
                initial={{ x: '-100%' }}
                animate={{ x: '200%' }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 0.5,
                  ease: 'easeInOut'
                }}
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)'
                }}
              />
              
              {/* Particles effect on hover */}
              <motion.div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100"
                initial={{ scale: 0 }}
                whileHover={{ scale: 1 }}
              >
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full bg-white"
                    style={{ 
                      left: `${Math.random() * 100}%`, 
                      top: `${Math.random() * 100}%` 
                    }}
                    animate={{
                      scale: [0, 1.5, 0],
                      opacity: [0, 0.8, 0],
                      y: [0, -10 - Math.random() * 20],
                      x: [0, (Math.random() - 0.5) * 20]
                    }}
                    transition={{
                      duration: 1 + Math.random(),
                      repeat: Infinity,
                      repeatDelay: Math.random() * 0.5
                    }}
                  />
                ))}
              </motion.div>
              
              <div className="relative z-10 flex items-center">
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <FiUser size={20} className="mr-2" />
                    <span>Sign In</span>
                  </>
                )}
              </div>
            </motion.button>
          </motion.form>

          {/* Demo Credentials Info */}
          <motion.div 
            className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4, type: "spring", stiffness: 100 }}
            whileHover={{ 
              backgroundColor: "#EFF6FF", 
              scale: 1.02,
              boxShadow: "0px 5px 15px rgba(30, 58, 138, 0.1)",
              transition: { type: "spring", stiffness: 300 }
            }}
          >
            <h3 className="text-sm font-medium text-primary mb-2 flex items-center space-x-2">
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <FiShield size={16} className="mr-2" />
              </motion.div>
              <span>Demo Credentials</span>
            </h3>
            <div className="text-xs text-primary space-y-1">
              {[
                { role: "Sales Rep", email: "sales.rep@hadi-crm.com", password: "SalesRep123!" },
                { role: "Manager", email: "sales.manager@hadi-crm.com", password: "Manager456!" },
                { role: "Director", email: "sales.director@hadi-crm.com", password: "Director789!" },
                { role: "Admin", email: "admin@hadi-crm.com", password: "Admin2024!" }
              ].map((cred, index) => (
                <motion.p 
                  key={cred.role}
                  className="flex flex-col sm:flex-row sm:items-center gap-1 hover:bg-primary-100 p-1 rounded cursor-pointer"
                  whileHover={{ 
                    scale: 1.01,
                    backgroundColor: "rgba(59, 130, 246, 0.1)" 
                  }}
                  onClick={() => {
                    // Autofill credentials on click
                    setFormData(prev => ({
                      ...prev,
                      email: cred.email,
                      password: cred.password
                    }));
                  }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + (index * 0.1), duration: 0.3 }}
                >
                  <strong className="min-w-[80px]">{cred.role}:</strong> 
                  <span className="flex-1">{cred.email} / {cred.password}</span>
                </motion.p>
              ))}
              <motion.p
                className="text-[10px] text-primary-700 mt-1 italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ delay: 1.2 }}
              >
                Click any row to autofill login credentials
              </motion.p>
            </div>
          </motion.div>
        </motion.div>

        {/* WebGL support warning */}
      <AnimatePresence>
        {!webGLAvailable && (
          <motion.div 
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg shadow-lg z-20 max-w-md"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ delay: 1, type: "spring", stiffness: 100 }}
          >
            <div className="flex">
              <FiShield size={20} className="flex-shrink-0 text-yellow-600 mr-2" />
              <div>
                <p className="font-medium text-sm">Limited visual experience</p>
                <p className="text-xs mt-1">Your browser doesn't support WebGL. You're missing out on our enhanced 3D visual experience, but all functionality is still available.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
        <motion.div 
          className="text-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5, type: "spring", stiffness: 100 }}
        >
          <motion.p 
            className="text-sm text-white text-opacity-80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            whileHover={{ 
              scale: 1.05, 
              color: "#ffffff",
              transition: { duration: 0.2 } 
            }}
          >
            © {new Date().getFullYear()} Hadi CRM Sales. All rights reserved.
          </motion.p>
        </motion.div>
      </Tilt>
      </motion.div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
          <motion.div 
            className="bg-surface/90 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20"
            initial={{ scale: 0.8, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <div className="flex flex-col items-center">
              {/* 3D loading animation */}
              <div className="w-20 h-20 relative mb-2">
                <motion.div 
                  className="absolute w-full h-full rounded-full border-4 border-indigo-300 border-opacity-20"
                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div 
                  className="absolute w-full h-full rounded-full border-4 border-indigo-500 border-opacity-50"
                  animate={{ scale: [1.1, 1, 1.1], opacity: [0.8, 0.5, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                />
                <motion.div 
                  className="w-full h-full border-4 border-t-indigo-600 border-r-transparent border-b-indigo-400 border-l-transparent rounded-full"
                  animate={{ rotate: 360 }} 
                  transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                />
                <motion.div 
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: [0, 1, 0.8, 1],
                    rotate: [0, 0, 180, 360],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <FiShield size={28} className="text-indigo-500" />
                </motion.div>
              </div>
              
              {/* Animated text with gradient */}
              <motion.div
                className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 font-bold text-xl mt-4"
                animate={{
                  backgroundPosition: ['0% center', '100% center', '0% center'],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Authenticating...
                </motion.span>
              </motion.div>
              
              <motion.div
                className="flex space-x-1 mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="h-2 w-2 rounded-full bg-indigo-500"
                    animate={{
                      y: [0, -10, 0],
                      backgroundColor: [
                        'rgb(99, 102, 241)',
                        'rgb(139, 92, 246)',
                        'rgb(99, 102, 241)'
                      ],
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </motion.div>
              
              <motion.p
                className="text-text-secondary text-sm mt-4 max-w-xs text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Please wait while we verify your credentials and prepare your workspace
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;