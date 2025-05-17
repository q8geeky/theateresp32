import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { discoverDevices, updateDevice } from '../../store/slices/deviceSlice';
import { Device } from '../../types';
import { RefreshCw, Wifi, WifiOff, Edit, Trash } from 'lucide-react';

const DeviceDiscovery: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { devices, isLoading, error } = useSelector((state: RootState) => state.devices);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  
  useEffect(() => {
    dispatch(discoverDevices());
    
    // Set up polling for device discovery
    const interval = setInterval(() => {
      dispatch(discoverDevices());
    }, 30000); // Poll every 30 seconds
    
    return () => clearInterval(interval);
  }, [dispatch]);
  
  const handleRefresh = () => {
    dispatch(discoverDevices());
  };
  
  const handleEdit = (device: Device) => {
    setSelectedDevice(device);
    setEditName(device.name);
    setIsEditing(true);
  };
  
  const handleSave = () => {
    if (selectedDevice && editName.trim()) {
      dispatch(updateDevice({
        ...selectedDevice,
        name: editName
      }));
      setIsEditing(false);
      setSelectedDevice(null);
    }
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setSelectedDevice(null);
  };
  
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Device Discovery</h2>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center px-3 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Scanning...' : 'Scan Network'}
        </button>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {isEditing && selectedDevice && (
        <div className="mb-6 p-4 border rounded bg-gray-50">
          <h3 className="text-lg font-medium mb-3">Edit Device</h3>
          <div className="mb-4">
            <label htmlFor="deviceName" className="block text-sm font-medium text-gray-700 mb-1">
              Device Name
            </label>
            <input
              type="text"
              id="deviceName"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                IP Address
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Seen
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.values(devices).length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  No devices found. Try scanning the network.
                </td>
              </tr>
            ) : (
              Object.values(devices).map((device) => (
                <tr key={device.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {device.online ? (
                        <Wifi className="h-5 w-5 text-green-500" />
                      ) : (
                        <WifiOff className="h-5 w-5 text-red-500" />
                      )}
                      <span className={`ml-2 text-sm ${device.online ? 'text-green-500' : 'text-red-500'}`}>
                        {device.online ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {device.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {device.ip}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(device.lastSeen).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(device)}
                        className="text-indigo-600 hover:text-indigo-900 focus:outline-none"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900 focus:outline-none"
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeviceDiscovery;
