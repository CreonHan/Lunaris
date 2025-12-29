import React, { useMemo } from 'react';

interface MoonRendererProps {
  phase: number; // 0 to 1
  size?: number;
}

const MoonRenderer: React.FC<MoonRendererProps> = ({ phase, size = 320 }) => {
  const isWaxing = phase <= 0.5;
  
  // High-resolution Moon Texture URL
  const MOON_TEXTURE = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/FullMoon2010.jpg/1024px-FullMoon2010.jpg";

  // Calculate geometry based on a slightly smaller radius to trim the black edges of the source image.
  // The source image is square with the moon touching edges, but often has a faint black border.
  // We trim 4% off the radius to ensure a clean cutout.
  const center = size / 2;
  const radius = center * 0.82; 

  // Calculate mask path for the lit portion of the moon
  const maskPath = useMemo(() => {
    // The horizontal radius of the terminator ellipse varies with phase
    const rx = Math.abs(radius * Math.cos(phase * 2 * Math.PI));
    
    // Coordinates
    const cx = center;
    const cy = center;
    const topY = cy - radius;
    const bottomY = cy + radius;

    // SVG Path Commands
    const start = `M ${cx},${topY}`;
    
    if (isWaxing) {
      // Light is on the RIGHT side.
      // 1. Outer Edge: Arc from Top to Bottom via Right side.
      // A rx ry x-axis-rot large-arc-flag sweep-flag x y
      const outer = `${start} A ${radius} ${radius} 0 0 1 ${cx},${bottomY}`;
      
      // 2. Terminator (Inner Edge): Arc from Bottom to Top.
      // Waxing Crescent (< 0.25): Bulges Right (Sweep 0).
      // Waxing Gibbous (> 0.25): Bulges Left (Sweep 1).
      const sweep = phase < 0.25 ? 0 : 1;
      
      return `${outer} A ${rx} ${radius} 0 0 ${sweep} ${cx},${topY}`;
    } else {
      // Light is on the LEFT side.
      // 1. Outer Edge: Arc from Top to Bottom via Left side.
      const outer = `${start} A ${radius} ${radius} 0 0 0 ${cx},${bottomY}`;
      
      // 2. Terminator (Inner Edge): Arc from Bottom to Top.
      // Waning Gibbous (< 0.75): Bulges Right (Sweep 0).
      // Waning Crescent (> 0.75): Bulges Left (Sweep 1).
      const sweep = phase < 0.75 ? 0 : 1;
      
      return `${outer} A ${rx} ${radius} 0 0 ${sweep} ${cx},${topY}`;
    }
  }, [phase, radius, isWaxing, center]);

  return (
    <div 
      className="relative transition-all duration-300 select-none" 
      style={{ width: size, height: size }}
    >
      {/* 
        Enhanced Drop Shadow for "Glowing" effect:
        - Radius 100px, Opacity 0.4, White
      */}
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible drop-shadow-[0_0_100px_rgba(255,255,255,0.4)]">
        <defs>
          {/* 
            Clip path to trim the image into a circle.
            Using the calculated 'radius' which is slightly smaller than container half-width.
          */}
          <clipPath id="moon-clip">
             <circle cx={center} cy={center} r={radius} />
          </clipPath>

          <mask id="phase-mask">
            {/* Default to black (invisible) */}
            <rect x="0" y="0" width={size} height={size} fill="black" />
            {/* The white part reveals the image */}
            <path d={maskPath} fill="white" />
          </mask>
          
          {/* 
            Radial gradient to give the sphere a 3D look.
            Reduced opacity from 0.7 to 0.5 to keep the edges brighter.
          */}
          <radialGradient id="sphere-shading" cx="50%" cy="50%" r="50%">
            <stop offset="85%" stopColor="black" stopOpacity="0" />
            <stop offset="100%" stopColor="black" stopOpacity="0.5" />
          </radialGradient>
        </defs>
        
        {/* 1. Earthshine Layer (The Dark Side) */}
        {/* 
           Increased brightness to 0.3 (was 0.15) so the dark side is visible 
           and not a "black hole", simulating strong earthshine.
           Increased contrast slightly to keep details crisp.
        */}
        <image 
          href={MOON_TEXTURE} 
          x="0" y="0" 
          width={size} height={size} 
          clipPath="url(#moon-clip)"
          style={{ filter: 'brightness(0.3) contrast(1.2)' }}
        />
        
        {/* 2. The Lit Moon Layer */}
        {/* 
           Bright lit side (1.35) for contrast.
        */}
        <image 
          href={MOON_TEXTURE} 
          x="0" y="0" 
          width={size} height={size} 
          mask="url(#phase-mask)"
          clipPath="url(#moon-clip)"
          style={{ filter: 'brightness(1.5) contrast(1.3) saturate(0.9)' }}
        />
        
        {/* 3. Spherical Overlay */}
        {/* Adds shadow to the edges to reinforce the 3D shape */}
        <circle cx={center} cy={center} r={radius} fill="url(#sphere-shading)" pointerEvents="none" />
      </svg>
    </div>
  );
};

export default MoonRenderer;