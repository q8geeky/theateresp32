// Device Types
export interface Pin {
  id: string;
  name: string;
  type: 'RGB' | 'Servo' | 'Relay' | 'Digital' | 'PWM' | 'Analog';
  value: any;
}

export interface Device {
  id: string;
  name: string;
  ip: string;
  mac?: string;
  lastSeen: string;
  online: boolean;
  pins: Record<string, Pin>;
}

// Workspace Types
export interface ControlPosition {
  x: number;
  y: number;
}

export interface Control {
  id: string;
  type: 'button' | 'slider' | 'colorPicker' | 'toggle';
  deviceId: string;
  pinId: string;
  label: string;
  position: ControlPosition;
  style?: Record<string, any>;
}

// Cue Types
export interface CueAction {
  id: string;
  deviceId: string;
  pinId: string;
  value: any;
}

export interface CueBlock {
  id: string;
  name: string;
  triggerTime: number; // ms from start
  duration: number; // ms
  actions: CueAction[];
}

export interface Cue {
  id: string;
  name: string;
  blocks: CueBlock[];
  totalDuration: number;
}

// Auth Types
export interface User {
  id: string;
  username: string;
  email?: string;
  role: 'admin' | 'user';
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  error: string | null;
}
