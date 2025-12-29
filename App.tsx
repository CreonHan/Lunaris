import React, { useState, useEffect, useRef, useCallback } from 'react';
import StarField from './components/StarField';
import MoonRenderer from './components/MoonRenderer';
import Controls from './components/Controls';
import { getMoonPhase, MoonPhaseData } from './utils/lunar';

const App: React.FC = () => {
  // `targetDate` is where the user WANTS to be.
  // `visualDate` is where the animation currently IS.
  // We interpolate visualDate -> targetDate for smooth transitions.
  const [targetDate, setTargetDate] = useState<Date>(new Date());
  const [visualDate, setVisualDate] = useState<Date>(new Date());
  
  const [isPlaying, setIsPlaying] = useState(false);
  const requestRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number | undefined>(undefined);

  // Main Animation Loop
  const animate = useCallback((time: number) => {
    if (lastTimeRef.current !== undefined) {
      const deltaTime = time - lastTimeRef.current;
      
      // 1. Handle Auto-Play Mode (Time moves forward constantly)
      if (isPlaying) {
        // Speed: 1 day per 100ms roughly? Let's say 2 days per second.
        const speed = 24 * 60 * 60 * 1000 * 2; // 2 days in ms
        const step = (speed * deltaTime) / 1000;
        
        setTargetDate(prev => new Date(prev.getTime() + step));
      }

      // 2. Handle Smooth Interpolation (Visual catches up to Target)
      setVisualDate((prevVisual) => {
        const diff = targetDate.getTime() - prevVisual.getTime();
        
        // If difference is small, snap to it to stop micro-jitters
        if (Math.abs(diff) < 1000 * 60) { // less than a minute difference
           return targetDate; 
        }

        // Lerp factor. Adjust for smoothness.
        const lerpFactor = 0.1; 
        const nextTime = prevVisual.getTime() + diff * lerpFactor;
        return new Date(nextTime);
      });
    }
    
    lastTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, [targetDate, isPlaying]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [animate]);

  // Derived state for rendering
  const moonData: MoonPhaseData = getMoonPhase(visualDate);

  const handleDateChange = (newDate: Date) => {
    setTargetDate(newDate);
    // If we are "playing", dragging manually should probably pause play
    setIsPlaying(false);
  };

  const handleReset = () => {
    const now = new Date();
    setTargetDate(now);
    setIsPlaying(false);
  };

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center bg-black overflow-hidden selection:bg-blue-500/30">
      
      <StarField />
      
      {/* Header / Title */}
      <div className="absolute top-0 left-0 p-8 z-10 opacity-80">
        <h1 className="text-2xl font-serif text-white tracking-[0.2em] font-light">LUNARIS</h1>
      </div>

      {/* Main Visualizer Area */}
      {/* Increased bottom padding to guarantee clearance from controls */}
      <div className="relative z-0 flex items-center justify-center transform transition-transform duration-1000 ease-out hover:scale-105 cursor-grab active:cursor-grabbing pb-[30vh]">
        <MoonRenderer phase={moonData.phase} size={Math.min(window.innerWidth * 0.8, 420)} />
      </div>

      {/* Controls */}
      {/* Note: We pass 'targetDate' for the Date inputs so they feel responsive to user action,
          but we pass 'moonData' derived from 'visualDate' so the text matches the animation. */}
      <Controls 
        date={targetDate}
        onDateChange={handleDateChange}
        onReset={handleReset}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        moonName={moonData.name}
        illumination={moonData.illumination}
      />
      
    </div>
  );
};

export default App;