import React from 'react';
import { Control } from '../../types';
import { Trash2 } from 'lucide-react';

interface ControlComponentProps {
  control: Control;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onDelete: () => void;
}

const ControlComponent: React.FC<ControlComponentProps> = ({
  control,
  isSelected,
  onMouseDown,
  onDelete
}) => {
  const renderControlContent = () => {
    switch (control.type) {
      case 'button':
        return (
          <button
            className="w-full h-full bg-primary-500 hover:bg-primary-600 text-white rounded-md flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              // Handle button press logic
            }}
          >
            {control.label}
          </button>
        );
      
      case 'slider':
        return (
          <div className="w-full h-full flex flex-col justify-center">
            <label className="text-xs mb-1">{control.label}</label>
            <input
              type="range"
              className="w-full"
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => {
                // Handle slider change logic
              }}
            />
          </div>
        );
      
      case 'colorPicker':
        return (
          <div className="w-full h-full flex flex-col justify-center">
            <label className="text-xs mb-1">{control.label}</label>
            <input
              type="color"
              className="w-full h-8"
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => {
                // Handle color change logic
              }}
            />
          </div>
        );
      
      case 'toggle':
        return (
          <div className="w-full h-full flex items-center justify-between p-2">
            <span className="text-sm">{control.label}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                  // Handle toggle change logic
                }}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        );
      
      default:
        return <div className="w-full h-full flex items-center justify-center">{control.label}</div>;
    }
  };

  return (
    <div
      className={`absolute p-2 bg-white rounded-md shadow-md ${
        isSelected ? 'ring-2 ring-primary-500' : ''
      }`}
      style={{
        left: `${control.position.x}px`,
        top: `${control.position.y}px`,
        width: '150px',
        height: '80px',
        cursor: 'move',
        zIndex: isSelected ? 10 : 1
      }}
      onMouseDown={onMouseDown}
    >
      {renderControlContent()}
      
      {isSelected && (
        <button
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="h-3 w-3" />
        </button>
      )}
    </div>
  );
};

export default ControlComponent;
