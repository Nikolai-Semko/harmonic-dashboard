import React, { useRef, useEffect, useState } from 'react';
import { BarChart } from 'lucide-react';
import { useHarmonicWave } from '../hooks/useHarmonicWave';

// Local definition of performance metric interface
interface PerformanceMetric {
  lastFrameTime: number;
  averageFrameTime: number;
  frameCount: number;
}

interface CanvasChartProps {
  isDarkMode: boolean;
}

export const CanvasChart: React.FC<CanvasChartProps> = ({ isDarkMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [performance, setPerformance] = useState<PerformanceMetric>({
    lastFrameTime: 0,
    averageFrameTime: 0,
    frameCount: 0
  });
  
  // Get wave data without performance measurement function
  const wave = useHarmonicWave(40, 5);
  let width1: number =canvasRef.current?canvasRef.current.offsetWidth:700;
  let height1: number = canvasRef.current?canvasRef.current.offsetHeight:300;
  useEffect(() => {
    if (!canvasRef.current || wave.points.length === 0) return;
    
    // Start of the time measurement
    const startTime = window.performance.now();
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    //ctx.clearRect(0, 0, width, height);
    
    // Set background color based on theme
    ctx.fillStyle = isDarkMode ? "#1F2A40" : "#ffffff";
    ctx.fillRect(0, 0, width, height);
    
    // Calculate min/max
    let minY = Math.min(...wave.points);
    let maxY = Math.max(...wave.points);
    const range = maxY - minY;
    
    // Draw axes
    ctx.strokeStyle = isDarkMode ? '#6b7280' : '#9ca3af';
    ctx.lineWidth = 1;
    ctx.beginPath();
    // X axis
    ctx.moveTo(40, height - 20);
    ctx.lineTo(width - 20, height - 20);
    // Y axis
    ctx.moveTo(40, 20);
    ctx.lineTo(40, height - 20);
    ctx.stroke();
    
    // Draw X axis ticks and labels
    ctx.fillStyle = isDarkMode ? '#6b7280' : '#9ca3af';
    ctx.font = '10px sans-serif';
    for (let i = 0; i <= 5; i++) {
      const x = 40 + i * (width - 60) / 5;
      ctx.beginPath();
      ctx.moveTo(x, height - 20);
      ctx.lineTo(x, height - 15);
      ctx.stroke();
      ctx.fillText(`${i * 10}s`, x - 10, height - 5);
    }
    
    // Draw Y axis ticks and labels
    for (let i = 0; i <= 5; i++) {
      const y = height - 20 - i * (height - 40) / 5;
      ctx.beginPath();
      ctx.moveTo(35, y);
      ctx.lineTo(40, y);
      ctx.stroke();
      ctx.fillText(`${i * 20}`, 20, y + 5);
    }
    
    // Draw wave
    ctx.strokeStyle = isDarkMode ? '#4CACCE' : '#2a8f9D';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const length:number =  wave.points.length>width1?width1:wave.points.length;
    for (let i = 0; i < length; i++) {
      const x = 40 + (i / wave.points.length) * (width - 60);
      const y = height - 20 - (wave.points[i] - minY) * ((height - 40) / range);
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
    
    // Draw area under the curve with gradient
    const gradient = ctx.createLinearGradient(0, 20, 0, height-20);
    gradient.addColorStop(0, isDarkMode ? 'rgba(76, 162, 206, 0.5)' : 'rgba(42, 123, 157, 0.5)');
    gradient.addColorStop(1, isDarkMode ? 'rgba(76, 162, 206, 0)' : 'rgba(42, 123, 157, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(40, height - 20);
    for (let i = 0; i < width; i++) {
      const x = 40 + (i / wave.points.length) * (width - 60);
      const y = height - 20 - (wave.points[i] - minY) * ((height - 40) / range);
      ctx.lineTo(x, y);
    }
    ctx.lineTo(width - 20, height - 20);
    ctx.closePath();
    ctx.fill();
    
    // Completion of the time measurement
    const endTime = window.performance.now();
    const frameTime = endTime - startTime;
    
    // Performance metrics update
    setPerformance(prev => ({
      lastFrameTime: frameTime,
      frameCount: prev.frameCount + 1,
      averageFrameTime: ((prev.averageFrameTime * prev.frameCount) + frameTime) / (prev.frameCount + 1)
    }));
    
  }, [wave, isDarkMode]);
  
  return (
    <div className={`rounded-lg p-4 h-full ${isDarkMode ? 'bg-[#1F2A40]' : 'bg-white'}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className={`text-lg font-medium flex items-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          <BarChart className={`w-5 h-5 mr-2 ${isDarkMode ? 'text-[#4CCEAC]' : 'text-[#2a9d8f]'}`} />
          Canvas Chart
        </h3>
        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <span className="mr-2">Last: {performance.lastFrameTime.toFixed(2)}ms</span>
          <span>Avg: {performance.averageFrameTime.toFixed(2)}ms</span>
        </div>
      </div>
      <div className="h-64">
        <canvas 
          ref={canvasRef} 
          width={width1} 
          height={height1} 
          className="w-full h-full"
        />
      </div>
    </div>
  );
};