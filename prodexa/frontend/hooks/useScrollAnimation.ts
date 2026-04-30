'use client';

import { useEffect, useState, useRef } from 'react';

export function useScrollAnimation(
  threshold: number = 0.15,
  rootMargin: string = "0px 0px -50px 0px"
) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !visible) {
            setVisible(true);
          }
        });
      },
      { threshold, rootMargin }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [visible, threshold, rootMargin]);

  return { ref, visible };
}
