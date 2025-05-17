import React from 'react';
import { Control, Device, Pin } from '../../types';
import { Sliders, ToggleLeft, Square, Palette } from 'lucide-react';

interface ControlItemProps {
  control: Control;
  device: Device;
  isSelected: boolean;
  onSelect: () => void;
  onDragStart:
