import React, { useRef, useEffect, useState } from 'react';
import lottie from 'lottie-web';
import { cn } from '../../utils/cn';

const LottieAnimation = ({
  animationData,
  path,
  loop = true,
  autoplay = true,
  renderer = 'svg',
  className,
  containerClassName,
  onComplete,
  onLoopComplete,
  speed = 1,
  direction = 1,
  segments,
  controls = false,
  playOnHover = false,
  style,
  ...props
}) => {
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize animation
    const loadAnimation = async () => {
      try {
        // Handle different data sources
        let animData = animationData;

        // If path is provided and no animation data, fetch from path
        if (!animData && path) {
          const response = await fetch(path);
          if (!response.ok) {
            throw new Error(`Failed to load animation from path: ${path}`);
          }
          animData = await response.json();
        }

        if (!animData) {
          throw new Error('No animation data provided');
        }

        // Initialize lottie animation
        animationRef.current = lottie.loadAnimation({
          container: containerRef.current,
          renderer,
          loop,
          autoplay,
          animationData: animData,
        });

        // Set up event listeners
        animationRef.current.addEventListener('DOMLoaded', () => {
          setLoaded(true);
          
          // Apply initial settings
          animationRef.current.setSpeed(speed);
          animationRef.current.setDirection(direction);
          
          if (segments) {
            animationRef.current.playSegments(segments, true);
          }
        });

        if (onComplete) {
          animationRef.current.addEventListener('complete', onComplete);
        }

        if (onLoopComplete) {
          animationRef.current.addEventListener('loopComplete', onLoopComplete);
        }
      } catch (error) {
        console.error('Error loading Lottie animation:', error);
        setLoadError(error.message);
      }
    };

    loadAnimation();

    // Clean up
    return () => {
      if (animationRef.current) {
        animationRef.current.destroy();
        animationRef.current = null;
      }
    };
  }, [animationData, path, loop, autoplay, renderer, segments]);

  // Handle speed changes
  useEffect(() => {
    if (animationRef.current) {
      animationRef.current.setSpeed(speed);
    }
  }, [speed]);

  // Handle direction changes
  useEffect(() => {
    if (animationRef.current) {
      animationRef.current.setDirection(direction);
    }
  }, [direction]);

  // Play/pause controls
  const handlePlay = () => {
    if (animationRef.current) {
      animationRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (animationRef.current) {
      animationRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    if (animationRef.current) {
      animationRef.current.stop();
      setIsPlaying(false);
    }
  };

  const handleHoverStart = () => {
    if (playOnHover && animationRef.current) {
      animationRef.current.play();
    }
  };

  const handleHoverEnd = () => {
    if (playOnHover && animationRef.current) {
      animationRef.current.stop();
    }
  };

  return (
    <div 
      className={cn("relative", containerClassName)}
      style={style} 
      {...props}
    >
      <div 
        ref={containerRef} 
        className={cn(
          "w-full h-full",
          playOnHover && "cursor-pointer",
          className
        )}
        onMouseEnter={playOnHover ? handleHoverStart : undefined}
        onMouseLeave={playOnHover ? handleHoverEnd : undefined}
      />
      
      {loadError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded">
          <p className="text-sm text-red-500">Failed to load animation</p>
        </div>
      )}

      {controls && loaded && (
        <div className="mt-2 flex justify-center space-x-2">
          <button
            type="button"
            onClick={isPlaying ? handlePause : handlePlay}
            className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            type="button"
            onClick={handleStop}
            className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Stop
          </button>
        </div>
      )}
    </div>
  );
};

export default LottieAnimation;

