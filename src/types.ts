// Device Types
export interface DevicePin {
  type: 'RGB' | 'LED' | 'Servo' | 'Relay' | 'Sensor' | 'Custom';
  label?: string;
}

export interface Device {
  id: string;
  name: string;
  ip: string;
  mac: string;
  online: boolean;
  lastSeen: string;
  pins: Record<string, DevicePin>;
}

// Cue Types
export interface CueAction {
  id: string;
  deviceId: string;
  pinId: string;
  type: 'toggle' | 'value' | 'color' | 'servo' | 'script';
  value: any; // Could be boolean, number, color string, etc.
}

export interface CueBlock {
  id: string;
  name: string;
  triggerTime: number; // Seconds from cue start
  duration: number; // Seconds
  actions: CueAction[];
}

export interface Cue {
  id: string;
  name: string;
  blocks: CueBlock[];
  totalDuration: number; // Seconds
  createdAt: string;
  updatedAt: string;
}

// Workspace Types
export interface ControlPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WorkspaceControl {
  id: string;
  type: 'toggle' | 'slider' | 'colorPicker' | 'servo' | 'script' | 'cueTrigger';
  deviceId: string;
  pinId: string;
  position: ControlPosition;
  label: string;
  config: any; // Type-specific configuration
}

export interface Workspace {
  id: string;
  name: string;
  controls: WorkspaceControl[];
  background?: string; // Optional background image
}

// Auth Types
export interface User {
  id: string;
  username: string;
  role: 'admin' | 'operator' | 'viewer';
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

// Script Types
export interface Script {
  id: string;
  name: string;
  code: string;
  createdAt: string;
  updatedAt: string;
}
