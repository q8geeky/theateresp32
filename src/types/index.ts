export interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface Device {
  id: string;
  name: string;
  ip: string;
  mac: string;
  online: boolean;
  lastSeen: string;
  pins: Record<string, PinConfig>;
}

export interface PinConfig {
  type: 'RGB' | 'LED' | 'Servo' | 'Relay' | 'Sensor' | 'Custom';
  label?: string;
  value?: any;
}

export interface DevicesState {
  devices: Record<string, Device>;
  isLoading: boolean;
  error: string | null;
}

export interface Control {
  id: string;
  type: 'toggle' | 'slider' | 'colorPicker' | 'pattern' | 'servoControl' | 'script' | 'cueTrigger';
  deviceId: string;
  pinId: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  label: string;
  value: any;
  config?: any;
}

export interface WorkspaceState {
  controls: Control[];
  selectedControlId?: string;
  isLoading: boolean;
  error: string | null;
}

export interface CueBlock {
  id: string;
  name: string;
  startTime: number;
  duration: number;
  actions: CueAction[];
}

export interface CueAction {
  deviceId: string;
  pinId: string;
  type: string;
  value: any;
  delay?: number;
}

export interface Cue {
  id: string;
  name: string;
  blocks: CueBlock[];
  totalDuration: number;
}

export interface CuesState {
  cues: Record<string, Cue>;
  activeCueId?: string;
  isPlaying: boolean;
  currentTime: number;
  isLoading: boolean;
  error: string | null;
}

export interface Script {
  id: string;
  name: string;
  code: string;
  deviceId?: string;
}

export interface ScriptsState {
  scripts: Record<string, Script>;
  isLoading: boolean;
  error: string | null;
}

export interface AppState {
  auth: AuthState;
  devices: DevicesState;
  workspace: WorkspaceState;
  cues: CuesState;
  scripts: ScriptsState;
}
