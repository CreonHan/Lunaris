/**
 * Lunar Cycle constants and calculations.
 * Synodic Month (New Moon to New Moon) is approximately 29.53059 days.
 */
const SYNODIC_MONTH = 29.53058867;

// Known New Moon Reference: January 6, 2000, 12:24 UTC
// Using a reference date allows us to calculate the phase offset for any given date.
const REFERENCE_NEW_MOON = new Date('2000-01-06T12:24:00Z');

export interface MoonPhaseData {
  phase: number; // 0.0 to 1.0 (0 = New, 0.5 = Full, 1.0 = New)
  age: number;   // Days into the cycle
  name: string;
  illumination: number; // 0.0 to 1.0 percentage of visible surface
}

export const getMoonPhase = (date: Date): MoonPhaseData => {
  const diffTime = date.getTime() - REFERENCE_NEW_MOON.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  
  // Calculate total cycles passed
  const totalCycles = diffDays / SYNODIC_MONTH;
  
  // Get the fractional part (the current phase)
  let phase = totalCycles - Math.floor(totalCycles);
  
  if (phase < 0) {
    phase += 1;
  }

  const age = phase * SYNODIC_MONTH;
  
  // Calculate illumination (0 at new moon, 1 at full moon)
  // Illumination = 0.5 * (1 - cos(phase * 2PI))
  const illumination = 0.5 * (1 - Math.cos(phase * 2 * Math.PI));

  return {
    phase,
    age,
    name: getPhaseName(phase),
    illumination
  };
};

export const getPhaseName = (phase: number): string => {
  // Approximate phase ranges
  if (phase < 0.03 || phase > 0.97) return "新月 (New Moon)";
  if (phase < 0.22) return "蛾眉月 (Waxing Crescent)";
  if (phase < 0.28) return "上弦月 (First Quarter)";
  if (phase < 0.47) return "盈凸月 (Waxing Gibbous)";
  if (phase < 0.53) return "满月 (Full Moon)";
  if (phase < 0.72) return "亏凸月 (Waning Gibbous)";
  if (phase < 0.78) return "下弦月 (Last Quarter)";
  return "残月 (Waning Crescent)";
};