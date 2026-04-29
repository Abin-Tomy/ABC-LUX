import React, { useEffect, useRef, useState } from 'react';
import { usePreloader } from '@/hooks/usePreloader';

interface TitleRevealProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  threshold?: number;
  once?: boolean;
  waitForPreloader?: boolean;
}

const TitleReveal: React.FC<TitleRevealProps> = ({ 
  text, 
  className = '', 
  style, 
  threshold = 0.1,
  once = true,
  waitForPreloader = true
}) => {
  const [inView, setInView] = useState(false);
  const [hasBeenInView, setHasBeenInView] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const { isLoaded } = usePreloader();

  useEffect(() => {
    // Don't start observing until preloader is done (if waitForPreloader is true)
    if (waitForPreloader && !isLoaded) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          setHasBeenInView(true);
          if (once) observer.unobserve(entry.target);
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, once, text, isLoaded, waitForPreloader]); // Re-run if text changes or preloader completes

  // Determine if we should propagate styles to characters (e.g. for gradients)
  const isGradient = style && (style.WebkitBackgroundClip === 'text' || (style as any).backgroundClip === 'text');

  return (
    <span 
      ref={ref}
      className={`title-reveal-splitted ${inView ? '-inview' : ''} ${className}`}
      style={isGradient ? { ...style, backgroundImage: 'none', WebkitBackgroundClip: 'initial', backgroundClip: 'initial' } : style}
      aria-hidden="true"
    >
      {text.split('').map((char, i) => (
        <span
          key={`${text}-${i}`}
          className="-s-char"
          style={{
            ...(isGradient ? {
              backgroundImage: style.backgroundImage,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent',
              display: 'inline-block' // needed for background-clip in some cases
            } : {}),
            '--char-index': i,
            '--char-random': Math.floor(Math.random() * 10),
          } as React.CSSProperties}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
};

export default TitleReveal;
