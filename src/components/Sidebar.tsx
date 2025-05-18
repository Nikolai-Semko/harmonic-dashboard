import React from 'react';
import { LayoutDashboard, LineChart, PieChart, FileText, Settings } from 'lucide-react';


interface SidebarItemProps {
  icon: React.FC<{ className?: string }>;
  text: string;
  active?: boolean;
}

interface SidebarProps {
  isDarkMode: boolean;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, text, active = false }) => {
  return (
    <div className={`flex items-center py-3 px-4 my-1 rounded-lg cursor-pointer ${active ? 'bg-[#3e4396] text-white' : 'text-gray-400 hover:bg-[#3e4396]/30 hover:text-white'}`}>
      <Icon className="w-5 h-5 mr-3" />
      <span>{text}</span>
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ isDarkMode }) => {
  // Use isDarkMode to change styles
  return (
    <div className={`fixed left-0 top-0 h-full w-64 ${isDarkMode ? 'bg-[#1F2A40] text-white' : 'bg-white text-gray-800 border-r border-gray-200'} p-4 transition-all duration-300 z-10 hidden md:block`}>
      <div className="text-xl font-bold mb-8 pl-2">DASHBOARD</div>      
      <SidebarItem icon={LayoutDashboard} text="Dashboard" active={true} />
      <SidebarItem icon={LineChart} text="Analyze Trends" />
      <SidebarItem icon={PieChart} text="Multi-Source Analysis" />
      <SidebarItem icon={FileText} text="Reports" />
      <SidebarItem icon={Settings} text="Settings" />
    </div>
  );
};
