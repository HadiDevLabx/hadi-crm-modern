import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

/**
 * Hook to use GSAP animations with a reference element
 * @param {Object} options - Animation options
 * @param {Array} dependencies - Dependencies for the animation effect
 * @returns {Object} Reference to the animated element
 */
export const useGSAP = (options = {}, dependencies = []) => {
  const { 
    animation = {}, 
    trigger = null, 
    scrollTrigger = null, 
    timeline = null, 
    onComplete = null,
    delay = 0,
    duration = 1,
    ease = 'power2.out',
    repeat = 0,
    yoyo = false
  } = options;
  
  const elementRef = useRef(null);
  const gsapContextRef = useRef(null);

  useEffect(() => {
    // Create a GSAP context to contain animations
    const ctx = gsap.context(() => {
      // Set up elements
      const element = elementRef.current;
      const triggerElement = trigger ? document.querySelector(trigger) : element;

      if (!element) return;

      // Clean up any previous animations
      gsap.killTweensOf(element);

      // Create a new timeline or use the provided one
      const tl = timeline || gsap.timeline({ 
        paused: !!scrollTrigger,
        onComplete
      });

      // Add animation to timeline
      if (Object.keys(animation).length > 0) {
        tl.to(element, {
          ...animation,
          delay,
          duration,
          ease,
          repeat,
          yoyo
        });
      }

      // Handle ScrollTrigger if provided
      if (scrollTrigger && triggerElement) {
        ScrollTrigger.create({
          trigger: triggerElement,
          animation: tl,
          start: scrollTrigger.start || 'top 80%',
          end: scrollTrigger.end || 'bottom 20%',
          toggleActions: scrollTrigger.toggleActions || 'play none none reverse',
          markers: scrollTrigger.markers || false,
          scrub: scrollTrigger.scrub || false,
          pin: scrollTrigger.pin || false,
          pinSpacing: scrollTrigger.pinSpacing !== undefined ? scrollTrigger.pinSpacing : true,
          ...scrollTrigger
        });
      } else if (!scrollTrigger) {
        // Play timeline immediately if not scroll triggered
        tl.play();
      }

      // Store the context for cleanup
      gsapContextRef.current = ctx;
    });

    // Cleanup function
    return () => {
      if (gsapContextRef.current) {
        gsapContextRef.current.revert();
      }
    };
  }, dependencies);

  return elementRef;
};

/**
 * Hook to create staggered animations with GSAP
 * @param {Object} options - Animation options
 * @param {Array} dependencies - Dependencies for the animation effect
 * @returns {Object} Reference to the parent element containing items to animate
 */
export const useGSAPStagger = (options = {}, dependencies = []) => {
  const { 
    animation = {}, 
    staggerAmount = 0.1,
    childSelector = '> *',
    trigger = null,
    scrollTrigger = null,
    from = null,
    delay = 0,
    duration = 1,
    ease = 'power2.out'
  } = options;

  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const container = containerRef.current;
      const triggerElement = trigger ? document.querySelector(trigger) : container;
      
      if (!container) return;
      
      const children = container.querySelectorAll(childSelector);
      
      if (children.length === 0) return;
      
      // Set initial state if provided
      if (from) {
        gsap.set(children, from);
      }
      
      // Create the animation
      const tl = gsap.timeline({
        paused: !!scrollTrigger,
        delay
      });
      
      tl.to(children, {
        ...animation,
        duration,
        ease,
        stagger: staggerAmount
      });
      
      // Set up scroll trigger if provided
      if (scrollTrigger && triggerElement) {
        ScrollTrigger.create({
          trigger: triggerElement,
          animation: tl,
          start: scrollTrigger.start || 'top 80%',
          end: scrollTrigger.end || 'bottom 20%',
          toggleActions: scrollTrigger.toggleActions || 'play none none reverse',
          markers: scrollTrigger.markers || false,
          scrub: scrollTrigger.scrub || false,
          ...scrollTrigger
        });
      } else {
        // Play immediately if no scroll trigger
        tl.play();
      }
    }, containerRef);
    
    return () => ctx.revert();
  }, dependencies);
  
  return containerRef;
};

/**
 * Hook to create scroll-triggered section animations
 * @param {Object} options - Animation options
 * @returns {Object} Reference to the section element
 */
export const useSectionAnimation = (options = {}) => {
  const {
    animation = { y: 0, opacity: 1 },
    from = { y: 50, opacity: 0 },
    threshold = 0.2, 
    stagger = true,
    staggerAmount = 0.1,
    duration = 1,
    ease = 'power3.out'
  } = options;

  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      
      if (!section) return;
      
      // Get all direct children or items to animate
      const items = stagger 
        ? section.querySelectorAll('[data-animate]') 
        : [section];
      
      if (items.length === 0) return;
      
      // Set initial state
      gsap.set(items, from);
      
      // Create ScrollTrigger for each section
      ScrollTrigger.create({
        trigger: section,
        start: `top bottom-=${threshold * 100}%`,
        onEnter: () => {
          gsap.to(items, {
            ...animation,
            duration,
            ease,
            stagger: stagger ? staggerAmount : 0
          });
        },
        once: true
      });
    }, sectionRef);
    
    return () => ctx.revert();
  }, []);
  
  return sectionRef;
};

export default {
  useGSAP,
  useGSAPStagger,
  useSectionAnimation
};
