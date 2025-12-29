import React, { useState } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

interface ControlsProps {
  date: Date;
  onDateChange: (date: Date) => void;
  onReset: () => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  moonName: string;
  illumination: number;
}

const Controls: React.FC<ControlsProps> = ({
  date,
  onDateChange,
  onReset,
  isPlaying,
  onTogglePlay,
  moonName,
  illumination,
}) => {
  // State for Reset button animation
  const [isSpinning, setIsSpinning] = useState(false);

  // Helpers to jump time
  const addDays = (days: number) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    onDateChange(newDate);
  };

  const addMonths = (months: number) => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + months);
    onDateChange(newDate);
  };

  const handleResetClick = () => {
    setIsSpinning(true);
    onReset();
    // Remove the spinning class after the animation completes (500ms)
    setTimeout(() => setIsSpinning(false), 500);
  };

  // Slider Logic: Represents the days of the current month
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth(); // 0-indexed
  const currentDay = date.getDate();
  
  // Get days in current month (day 0 of next month is last day of current)
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const day = parseInt(e.target.value);
    const target = new Date(date);
    target.setDate(day);
    onDateChange(target);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 flex flex-col items-center justify-end bg-gradient-to-t from-black/90 to-transparent z-10">
      
      {/* Info Display */}
      <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-2 tracking-wide drop-shadow-lg">
          {moonName}
        </h2>
        <div className="flex items-center justify-center space-x-4 text-blue-200/80 text-sm md:text-base uppercase tracking-widest font-light">
          <span>照明度 {Math.round(illumination * 100)}%</span>
          <span>•</span>
          <span>{date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</span>
        </div>
      </div>

      {/* Control Bar */}
      <div className="w-full max-w-3xl bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 md:p-6 shadow-2xl flex flex-col gap-6">
        
        {/* Timeline Slider - Month View */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-xs text-white/50 uppercase tracking-wider font-medium">
            <span>{currentMonth + 1}月1日</span>
            <span>{currentMonth + 1}月{daysInMonth}日</span>
          </div>
          <div className="relative flex items-center w-full h-6">
            <input
              type="range"
              min="1"
              max={daysInMonth}
              value={currentDay}
              onChange={handleSliderChange}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer z-10"
              style={{
                background: `linear-gradient(to right, rgba(255,255,255,0.3) ${((currentDay - 1) / (daysInMonth - 1)) * 100}%, rgba(255,255,255,0.1) ${((currentDay - 1) / (daysInMonth - 1)) * 100}%)`
              }}
            />
          </div>
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between gap-2 md:gap-4">
          
          {/* Month Navigation */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => addMonths(-1)} 
              className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors text-sm font-medium"
            >
              <ChevronLeft size={16} />
              <span>上月</span>
            </button>
          </div>

          {/* Center Controls */}
          <div className="flex items-center gap-4">
             {/* Small Day Nudges */}
             <button onClick={() => addDays(-1)} className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors">
              <ChevronLeft size={14} />
            </button>

            <button 
              onClick={handleResetClick}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 hover:bg-white/10 text-white/80 transition-all hover:border-white/50 active:scale-95"
              title="回到今天"
            >
              <RotateCcw 
                size={16} 
                className={`transition-transform duration-500 ease-out ${isSpinning ? '-rotate-[360deg]' : ''}`} 
              />
            </button>

            <button 
              onClick={onTogglePlay}
              className="relative w-14 h-14 flex items-center justify-center bg-white text-black rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] overflow-hidden"
            >
              {/* Play Icon Layer */}
              <div 
                className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out ${
                  isPlaying ? 'opacity-0 scale-50 rotate-90' : 'opacity-100 scale-100 rotate-0'
                }`}
              >
                <Play fill="black" size={24} className="ml-1" />
              </div>

              {/* Pause Icon Layer */}
              <div 
                className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out ${
                  isPlaying ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-90'
                }`}
              >
                <Pause fill="black" size={24} />
              </div>
            </button>

            <button onClick={() => addDays(1)} className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors">
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => addMonths(1)} 
              className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors text-sm font-medium"
            >
              <span>下月</span>
              <ChevronRight size={16} />
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Controls;