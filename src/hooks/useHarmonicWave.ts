import { useState, useEffect, useRef } from 'react';

// Types
export interface HarmonicWave {
  amplitude: number[];
  period: number[];
  shift: number[];
  totalHarmonics: number;
  points: number[];
  cur: number;
}

export interface PerformanceMetric {
  lastFrameTime: number;
  averageFrameTime: number;
  frameCount: number;
}

export function useHarmonicWave(
  totalHarmonics = 40, 
  speed = 5, 
  onPerformanceUpdate?: (metric: PerformanceMetric) => void
) {
  const [wave, setWave] = useState<HarmonicWave>({
    amplitude: [],
    period: [],
    shift: [],
    totalHarmonics,
    points: Array(300).fill(0),
    cur: 0
  });
  
  const performanceRef = useRef<PerformanceMetric>({
    lastFrameTime: 0,
    averageFrameTime: 0,
    frameCount: 0
  });
  
  // Initialize the wave
  useEffect(() => {
    const amplitude: number[] = [];
    const period: number[] = [];
    const shift: number[] = [];
    
    amplitude[0] = 100;
    period[0] = 200;
    shift[0] = Math.random() * 10;
    
    for (let i = 1; i < totalHarmonics; i++) {
      amplitude[i] = amplitude[i - 1] / 1.4;
      period[i] = period[i - 1] / 1.4;
      shift[i] = Math.random() * period[i] * 10;
    }
    
    setWave({
      ...wave,
      amplitude,
      period,
      shift,
    });
  }, [totalHarmonics]);
  
  // Animation frame
  useEffect(() => {
    const intervalId = setInterval(() => {
      const startTime = performance.now();
      
      setWave(prevWave => {
        const points: number[] = [];
        let minY = 1e9;
        let maxY = -1e9;
        const n = 300;
        
        for (let i = 0; i <= n; i++) {
          let sum = 0;
          let kk = 1.5;
          for (let j = 1; j < prevWave.totalHarmonics; j++) {
            sum += prevWave.amplitude[j] * Math.sin((prevWave.shift[j] + (i + prevWave.cur) * kk) / prevWave.period[j]);
          }
          if (maxY < sum) maxY = sum;
          if (minY > sum) minY = sum;
          points[i] = sum;
        }
        
        return {
          ...prevWave,
          points,
          cur: prevWave.cur + speed / 10
        };
      });
      
      const endTime = performance.now();
      const frameTime = endTime - startTime;
      
      // Update performance metrics
      const current = performanceRef.current;
      current.lastFrameTime = frameTime;
      current.frameCount++;
      current.averageFrameTime = ((current.averageFrameTime * (current.frameCount - 1)) + frameTime) / current.frameCount;
      
      if (onPerformanceUpdate) {
        onPerformanceUpdate({
          lastFrameTime: frameTime,
          averageFrameTime: current.averageFrameTime,
          frameCount: current.frameCount
        });
      }
    }, 50);
    
    return () => clearInterval(intervalId);
  }, [speed, onPerformanceUpdate]);
  
  return wave;
}