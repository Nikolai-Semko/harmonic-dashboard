import React, { useRef, useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
import * as d3 from 'd3';
import { useHarmonicWave } from '../hooks/useHarmonicWave';

// Local definition of performance metric interface
interface PerformanceMetric {
  lastFrameTime: number;
  averageFrameTime: number;
  frameCount: number;
}

interface D3ChartProps {
  isDarkMode: boolean;
}

export const D3Chart: React.FC<D3ChartProps> = ({ isDarkMode }) => {
  const d3Ref = useRef<HTMLDivElement>(null);
  const [performance, setPerformance] = useState<PerformanceMetric>({
    lastFrameTime: 0,
    averageFrameTime: 0,
    frameCount: 0
  });
  
  // Get wave data without performance measurement function
  const wave = useHarmonicWave(40, 5);
  
  useEffect(() => {
    if (!d3Ref.current || wave.points.length === 0) return;
    
    // Start of the time measurement
    const startTime = window.performance.now();
    
    // Clear previous svg
    d3.select(d3Ref.current).selectAll("svg").remove();
    
    // Dimensions
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = d3Ref.current.clientWidth - margin.left - margin.right;
    const height = 260 - margin.top - margin.bottom;
    
    // Calculate min/max
    let minY = Math.min(...wave.points);
    let maxY = Math.max(...wave.points);
    
    // Create SVG
    const svg = d3.select(d3Ref.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    // X scale
    const x = d3.scaleLinear()
      .domain([0, wave.points.length])
      .range([0, width]);
    
    // Y scale
    const y = d3.scaleLinear()
      .domain([minY, maxY])
      .range([height, 0]);
    
    // Define axis colors based on theme
    const axisColor = isDarkMode ? "#6b7280" : "#9ca3af";
    const lineColor = isDarkMode ? "#4CCEAC" : "#2a9d8f";
    
    // X axis
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5).tickFormat(d => `${Math.round(Number(d) / 30)}s`))
      .attr("color", axisColor);
    
    // Y axis
    svg.append("g")
      .call(d3.axisLeft(y).ticks(5))
      .attr("color", axisColor);
    
    // Area generator
    const area = d3.area<number>()
      .x((d, i) => x(i))
      .y0(height)
      .y1(d => y(d));
    
    // Line generator
    const line = d3.line<number>()
      .x((d, i) => x(i))
      .y(d => y(d));
    
    // Create gradient
    const gradient = svg.append("defs")
      .append("linearGradient")
      .attr("id", "d3AreaGradient")
      .attr("x1", "0%").attr("y1", "0%")
      .attr("x2", "0%").attr("y2", "100%");
      
    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", lineColor)
      .attr("stop-opacity", 0.5);
      
    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", lineColor)
      .attr("stop-opacity", 0);
    
    // Add area
    svg.append("path")
      .datum(wave.points)
      .attr("fill", "url(#d3AreaGradient)")
      .attr("d", area);
    
    // Add line
    svg.append("path")
      .datum(wave.points)
      .attr("fill", "none")
      .attr("stroke", lineColor)
      .attr("stroke-width", 2)
      .attr("d", line);
    
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
          D3 Chart
        </h3>
        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <span className="mr-2">Last: {performance.lastFrameTime.toFixed(2)}ms</span>
          <span>Avg: {performance.averageFrameTime.toFixed(2)}ms</span>
        </div>
      </div>
      <div ref={d3Ref} className="h-64" />
    </div>
  );
};