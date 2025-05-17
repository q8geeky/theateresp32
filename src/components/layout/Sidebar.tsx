import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Layers, Play, Settings, Cpu, Mic2 } from 'lucide-react';

const Sidebar: React.FC = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <Home className="h-6 w-6" /> },
    { name: 'Devices', path: '/devices', icon: <Cpu className="h-6 w-6" /> },
    { name: 'Workspace', path: '/workspace', icon: <Layers className="h-6 w-6" /> },
    { name: 'Cues', path: '/cues', icon: <Play className="h-6 w-6" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="h-6 w-6" /> },
  ];

  return (
    <div className="bg-primary-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
      <div className="flex items-center justify-center space-x-2 px-4">
        <Mic2 className="h-8 w-8" />
        <span className="text-2xl font-extrabold">Stage Control</span>
      </div>
      <nav>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-2 py-2.5 px-4 rounded transition duration-200 ${
                isActive
                  ? 'bg-primary-700 text-white'
                  : 'text-primary-100 hover:bg-primary-700 hover:text-white'
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
