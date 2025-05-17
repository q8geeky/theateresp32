import React, { useRef, useState } from 'react';
import { Control } from '../../types';
import ControlComponent from './ControlComponent';

interface WorkspaceCanvasProps {
  controls: Control[];
  onControlMove: (id: string, position: { x: number, y: number }) => void;
  onControlSelect: (control: Control | null) => void;
  onControlDelete: (id: string) => void;
  selectedControlId: string | undefined;
}

const WorkspaceCanvas: React.FC<WorkspaceCanvasProps> = ({
  controls,
  onControlMove,
  onControlSelect,
  onControlDelete,
  selectedControlId
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggedControl, setDraggedControl] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleDragStart = (e: React.MouseEvent, control: Control) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - control.position.x;
    const offsetY = e.clientY - rect.top - control.position.y;
    
    setDraggedControl(control.id);
    setDragOffset({ x: offsetX, y: offsetY });
    onControlSelect(control);
  };

  const handleDrag = (e: React.MouseEvent) => {
    if (!draggedControl || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left - dragOffset.x, rect.width - 100));
    const y = Math.max(0, Math.min(e.clientY - rect.top - dragOffset.y, rect.height - 100));
    
    onControlMove(draggedControl, { x, y });
  };

  const handleDragEnd = () => {
    setDraggedControl(null);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      onControlSelect(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!canvasRef.current) return;
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('control'));
      if (data.type && data.deviceId && data.pinId) {
        // This would be handled by the parent component
        // onAddControl(data.type, data.deviceId, data.pinId, {
        //   x: e.clientX - canvasRef.current.getBoundingClientRect().left,
        //   y: e.clientY - canvasRef.current.getBoundingClientRect().top
        // });
      }
    } catch (err) {
      console.error('Invalid drag data', err);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      ref={canvasRef}
      className="w-full h-full bg-gray-50 border border-dashed border-gray-300 relative"
      onClick={handleCanvasClick}
      onMouseMove={draggedControl ? handleDrag : undefined}
      onMouseUp={draggedControl ? handleDragEnd : undefined}
      onMouseLeave={draggedControl ? handleDragEnd : undefined}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {controls.map((control) => (
        <ControlComponent
          key={control.id}
          control={control}
          isSelected={control.id === selectedControlId}
          onMouseDown={(e) => handleDragStart(e, control)}
          onDelete={() => onControlDelete(control.id)}
        />
      ))}
    </div>
  );
};

export default WorkspaceCanvas;
