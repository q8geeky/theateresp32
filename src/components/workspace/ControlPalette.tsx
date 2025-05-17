import React, { useState } from 'react';
import { Device } from '../../types';
import { Sliders, Square, Circle, Palette } from 'lucide-react';

interface ControlPaletteProps {
  devices: Device[];
  onAddControl: (type: 'button' | 'slider' | 'colorPicker' | 'toggle', deviceId: string, pinId: string) => void;
}

const ControlPalette: React.FC<ControlPaletteProps> = ({ devices, onAddControl }) => {
  const [expandedDevice, setExpandedDevice] = useState<string | null>(null);

  const toggleDevice = (deviceId: string) => {
    setExpandedDevice(expandedDevice === deviceId ? null : deviceId);
  };

  const getControlIcon = (pinType: string) => {
    switch (pinType) {
      case 'RGB':
        return <Palette className="h-4 w-4" />;
      case 'Servo':
      case 'PWM':
        return <Sliders className="h-4 w-4" />;
      case 'Relay':
      case 'Digital':
        return <Square className="h-4 w-4" />;
      default:
        return <Circle className="h-4 w-4" />;
    }
  };

  const getControlType = (pinType: string): 'button' | 'slider' | 'colorPicker' | 'toggle' => {
    switch (pinType) {
      case 'RGB':
        return 'colorPicker';
      case 'Servo':
      case 'PWM':
      case 'Analog':
        return 'slider';
      case 'Relay':
        return 'toggle';
      case 'Digital':
      default:
        return 'button';
    }
  };

  return (
    <div className="p-4">
      <h3 className="font-medium text-gray-900 mb-4">Control Palette</h3>
      
      {devices.length === 0 ? (
        <p className="text-sm text-gray-500">No devices available</p>
      ) : (
        <div className="space-y-4">
          {devices.filter(d => d.online).map((device) => (
            <div key={device.id} className="border rounded-md overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 text-left"
                onClick={() => toggleDevice(device.id)}
              >
                <span className="font-medium text-sm">{device.name}</span>
                <svg
                  className={`h-5 w-5 transform ${expandedDevice === device.id ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {expandedDevice === device.id && (
                <div className="p-3 space-y-2">
                  {Object.values(device.pins).map((pin) => (
                    <div
                      key={pin.id}
                      className="flex items-center justify-between p-2 bg-white border rounded-md hover:bg-gray-50 cursor-pointer"
                      onClick={() => onAddControl(getControlType(pin.type), device.id, pin.id)}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('control', JSON.stringify({
                          type: getControlType(pin.type),
                          deviceId: device.id,
                          pinId: pin.id
                        }));
                      }}
                    >
                      <div className="flex items-center">
                        {getControlIcon(pin.type)}
                        <span className="ml-2 text-sm">{pin.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">{pin.type}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ControlPalette;
