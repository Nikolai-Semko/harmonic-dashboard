import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { SVGChart } from './components/SVGChart';
import { CanvasChart } from './components/CanvasChart';
import { D3Chart } from './components/D3Chart';
import { RechartsChart } from './components/RechartsChart';
import { Sidebar } from './components/Sidebar';

// Hook for dark/light theme management
function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = React.useState(true);
  
  React.useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      root.style.backgroundColor = '#141b2d';
      root.style.color = '#ffffff';
    } else {
      root.classList.remove('dark');
      root.style.backgroundColor = '#f8f9fa';
      root.style.color = '#333333';
    }
  }, [isDarkMode]);
  
  return { isDarkMode, setIsDarkMode };
}

const Dashboard: React.FC = () => {
  const { isDarkMode, setIsDarkMode } = useDarkMode();
  
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-background-dark' : 'bg-background-light'}`}>
      {/* Sidebar */}
      <Sidebar isDarkMode={isDarkMode} />
      
      {/* Main Content */}
      <div className="md:ml-64">
        <div className="p-4 md:p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Analytics Dashboard</h1>
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-full ${isDarkMode ? 'bg-card-dark text-yellow-400' : 'bg-white text-gray-800 shadow'}`}
            >
              {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SVGChart isDarkMode={isDarkMode} />
            <CanvasChart isDarkMode={isDarkMode} />
            <D3Chart isDarkMode={isDarkMode} />
            <RechartsChart isDarkMode={isDarkMode} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;