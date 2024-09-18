"use client";

import React, { useRef, useEffect } from "react";

export const AnimatedGridBackground: React.FC = () => {
  const gridRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!gridRef.current) return;

      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      gridRef.current.style.transform = `translate(${-x * 20}px, ${-y * 20}px)`;
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <svg
        ref={gridRef}
        className="absolute w-full h-full transition-transform duration-200 ease-out"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: "translate(0, 0)" }}
      >
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="rgba(0, 0, 0, 0.1)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
};
