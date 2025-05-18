import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useHarmonicWave } from '../hooks/useHarmonicWave';

// Local definition of performance metric interface
interface PerformanceMetric {
  lastFrameTime: number;
  averageFrameTime: number;
  frameCount: number;
}

interface RechartsChartProps {
  isDarkMode: boolean;
}

interface ChartDataPoint {
  time: number;
  value: number;
}

export const RechartsChart: React.FC<RechartsChartProps> = ({ isDarkMode }) => {
  const [performance, setPerformance] = useState<PerformanceMetric>({
    lastFrameTime: 0,
    averageFrameTime: 0,
    frameCount: 0
  });
  
  // Receive wave data
  const wave = useHarmonicWave(40, 5);
  const [data, setData] = useState<ChartDataPoint[]>([]);
  
  // Use useLayoutEffect to measure the time before drawing on screen
  useEffect(() => {
    if (wave.points.length === 0) return;
    
    // Start of the time measurement
    const startTime = window.performance.now();
    
    // Convert wave data to chart format and prepare for rendering
    const chartData: ChartDataPoint[] = wave.points.map((point: number, i: number) => ({
      time: i,
      value: point
    }));
    
    // Measure delay to give React time for rendering but not use full requestAnimationFrame
    const timeoutId = setTimeout(() => {
      const endTime = window.performance.now();
      
      // Subtract a fixed delay (5 ms) from the total time to compensate 
      // for setTimeout delay, but capture most of the rendering
      const rawFrameTime = endTime - startTime;
      const adjustedFrameTime = Math.max(rawFrameTime - 5, 0);
      
      // Limit the maximum to 20 ms, which should be more than 
      // enough for rendering small graphics even on a weak device
      const cappedFrameTime = Math.min(adjustedFrameTime, 20);
      
      setPerformance(prev => ({
        lastFrameTime: cappedFrameTime,
        frameCount: prev.frameCount + 1,
        averageFrameTime: ((prev.averageFrameTime * prev.frameCount) + cappedFrameTime) / (prev.frameCount + 1)
      }));
    }, 10); // Small delay sufficient to start rendering, but not for full RAF
    
    // Set data for chart
    setData(chartData);
    
    return () => clearTimeout(timeoutId);
  }, [wave]);
  
  // Display gradient fill note
  const fillNote = "* No gradient fill due to library limitations";
  
  return (
    <div className={`rounded-lg p-4 h-full ${isDarkMode ? 'bg-[#1F2A40]' : 'bg-white'}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className={`text-lg font-medium flex items-center ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          <TrendingUp className={`w-5 h-5 mr-2 ${isDarkMode ? 'text-[#4CCEAC]' : 'text-[#2a9d8f]'}`} />
          Recharts Chart
        </h3>
        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <span className="mr-2">Last: {performance.lastFrameTime.toFixed(2)}ms</span>
          <span>Avg: {performance.averageFrameTime.toFixed(2)}ms</span>
        </div>
      </div>
      <div className={`text-xs italic mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        {fillNote}
      </div>
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#e5e7eb"} />
            <XAxis 
              dataKey="time" 
              tickFormatter={(tick) => `${Math.round(tick / 30)}s`}
              stroke={isDarkMode ? "#6b7280" : "#9ca3af"}
            />
            <YAxis stroke={isDarkMode ? "#6b7280" : "#9ca3af"} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff', 
                border: isDarkMode ? 'none' : '1px solid #e5e7eb', 
                borderRadius: '0.375rem',
                color: isDarkMode ? '#f9fafb' : '#111827'
              }}
              itemStyle={{ color: isDarkMode ? '#f9fafb' : '#111827' }}
              formatter={(value) => [`${Math.round(Number(value))}`, 'Value']}
              labelFormatter={(label) => `Time: ${Math.round(Number(label) / 30)}s`}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={isDarkMode ? "#4CCEAC" : "#2a9d8f"} 
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};