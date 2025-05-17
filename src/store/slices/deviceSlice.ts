import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Device, Pin } from '../../types';

interface DeviceState {
  devices: Record<string, Device>;
  isLoading: boolean;
  error: string | null;
  selectedDeviceId: string | null;
}

// Mock API for device discovery - replace with actual implementation
const mockDiscoverDevices = async (): Promise<Device[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'device1',
          name: 'Stage Left Lights',
          ip: '192.168.1.100',
          mac: 'AA:BB:CC:DD:EE:FF',
          lastSeen: new Date().toISOString(),
          online: true,
          pins: {
            'pin1': {
              id: 'pin1',
              name: 'RGB Strip 1',
              type: 'RGB',
              value: '#ff0000',
            },
            'pin2': {
              id: 'pin2',
              name: 'Servo Motor',
              type: 'Servo',
              value: 90,
            },
          },
        },
        {
          id: 'device2',
          name: 'Stage Right Lights',
          ip: '192.168.1.101',
          mac: 'FF:EE:DD:CC:BB:AA',
          lastSeen: new Date().toISOString(),
          online: true,
          pins: {
            'pin1': {
              id: 'pin1',
              name: 'RGB Strip 2',
              type: 'RGB',
              value: '#00ff00',
            },
            'pin2': {
              id: 'pin2',
              name: 'Relay',
              type: 'Relay',
              value: false,
            },
          },
        },
      ]);
    }, 1500);
  });
};

// Mock API for controlling a device pin
const mockControlPin = async (
  deviceId: string,
  pinId: string,
  value: any
): Promise<{ deviceId: string; pinId: string; value: any }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ deviceId, pinId, value });
    }, 300);
  });
};

export const discoverDevices = createAsyncThunk(
  'devices/discover',
  async (_, { rejectWithValue }) => {
    try {
      const devices = await mockDiscoverDevices();
      return devices;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const controlPin = createAsyncThunk(
  'devices/controlPin',
  async (
    { deviceId, pinId, value }: { deviceId: string; pinId: string; value: any },
    { rejectWithValue }
  ) => {
    try {
      const result = await mockControlPin(deviceId, pinId, value);
      return result;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const initialState: DeviceState = {
  devices: {},
  isLoading: false,
  error: null,
  selectedDeviceId: null,
};

const deviceSlice = createSlice({
  name: 'devices',
  initialState,
  reducers: {
    selectDevice: (state, action: PayloadAction<string>) => {
      state.selectedDeviceId = action.payload;
    },
    clearDeviceSelection: (state) => {
      state.selectedDeviceId = null;
    },
    updateDeviceStatus: (state, action: PayloadAction<{ deviceId: string; online: boolean }>) => {
      const { deviceId, online } = action.payload;
      if (state.devices[deviceId]) {
        state.devices[deviceId].online = online;
        state.devices[deviceId].lastSeen = online ? new Date().toISOString() : state.devices[deviceId].lastSeen;
      }
    },
    renameDevice: (state, action: PayloadAction<{ deviceId: string; name: string }>) => {
      const { deviceId, name } = action.payload;
      if (state.devices[deviceId]) {
        state.devices[deviceId].name = name;
      }
    },
    renamePin: (state, action: PayloadAction<{ deviceId: string; pinId: string; name: string }>) => {
      const { deviceId, pinId, name } = action.payload;
      if (state.devices[deviceId]?.pins[pinId]) {
        state.devices[deviceId].pins[pinId].name = name;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(discoverDevices.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(discoverDevices.fulfilled, (state, action: PayloadAction<Device[]>) => {
        state.isLoading = false;
        const devicesMap: Record<string, Device> = {};
        action.payload.forEach((device) => {
          devicesMap[device.id] = device;
        });
        state.devices = devicesMap;
      })
      .addCase(discoverDevices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(controlPin.fulfilled, (state, action) => {
        const { deviceId, pinId, value } = action.payload;
        if (state.devices[deviceId]?.pins[pinId]) {
          state.devices[deviceId].pins[pinId].value = value;
        }
      });
  },
});

export const {
  selectDevice,
  clearDeviceSelection,
  updateDeviceStatus,
  renameDevice,
  renamePin,
} = deviceSlice.actions;

export default deviceSlice.reducer;
