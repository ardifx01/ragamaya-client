import { useEffect } from 'react';

export const useSmoothScroll = (options = {}) => {
  useEffect(() => {
    const loadGSAP = async () => {
      try {
        const { gsap } = await import('gsap');
        const { ScrollSmoother } = await import('gsap/ScrollSmoother');
        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        
        gsap.registerPlugin(ScrollSmoother, ScrollTrigger);

        const smoother = ScrollSmoother.create({
          wrapper: "#smooth-wrapper",
          content: "#smooth-content",
          smooth: options.smooth || 1.5,
          effects: options.effects !== false,
          smoothTouch: options.smoothTouch || 0.1,
          ...options
        });
        
        if (options.animations) {
          options.animations.forEach(animation => {
            gsap.fromTo(animation.target, animation.from, {
              ...animation.to,
              scrollTrigger: animation.scrollTrigger
            });
          });
        }

        return () => {
          smoother.kill();
          ScrollTrigger.killAll();
        };
      } catch (error) {
        console.error('Error loading GSAP:', error);
      }
    };

    loadGSAP();
  }, [options]);
};