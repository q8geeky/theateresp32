import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchDeviceById, updateDevicePin } from '../../store/slices/deviceSlice';
import { Pin } from '../../types';
import { Cpu, AlertCircle, Save } from 'lucide-react';

const DeviceDetail: React.FC = () => {
  const { deviceId } = useParams<{ deviceId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { devices, isLoading, error } = useSelector((state: RootState) => state.devices);
  const device = devices.find(d => d.id === deviceId);
  
  const [editMode, setEditMode] = useState(false);
  const [deviceName, setDeviceName] = useState('');
  const [pinValues, setPinValues] = useState<Record<string, any>>({});
  
  useEffect(() => {
    if (deviceId) {
      dispatch(fetchDeviceById(deviceId));
    }
  }, [dispatch, deviceId]);
  
  useEffect(() => {
    if (device) {
      setDeviceName(device.name);
      const initialPinValues: Record<string, any> = {};
      Object.values(device.pins).forEach(pin => {
        initialPinValues[pin.id] = pin.value;
      });
      setPinValues(initialPinValues);
    }
  }, [device]);
  
  const handlePinChange = (pinId: string, value: any) => {
    setPinValues(prev => ({
      ...prev,
      [pinId]: value
    }));
    
    if (!editMode && device) {
      // In non-edit mode, immediately send updates to the device
      dispatch(updateDevicePin({
        deviceId: device.id,
        pinId,
        value
      }));
    }
  };
  
  const renderPinControl = (pin: Pin) => {
    switch (pin.type) {
      case 'Digital':
      case 'Relay':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={`pin-${pin.id}`}
              checked={pinValues[pin.id] === 1}
              onChange={(e) => handlePinChange(pin.id, e.target.checked ? 1 : 0)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor={`pin-${pin.id}`} className="ml-2 block text-sm text-gray-900">
              {pinValues[pin.id] === 1 ? 'ON' : 'OFF'}
            </label>
          </div>
        );
      
      case 'PWM':
      case 'Analog':
        return (
          <div className="w-full">
            <input
              type="range"
              id={`pin-${pin.id}`}
              min="0"
              max="255"
              value={pinValues[pin.id] || 0}
              onChange={(e) => handlePinChange(pin.id, parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">0</span>
              <span className="text-xs text-gray-500">Value: {pinValues[pin.id] || 0}</span>
              <span className="text-xs text-gray-500">255</span>
            </div>
          </div>
        );
      
      case 'Servo':
        return (
          <div className="w-full">
            <input
              type="range"
              id={`pin-${pin.id}`}
              min="0"
              max="180"
              value={pinValues[pin.id] || 0}
              onChange={(e) => handlePinChange(pin.id, parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">0°</span>
              <span className="text-xs text-gray-500">{pinValues[pin.id] || 0}°</span>
              <span className="text-xs text-gray-500">180°</span>
            </div>
          </div>
        );
      
      case 'RGB':
        return (
          <div className="w-full space-y-2">
            <input
              type="color"
              id={`pin-${pin.id}`}
              value={pinValues[pin.id] || '#000000'}
              onChange={(e) => handlePinChange(pin.id, e.target.value)}
              className="w-full h-8 cursor-pointer"
            />
            <div className="text-xs text-gray-500 text-center">
              {pinValues[pin.id] || '#000000'}
            </div>
          </div>
        );
      
      default:
        return (
          <div className="text-sm text-gray-500">
            Unsupported pin type: {pin.type}
          </div>
        );
    }
  };
  
  if (isLoading && !device) {
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
            <AlertCircle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!device) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">Device not found</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div className="flex items-center">
          <div className={`flex-shrink-0 h-10 w-10 rounded-full bg-${device.online ? 'green' : 'gray'}-100 flex items-center justify-center mr-4`}>
            <Cpu className={`h-6 w-6 text-${device.online ? 'green' : 'gray'}-600`} />
          </div>
          {editMode ? (
            <input
              type="text"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              className="text-lg font-medium text-gray-900 border-b border-gray-300 focus:outline-none focus:border-primary-500"
            />
          ) : (
            <h3 className="text-lg leading-6 font-medium text-gray-900">{device.name}</h3>
          )}
        </div>
        <div>
          <button
            onClick={() => setEditMode(!editMode)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {editMode ? 'Cancel' : 'Edit'}
          </button>
          {editMode && (
            <button
              className="ml-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Save className="h-4 w-4 mr-1" />
              Save
            </button>
          )}
        </div>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">IP Address</dt>
            <dd className="mt-1 text-sm text-gray-900">{device.ip}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">MAC Address</dt>
            <dd className="mt-1 text-sm text-gray-900">{device.mac || 'Unknown'}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Status</dt>
            <dd className="mt-1 text-sm text-gray-900">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${device.online ? 'green' : 'gray'}-100 text-${device.online ? 'green' : 'gray'}-800`}>
                {device.online ? 'Online' : 'Offline'}
              </span>
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Last Seen</dt>
            <dd className="mt-1 text-sm text-gray-900">{new Date(device.lastSeen).toLocaleString()}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">Pins</dt>
            <dd className="mt-1 text-sm text-gray-900">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Object.values(device.pins).map((pin) => (
                  <div key={pin.id} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                    <div className="font-medium mb-2">{pin.name} ({pin.type})</div>
                    {renderPinControl(pin)}
                  </div>
                ))}
              </div>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default DeviceDetail;
