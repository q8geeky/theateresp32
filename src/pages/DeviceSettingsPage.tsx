import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { 
  updateDevice, 
  updateDevicePin, 
  addDevicePin, 
  removeDevicePin 
} from '../store/slices/deviceSlice';
import { Device, DevicePin } from '../types';
import { ArrowLeft, Save, Plus, Trash, RefreshCw } from 'lucide-react';
import socketService from '../services/socketService';

const DeviceSettingsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const device = useSelector((state: RootState) => 
    id ? state.devices.devices[id] : null
  );
  
  const [deviceName, setDeviceName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newPinId, setNewPinId] = useState('');
  const [newPinType, setNewPinType] = useState<DevicePin['type']>('LED');
  const [newPinLabel, setNewPinLabel] = useState('');
  
  useEffect(() => {
    if (device) {
      setDeviceName(device.name);
      setIsLoading(false);
    } else if (id) {
      // Fetch device if not in store
      setIsLoading(true);
      socketService.emit('getDevice', { id }, (response: { success: boolean; device?: Device; error?: string }) => {
        setIsLoading(false);
        if (response.success && response.device) {
          dispatch(updateDevice(response.device));
          setDeviceName(response.device.name);
        } else {
          setError(response.error || 'Failed to load device');
        }
      });
    }
  }, [id, device, dispatch]);
  
  const handleSave = () => {
    if (!id) return;
    
    setIsSaving(true);
    setError(null);
    
    const updates = {
      id,
      name: deviceName
    };
    
    socketService.emit('updateDevice', updates, (response: { success: boolean; error?: string }) => {
      setIsSaving(false);
      if (response.success) {
        dispatch(updateDevice(updates));
      } else {
        setError(response.error || 'Failed to save changes');
      }
    });
  };
  
  const handleAddPin = () => {
    if (!id || !newPinId.trim()) return;
    
    const newPin: DevicePin = {
      type: newPinType,
      label: newPinLabel.trim() || undefined
    };
    
    socketService.emit('addDevicePin', { 
      deviceId: id, 
      pinId: newPinId, 
      config: newPin 
    }, (response: { success: boolean; error?: string }) => {
      if (response.success) {
        dispatch(addDevicePin({ 
          deviceId: id, 
          pinId: newPinId, 
          config: newPin 
        }));
        setNewPinId('');
        setNewPinLabel('');
        setNewPinType('LED');
      } else {
        setError(response.error || 'Failed to add pin');
      }
    });
  };
  
  const handleRemovePin = (pinId: string) => {
    if (!id) return;
    
    socketService.emit('removeDevicePin', { 
      deviceId: id, 
      pinId 
    }, (response: { success: boolean; error?: string }) => {
      if (response.success) {
        dispatch(removeDevicePin({ deviceId: id, pinId }));
      } else {
        setError(response.error || 'Failed to remove pin');
      }
    });
  };
  
  const handleUpdatePinLabel = (pinId: string, label: string) => {
    if (!id || !device) return;
    
    const currentPin = device.pins[pinId];
    if (!currentPin) return;
    
    dispatch(updateDevicePin({
      deviceId: id,
      pinId,
      config: { ...currentPin, label }
    }));
  };
  
  const handleUpdatePinType = (pinId: string, type: DevicePin['type']) => {
    if (!id || !device) return;
    
    const currentPin = device.pins[pinId];
    if (!currentPin) return;
    
    dispatch(updateDevicePin({
      deviceId: id,
      pinId,
      config: { ...currentPin, type }
    }));
  };
  
  const handleRefreshDevice = () => {
    if (!id) return;
    
    setIsLoading(true);
    socketService.emit('refreshDevice', { id }, (response: { success: boolean; device?: Device; error?: string }) => {
      setIsLoading(false);
      if (response.success && response.device) {
        dispatch(updateDevice(response.device));
      } else {
        setError(response.error || 'Failed to refresh device');
      }
    });
  };
  
  if (isLoading) {
    return (
      <div className="p-4 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading device information...</p>
        </div>
      </div>
    );
  }
  
  if (!device) {
    return (
      <div className="p-4 h-full flex flex-col">
        <div className="flex items-center mb-4">
          <button 
            onClick={() => navigate('/workspace')}
            className="p-2 mr-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold">Device Not Found</h1>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">The device you're looking for doesn't exist or couldn't be loaded.</p>
            <button 
              onClick={() => navigate('/workspace')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Return to Workspace
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center mb-4">
        <button 
          onClick={() => navigate('/workspace')}
          className="p-2 mr-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">Device Settings</h1>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-md shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Device Information</h2>
          <button
            onClick={handleRefreshDevice}
            className="p-2 text-gray-500 hover:text-blue-500 rounded-full hover:bg-gray-100"
            title="Refresh Device"
          >
            <RefreshCw size={18} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Device Name
            </label>
            <input
              type="text"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IP Address
              </label>
              <input
                type="text"
                value={device.ip}
                readOnly
                className="w-full p-2 border rounded bg-gray-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                MAC Address
              </label>
              <input
                type="text"
                value={device.mac}
                readOnly
                className="w-full p-2 border rounded bg-gray-50"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                device.online ? 'bg-green-500' : 'bg-red-500'
              }`}></span>
              <span className="text-sm">
                {device.online ? 'Online' : 'Offline'}
              </span>
            </div>
            
            <div className="text-sm text-gray-500">
              Last seen: {new Date(device.lastSeen).toLocaleString()}
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 flex items-center"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-md shadow-sm p-4 flex-1 overflow-hidden flex flex-col">
        <h2 className="text-lg font-bold mb-4">Pin Configuration</h2>
        
        <div className="mb-4 p-4 border rounded-md bg-gray-50">
          <h3 className="font-medium mb-2">Add New Pin</h3>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Pin ID
              </label>
              <input
                type="text"
                value={newPinId}
                onChange={(e) => setNewPinId(e.target.value)}
                placeholder="e.g., D1, GPIO5"
                className="w-full p-2 border rounded text-sm"
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Type
              </label>
              <select
                value={newPinType}
                onChange={(e) => setNewPinType(e.target.value as DevicePin['type'])}
                className="w-full p-2 border rounded text-sm"
              >
                <option value="LED">LED</option>
                <option value="RGB">RGB LED</option>
                <option value="Servo">Servo</option>
                <option value="Relay">Relay</option>
                <option value="Sensor">Sensor</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Label (Optional)
              </label>
              <input
                type="text"
                value={newPinLabel}
                onChange={(e) => setNewPinLabel(e.target.value)}
                placeholder="e.g., Main Light"
                className="w-full p-2 border rounded text-sm"
              />
            </div>
          </div>
          
          <div className="mt-3 flex justify-end">
            <button
              onClick={handleAddPin}
              disabled={!newPinId.trim()}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:bg-blue-300 flex items-center"
            >
              <Plus size={14} className="mr-1" />
              Add Pin
            </button>
          </div>
        </div>
        
        <div className="overflow-y-auto flex-1">
          {Object.keys(device.pins).length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No pins configured yet</p>
              <p className="text-sm mt-2">Add a pin to start configuring this device</p>
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(device.pins).map(([pinId, config]) => (
                <div key={pinId} className="p-3 border rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mono font-medium">{pinId}</span>
                    <button
                      onClick={() => handleRemovePin(pinId)}
                      className="p-1 text-gray-400 hover:text-red-500"
                      title="Remove Pin"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Type
                      </label>
                      <select
                        value={config.type}
                        onChange={(e) => handleUpdatePinType(pinId, e.target.value as DevicePin['type'])}
                        className="w-full p-2 border rounded text-sm"
                      >
                        <option value="LED">LED</option>
                        <option value="RGB">RGB LED</option>
                        <option value="Servo">Servo</option>
                        <option value="Relay">Relay</option>
                        <option value="Sensor">Sensor</option>
                        <option value="Custom">Custom</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Label
                      </label>
                      <input
                        type="text"
                        value={config.label || ''}
                        onChange={(e) => handleUpdatePinLabel(pinId, e.target.value)}
                        placeholder="e.g., Main Light"
                        className="w-full p-2 border rounded text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeviceSettingsPage;
