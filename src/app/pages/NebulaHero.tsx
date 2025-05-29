// import React, { useEffect, useRef } from 'react';
// import styles from './NebulaHero.module.css';

// const NebulaHero: React.FC = () => {
//   const dot1Ref = useRef<HTMLDivElement>(null);
//   const dot2Ref = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     let animationFrameId: number;
//     let progress1 = 0;
//     let progress2 = Math.PI;

//     const animate = () => {
//       progress1 += 0.005;
//       progress2 += 0.005;

//       const a = 180;
//       const b = 80;
//       const angle = -40 * (Math.PI / 180);

//       const x1 = a * Math.cos(progress1);
//       const y1 = b * Math.sin(progress1);
//       const rotatedX1 = x1 * Math.cos(angle) - y1 * Math.sin(angle);
//       const rotatedY1 = x1 * Math.sin(angle) + y1 * Math.cos(angle);

//       const x2 = a * Math.cos(progress2);
//       const y2 = b * Math.sin(progress2);
//       const rotatedX2 = x2 * Math.cos(angle) - y2 * Math.sin(angle);
//       const rotatedY2 = x2 * Math.sin(angle) + y2 * Math.cos(angle);

//       if (dot1Ref.current) {
//         dot1Ref.current.style.transform = `translate(${rotatedX1}px, ${rotatedY1}px)`;
//       }
//       if (dot2Ref.current) {
//         dot2Ref.current.style.transform = `translate(${rotatedX2}px, ${rotatedY2}px)`;
//       }

//       animationFrameId = requestAnimationFrame(animate);
//     };

//     animate();

//     return () => {
//       cancelAnimationFrame(animationFrameId);
//     };
//   }, []);

//   return (
//     <div className={styles.heroContainer}>
//       <div className={styles.orbitContainer}>
//         <div className={styles.ellipticalOrbit}></div>
//         <div ref={dot1Ref} className={`${styles.orbitDot} ${styles.dot1}`}></div>
//         <div ref={dot2Ref} className={`${styles.orbitDot} ${styles.dot2}`}></div>
//       </div>
//       <h1 className={styles.nebulaText}>Nebula</h1>
//     </div>
//   );
// };

// export default NebulaHero;

import React, { useEffect, useRef } from "react";

import "../styles/NebulaHero.css";

const NebulaHero: React.FC = () => {
  const dot1Ref = useRef<HTMLDivElement>(null);
  const dot2Ref = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    let animationFrameId: number;
    let progress1 = 0;
    let progress2 = Math.PI; // Start the second dot halfway

    const animate = () => {
      // Update progress (speed can be adjusted by changing the increment value)
      progress1 += 0.005;
      progress2 += 0.005;

      // Get text dimensions
      const textRect = textRef.current?.getBoundingClientRect();
      const textWidth = textRect?.width || 300;
      const textHeight = textRect?.height || 100;

      // Calculate elliptical path dimensions based on text size
      const a = textWidth * 0.6; // Horizontal radius (60% of text width)
      const b = textHeight * 0.8; // Vertical radius (80% of text height)
      const angle = -40 * (Math.PI / 180); // Convert tilt angle to radians

      // Calculate position for dot 1
      const x1 = a * Math.cos(progress1);
      const y1 = b * Math.sin(progress1);
      // Rotate the ellipse
      const rotatedX1 = x1 * Math.cos(angle) - y1 * Math.sin(angle);
      const rotatedY1 = x1 * Math.sin(angle) + y1 * Math.cos(angle);

      // Calculate position for dot 2
      const x2 = a * Math.cos(progress2);
      const y2 = b * Math.sin(progress2);
      // Rotate the ellipse
      const rotatedX2 = x2 * Math.cos(angle) - y2 * Math.sin(angle);
      const rotatedY2 = x2 * Math.sin(angle) + y2 * Math.cos(angle);

      // Apply positions to dots
      if (dot1Ref.current) {
        dot1Ref.current.style.transform = `translate(${rotatedX1}px, ${rotatedY1}px)`;
      }
      if (dot2Ref.current) {
        dot2Ref.current.style.transform = `translate(${rotatedX2}px, ${rotatedY2}px)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="hero-container">
      <div className="orbit-container">
        <div className="elliptical-orbit"></div>
        <div ref={dot1Ref} className="orbit-dot dot-1"></div>
        <div ref={dot2Ref} className="orbit-dot dot-2"></div>
      </div>
      <h1 ref={textRef} className="nebula-text">
        Nebula
      </h1>
    </div>
  );
};

export default NebulaHero;
