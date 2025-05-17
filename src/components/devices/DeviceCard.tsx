import React from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { Device } from '../../types';
import { Cpu, Wifi, WifiOff, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DeviceCardProps {
  device: Device;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device }) => {
  const dispatch = useDispatch<AppDispatch>();
  
  return (
    <div className={`bg-white shadow rounded-lg overflow-hidden ${!device.online ? 'opacity-60' : ''}`}>
      <div className="p-4 flex justify-between items-center border-b">
        <div className="flex items-center">
          <div className={`p-2 rounded-full ${device.online ? 'bg-green-100' : 'bg-gray-100'}`}>
            <Cpu className={`h-6 w-6 ${device.online ? 'text-green-600' : 'text-gray-400'}`} />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-gray-900 truncate">{device.name}</h3>
            <p className="text-sm text-gray-500">{device.ip}</p>
          </div>
        </div>
        <div>
          {device.online ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <Wifi className="h-3 w-3 mr-1" />
              Online
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              <WifiOff className="h-3 w-3 mr-1" />
              Offline
            </span>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <div className="text-sm text-gray-500">
          <p>Last seen: {new Date(device.lastSeen).toLocaleString()}</p>
          {device.mac && <p>MAC: {device.mac}</p>}
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-2">
          {Object.values(device.pins).slice(0, 4).map((pin) => (
            <div key={pin.id} className="bg-gray-50 p-2 rounded text-xs">
              <div className="font-medium">{pin.name}</div>
              <div className="text-gray-500">{pin.type}</div>
            </div>
          ))}
          {Object.values(device.pins).length > 4 && (
            <div className="bg-gray-50 p-2 rounded text-xs flex items-center justify-center">
              <span>+{Object.values(device.pins).length - 4} more</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-gray-50 px-4 py-3 flex justify-between">
        <Link
          to={`/devices/${device.id}`}
          className="text-sm font-medium text-primary-600 hover:text-primary-500"
        >
          View details
        </Link>
        <Link
          to={`/devices/${device.id}/settings`}
          className="text-sm font-medium text-gray-500 hover:text-gray-700 flex items-center"
        >
          <Settings className="h-4 w-4 mr-1" />
          Settings
        </Link>
      </div>
    </div>
  );
};

export default DeviceCard;
