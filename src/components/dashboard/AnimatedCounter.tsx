
import React, { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  className?: string;
}

export default function AnimatedCounter({
  value,
  duration = 2000,
  prefix = "",
  className = "",
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const startTimeRef = useRef(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    // Reset counter when value changes
    countRef.current = 0;
    setCount(0);
    startTimeRef.current = Date.now();

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTimeRef.current) / duration, 1);
      const currentCount = Math.floor(progress * value);
      
      if (currentCount !== countRef.current) {
        countRef.current = currentCount;
        setCount(currentCount);
      }
      
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(value); // Ensure we end at exactly the target value
      }
    };
    
    frameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [value, duration]);

  return (
    <div className={`text-4xl font-bold ${className}`}>
      {prefix}{count.toLocaleString()}
    </div>
  );
}
