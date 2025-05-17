import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Stage, Layer, Rect, Text } from 'react-konva';
import { AppDispatch, RootState } from '../store';
import deviceDiscovery from '../services/deviceDiscovery';
import socketService from '../services/socketService';
import { Device } from '../types';

const WorkspacePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [devices, setDevices] = useState<Device[]>([]);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  
  // Set up device discovery
  useEffect(() => {
    const unsubscribe = deviceDiscovery
      .startDiscovery()
      .onDeviceDiscovered((device) => {
        setDevices(prevDevices => {
          const existingIndex = prevDevices.findIndex(d => d.id === device.id);
          if (existingIndex >= 0) {
            const updatedDevices = [...prevDevices];
            updatedDevices[existingIndex] = device;
            return updatedDevices;
          } else {
            return [...prevDevices, device];
          }
        });
      });
      
    // Connect to socket service
    socketService.connect();
    
    // Clean up on unmount
    return () => {
      unsubscribe();
      deviceDiscovery.stopDiscovery();
      socketService.disconnect();
    };
  }, [dispatch]);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const container = document.getElementById('canvas-container');
      if (container) {
        setStageSize({
          width: container.offsetWidth,
          height: container.offsetHeight
        });
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const handleDeviceSelect = (device: Device) => {
    setSelectedDevice(device === selectedDevice ? null : device);
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 bg-white shadow-sm">
        <h1 className="text-2xl font-bold">Workspace</h1>
        <p className="text-gray-600">Drag and drop controls to create your theatrical control panel</p>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Device Panel */}
        <div className="w-64 bg-white border-r overflow-y-auto p-4">
          <h2 className="font-bold mb-4">Devices</h2>
          
          {devices.length === 0 ? (
            <div className="text-gray-500 text-sm">
              Searching for devices...
            </div>
          ) : (
            <div className="space-y-4">
              {devices.map(device => (
                <div 
                  key={device.id}
                  className={`p-3 border rounded-md cursor-pointer transition-colors ${
                    selectedDevice?.id === device.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleDeviceSelect(device)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{device.name}</span>
                    <span className={`inline-block w-3 h-3 rounded-full ${
                      device.online ? 'bg-green-500' : 'bg-red-500'
                    }`}></span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{device.ip}</div>
                  
                  {selectedDevice?.id === device.id && (
                    <div className="mt-3 pt-3 border-t">
                      <h3 className="text-sm font-medium mb-2">Pins</h3>
                      <div className="space-y-2">
                        {Object.entries(device.pins).map(([pinId, config]) => (
                          <div key={pinId} className="flex justify-between text-sm">
                            <span className="font-mono">{pinId}</span>
                            <span className="text-gray-600">{config.label || config.type}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Canvas Area */}
        <div id="canvas-container" className="flex-1 bg-gray-100 overflow-hidden">
          <Stage width={stageSize.width} height={stageSize.height}>
            <Layer>
              <Rect
                x={0}
                y={0}
                width={stageSize.width}
                height={stageSize.height}
                fill="#f3f4f6"
              />
              <Text
                x={stageSize.width / 2 - 100}
                y={stageSize.height / 2 - 10}
                text="Drag controls here"
                fontSize={16}
                fill="#9ca3af"
              />
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
};

export default WorkspacePage;
