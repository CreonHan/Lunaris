import React, { useMemo } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleDuration: number;
}

const StarField: React.FC = () => {
  // Generate static stars once to avoid re-renders causing flickering
  const stars = useMemo<Star[]>(() => {
    const count = 200;
    const generated: Star[] = [];
    for (let i = 0; i < count; i++) {
      generated.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.7 + 0.3,
        twinkleDuration: Math.random() * 3 + 2,
      });
    }
    return generated;
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-gradient-to-b from-slate-950 via-[#0a0a1a] to-[#050510]">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-pulse"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDuration: `${star.twinkleDuration}s`,
          }}
        />
      ))}
      {/* Subtle atmospheric glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 to-transparent mix-blend-screen" />
    </div>
  );
};

export default StarField;