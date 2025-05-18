import React, { useRef, useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
import { useHarmonicWave } from '../hooks/useHarmonicWave';

// Defining the local interface for performance metrics
interface PerformanceMetric {
  lastFrameTime: number;
  averageFrameTime: number;
  frameCount: number;
}

interface SVGChartProps {
  isDarkMode: boolean;
}

export const SVGChart: React.FC<SVGChartProps> = ({ isDarkMode }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [performance, setPerformance] = useState<PerformanceMetric>({
    lastFrameTime: 0,
    averageFrameTime: 0,
    frameCount: 0
  });
  
  // Receive wave data without transferring performance measurement function
  const wave = useHarmonicWave(40, 5);
  
  useEffect(() => {
    if (!svgRef.current || wave.points.length === 0) return;
    
    // Start of the time measurement
    const startTime = window.performance.now();
    
    const svg = svgRef.current;
    const width = svg.clientWidth;
    const height = svg.clientHeight;
    
    // Find the line path and area path by class
    const linePath = svg.querySelector('.line-path');
    const areaPath = svg.querySelector('.area-path');
    
    if (!linePath || !areaPath) return;
    
    // Calculate min/max
    let minY = Math.min(...wave.points);
    let maxY = Math.max(...wave.points);
    const range = maxY - minY;
    
    // Create line path data
    let linePathData = '';
    // Create area path data
    let areaPathData = '';
    
    for (let i = 0; i < wave.points.length; i++) {
      const x = (40 + (i / wave.points.length) * (width - 60)).toFixed(2);
      const y = (height - 20 - (wave.points[i] - minY) * ((height - 40) / range)).toFixed(2);
      
      if (i === 0) {
        linePathData = `M ${x} ${y} `;
        areaPathData = `M ${x} ${height - 20} L ${x} ${y} `;
      } else {
        linePathData += `L ${x} ${y} `;
        areaPathData += `L ${x} ${y} `;
      }
    }
    
    // Complete the area path by closing it back to the x-axis
    areaPathData += `L ${width - 20} ${height - 20} Z`;
    
    // Update both paths
    linePath.setAttribute('d', linePathData);
    areaPath.setAttribute('d', areaPathData);
    
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
          <Activity className={`w-5 h-5 mr-2 ${isDarkMode ? 'text-[#4CCEAC]' : 'text-[#2a9d8f]'}`} />
          SVG Chart
        </h3>
        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <span className="mr-2">Last: {performance.lastFrameTime.toFixed(2)}ms</span>
          <span>Avg: {performance.averageFrameTime.toFixed(2)}ms</span>
        </div>
      </div>
      <div className="h-64 relative">
        <svg 
          ref={svgRef} 
          className="w-full h-full" 
          viewBox="0 0 600 300" 
          preserveAspectRatio="none"
        >
          {/* X Axis */}
          <line 
            x1="40" y1="280" x2="580" y2="280" 
            stroke={isDarkMode ? "#6b7280" : "#9ca3af"} 
            strokeWidth="1" 
          />
          {/* Y Axis */}
          <line 
            x1="40" y1="20" x2="40" y2="280" 
            stroke={isDarkMode ? "#6b7280" : "#9ca3af"} 
            strokeWidth="1" 
          />
          
          {/* X Axis Ticks */}
          {[0, 1, 2, 3, 4, 5].map(tick => (
            <g key={`x-tick-${tick}`}>
              <line
                x1={40 + tick * 108}
                y1={280}
                x2={40 + tick * 108}
                y2={285}
                stroke={isDarkMode ? "#6b7280" : "#9ca3af"}
                strokeWidth="1"
              />
              <text
                x={40 + tick * 108}
                y={297}
                fontSize="10"
                fill={isDarkMode ? "#6b7280" : "#9ca3af"}
                textAnchor="middle"
              >
                {tick * 10}s
              </text>
            </g>
          ))}
          
          {/* Y Axis Ticks */}
          {[0, 1, 2, 3, 4, 5].map(tick => (
            <g key={`y-tick-${tick}`}>
              <line
                x1={35}
                y1={280 - tick * 52}
                x2={40}
                y2={280 - tick * 52}
                stroke={isDarkMode ? "#6b7280" : "#9ca3af"}
                strokeWidth="1"
              />
              <text
                x={30}
                y={284 - tick * 52}
                fontSize="10"
                fill={isDarkMode ? "#6b7280" : "#9ca3af"}
                textAnchor="end"
              >
                {tick * 20}
              </text>
            </g>
          ))}
          
          {/* Area under the curve with gradient */}
          <defs>
            <linearGradient id="svgAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isDarkMode ? "#4CCEAC" : "#2a9d8f"} stopOpacity="0.5" />
              <stop offset="100%" stopColor={isDarkMode ? "#4CCEAC" : "#2a9d8f"} stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Area Path - will be populated by useEffect */}
          <path
            className="area-path"
            d=""
            fill="url(#svgAreaGradient)"
          />
          
          {/* Line Path - will be populated by useEffect */}
          <path
            className="line-path"
            d=""
            fill="none"
            stroke={isDarkMode ? "#4CCEAC" : "#2a9d8f"}
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  );
};