import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchDevices } from '../../store/slices/deviceSlice';
import { Device } from '../../types';
import { Cpu, Wifi, WifiOff, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const DeviceList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { devices, isLoading, error } = useSelector((state: RootState) => state.devices);

  useEffect(() => {
    dispatch(fetchDevices());
    
    // Set up polling for device status updates
    const interval = setInterval(() => {
      dispatch(fetchDevices());
    }, 30000); // Poll every 30 seconds
    
    return () => clearInterval(interval);
  }, [dispatch]);

  if (isLoading && !devices.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="flex justify-between items-center px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Devices</h3>
        <button 
          onClick={() => dispatch(fetchDevices())}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Refresh
        </button>
      </div>
      
      {devices.length === 0 ? (
        <div className="text-center py-12">
          <Cpu className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No devices found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Start by connecting your ESP32 devices to the network.
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => dispatch(fetchDevices())}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Scan for devices
            </button>
          </div>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {devices.map((device: Device) => (
            <li key={device.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 h-10 w-10 rounded-full bg-${device.online ? 'green' : 'gray'}-100 flex items-center justify-center`}>
                      <Cpu className={`h-6 w-6 text-${device.online ? 'green' : 'gray'}-600`} />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{device.name}</div>
                      <div className="text-sm text-gray-500">{device.ip}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {device.online ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        <Wifi className="h-4 w-4 mr-1" /> Online
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        <WifiOff className="h-4 w-4 mr-1" /> Offline
                      </span>
                    )}
                    <Link
                      to={`/devices/${device.id}`}
                      className="inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <Settings className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <div className="flex flex-wrap gap-1">
                        {Object.values(device.pins).map((pin) => (
                          <span key={pin.id} className="px-2 py-1 text-xs rounded bg-gray-100">
                            {pin.name}: {pin.type}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>Last seen: {new Date(device.lastSeen).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DeviceList;
