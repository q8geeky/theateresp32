import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { addControl, updateControlPosition, removeControl } from '../../store/slices/workspaceSlice';
import { Control } from '../../types';
import ControlPalette from './ControlPalette';
import WorkspaceCanvas from './WorkspaceCanvas';
import { v4 as uuidv4 } from 'uuid';

const WorkspaceEditor: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { controls } = useSelector((state: RootState) => state.workspace);
  const { devices } = useSelector((state: RootState) => state.devices);
  const [selectedControl, setSelectedControl] = useState<Control | null>(null);

  const handleAddControl = (type: Control['type'], deviceId: string, pinId: string) => {
    const device = devices.find(d => d.id === deviceId);
    const pin = device?.pins[pinId];
    
    if (!device || !pin) return;
    
    const newControl: Control = {
      id: uuidv4(),
      type,
      deviceId,
      pinId,
      label: `${device.name} - ${pin.name}`,
      position: { x: 100, y: 100 },
    };
    
    dispatch(addControl(newControl));
  };

  const handleControlMove = (id: string, position: { x: number, y: number }) => {
    dispatch(updateControlPosition({ id, position }));
  };

  const handleControlSelect = (control: Control | null) => {
    setSelectedControl(control);
  };

  const handleControlDelete = (id: string) => {
    dispatch(removeControl(id));
    if (selectedControl?.id === id) {
      setSelectedControl(null);
    }
  };

  return (
    <div className="h-full flex">
      <div className="w-64 bg-white shadow-md overflow-y-auto">
        <ControlPalette 
          devices={devices} 
          onAddControl={handleAddControl} 
        />
      </div>
      <div className="flex-1 relative">
        <WorkspaceCanvas 
          controls={controls}
          onControlMove={handleControlMove}
          onControlSelect={handleControlSelect}
          onControlDelete={handleControlDelete}
          selectedControlId={selectedControl?.id}
        />
      </div>
      {selectedControl && (
        <div className="w-64 bg-white shadow-md p-4">
          <h3 className="font-medium text-gray-900">Control Properties</h3>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Label</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              value={selectedControl.label}
              onChange={(e) => {
                // Update label logic would go here
              }}
            />
          </div>
          {/* Additional properties would go here */}
        </div>
      )}
    </div>
  );
};

export default WorkspaceEditor;
