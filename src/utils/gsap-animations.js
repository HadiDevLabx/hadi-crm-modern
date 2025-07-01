import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Hook for basic GSAP animations
 * @param {Object} config - Animation configuration
 * @param {Array} dependencies - Dependencies array for useEffect
 */
export const useGSAP = (config, dependencies = []) => {
  const elementRef = useRef(null);
  
  useEffect(() => {
    const element = elementRef.current;
    let ctx;
    
    if (element) {
      ctx = gsap.context(() => {
        if (typeof config === 'function') {
          config(gsap, element);
        } else {
          gsap.to(element, config);
        }
      }, element);
    }
    
    return () => ctx && ctx.revert();
  }, dependencies);
  
  return elementRef;
};

/**
 * Hook for staggered GSAP animations
 * @param {Object} config - Animation configuration
 * @param {String} childSelector - CSS selector for children
 * @param {Number} staggerAmount - Time between each animation
 * @param {Array} dependencies - Dependencies array for useEffect
 */
export const useGSAPStagger = (config, childSelector, staggerAmount = 0.1, dependencies = []) => {
  const elementRef = useRef(null);
  
  useEffect(() => {
    const element = elementRef.current;
    let ctx;
    
    if (element) {
      ctx = gsap.context(() => {
        const children = element.querySelectorAll(childSelector);
        if (children.length) {
          if (typeof config === 'function') {
            config(gsap, children);
          } else {
            gsap.to(children, {
              ...config,
              stagger: staggerAmount
            });
          }
        }
      }, element);
    }
    
    return () => ctx && ctx.revert();
  }, dependencies);
  
  return elementRef;
};

/**
 * Hook for scroll-triggered animations
 * @param {Function} animation - Animation function that receives gsap and element
 * @param {Object} triggerOptions - ScrollTrigger options
 * @param {Array} dependencies - Dependencies array for useEffect
 */
export const useScrollAnimation = (animation, triggerOptions = {}, dependencies = []) => {
  const elementRef = useRef(null);
  
  useEffect(() => {
    const element = elementRef.current;
    let ctx;
    let scrollTrigger;
    
    if (element) {
      ctx = gsap.context(() => {
        scrollTrigger = ScrollTrigger.create({
          trigger: element,
          start: 'top bottom-=100',
          end: 'bottom top',
          toggleActions: 'play none none reverse',
          ...triggerOptions,
          onEnter: () => {
            if (typeof animation === 'function') {
              animation(gsap, element);
            }
            triggerOptions.onEnter && triggerOptions.onEnter();
          }
        });
      }, element);
    }
    
    return () => {
      if (scrollTrigger) scrollTrigger.kill();
      if (ctx) ctx.revert();
    };
  }, dependencies);
  
  return elementRef;
};

/**
 * Predefined animation for section entrance
 * @param {String} direction - 'up', 'down', 'left', 'right'
 * @param {Object} options - Additional animation options
 */
export const useSectionAnimation = (direction = 'up', options = {}) => {
  const getDirectionProps = () => {
    switch (direction) {
      case 'up':
        return { y: 50 };
      case 'down':
        return { y: -50 };
      case 'left':
        return { x: 50 };
      case 'right':
        return { x: -50 };
      default:
        return { y: 50 };
    }
  };
  
  return useScrollAnimation((gsap, element) => {
    const directionProps = getDirectionProps();
    
    gsap.fromTo(element, 
      {
        opacity: 0,
        ...directionProps,
        ...options.from
      },
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        ...options.to
      }
    );
  });
};

/**
 * Create a timeline animation for chart data visualization
 * @param {Array} data - Chart data array
 * @param {String} selector - CSS selector for chart elements
 */
export const useChartAnimation = (data = [], selector) => {
  const elementRef = useRef(null);
  
  useEffect(() => {
    const element = elementRef.current;
    let ctx;
    
    if (element && data.length > 0) {
      ctx = gsap.context(() => {
        const elements = element.querySelectorAll(selector);
        
        if (elements.length) {
          const tl = gsap.timeline();
          
          tl.fromTo(elements, 
            { 
              opacity: 0,
              scaleY: 0,
              transformOrigin: 'bottom'
            },
            { 
              opacity: 1,
              scaleY: 1,
              duration: 0.8,
              stagger: 0.05,
              ease: 'power3.out'
            }
          );
        }
      }, element);
    }
    
    return () => ctx && ctx.revert();
  }, [data, selector]);
  
  return elementRef;
};

export default {
  useGSAP,
  useGSAPStagger,
  useScrollAnimation,
  useSectionAnimation,
  useChartAnimation
};
