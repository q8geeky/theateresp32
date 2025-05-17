import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Device, DevicesState } from '../../types';
import { RootState } from '..';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Mock data for development
const mockDevices: Device[] = [
  {
    id: '1',
    name: 'Backstage RGB',
    ip: '192.168.1.101',
    mac: '00:11:22:33:44:55',
    online: true,
    lastSeen: new Date().toISOString(),
    pins: {
      'D9': { type: 'RGB', label: 'RGB Strip' },
      'D6': { type: 'Servo', label: 'Main Curtain' },
      'D4': { type: 'Relay', label: 'Fog Machine' }
    }
  },
  {
    id: '2',
    name: 'Stage Left',
    ip: '192.168.1.102',
    mac: '00:11:22:33:44:56',
    online: true,
    lastSeen: new Date().toISOString(),
    pins: {
      'D2': { type: 'LED', label: 'Spotlight' },
      'D3': { type: 'Sensor', label: 'Motion Detector' }
    }
  },
  {
    id: '3',
    name: 'Stage Right',
    ip: '192.168.1.103',
    mac: '00:11:22:33:44:57',
    online: false,
    lastSeen: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    pins: {
      'D5': { type: 'RGB', label: 'Ambient Light' },
      'D7': { type: 'Servo', label: 'Prop Rotation' }
    }
  }
];

export const fetchDeviceById = createAsyncThunk(
  'devices/fetchById',
  async (deviceId: string, { getState, rejectWithValue }) => {
    try {
      // In a real app, this would be an API call to fetch a specific device
      // For now, we'll find it in our mock data
      const device = mockDevices.find(d => d.id === deviceId);
      if (!device) {
        return rejectWithValue('Device not found');
      }
      return device;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch device');
    }
  }
);

export const discoverDevices = createAsyncThunk(
  'devices/discover',
  async (_, { getState, rejectWithValue }) => {
    try {
      // In a real app, this would be an API call to discover devices on the network
      // For now, we'll return mock data
      return mockDevices;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to discover devices');
    }
  }
);

export const updateDevice = createAsyncThunk(
  'devices/update',
  async (device: Device, { getState, rejectWithValue }) => {
    try {
      // In a real app, this would be an API call to update the device
      // For now, we'll just return the updated device
      return device;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to update device');
    }
  }
);

export const updateDevicePin = createAsyncThunk(
  'devices/updatePin',
  async (
    { deviceId, pinId, value }: { deviceId: string; pinId: string; value: any },
    { getState, rejectWithValue }
  ) => {
    try {
      // In a real app, this would be an API call to update a specific pin on a device
      return { deviceId, pinId, value };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to update pin');
    }
  }
);

export const addDevicePin = createAsyncThunk(
  'devices/addPin',
  async (
    { deviceId, pinData }: { deviceId: string; pinData: { id: string; type: string; label: string } },
    { getState, rejectWithValue }
  ) => {
    try {
      // In a real app, this would be an API call to add a new pin to a device
      return { deviceId, pinData };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to add pin');
    }
  }
);

// Adding the missing removeDevicePin function
export const removeDevicePin = createAsyncThunk(
  'devices/removePin',
  async (
    { deviceId, pinId }: { deviceId: string; pinId: string },
    { getState, rejectWithValue }
  ) => {
    try {
      // In a real app, this would be an API call to remove a pin from a device
      return { deviceId, pinId };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to remove pin');
    }
  }
);

export const sendCommand = createAsyncThunk(
  'devices/sendCommand',
  async (
    { deviceId, pinId, command }: { deviceId: string; pinId: string; command: any },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const device = state.devices.devices[deviceId];
      
      if (!device) {
        return rejectWithValue('Device not found');
      }
      
      // In a real app, this would be a WebSocket or HTTP request to the device
      console.log(`Sending command to ${device.name} (${device.ip}): ${JSON.stringify(command)}`);
      
      // Mock successful response
      return {
        deviceId,
        pinId,
        success: true,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to send command');
    }
  }
);

const initialState: DevicesState = {
  devices: {},
  isLoading: false,
  error: null
};

const deviceSlice = createSlice({
  name: 'devices',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(discoverDevices.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(discoverDevices.fulfilled, (state, action) => {
        state.isLoading = false;
        // Convert array to object with id as key
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
      .addCase(fetchDeviceById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDeviceById.fulfilled, (state, action) => {
        state.isLoading = false;
        const device = action.payload;
        state.devices[device.id] = device;
      })
      .addCase(fetchDeviceById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateDevice.fulfilled, (state, action) => {
        const device = action.payload;
        state.devices[device.id] = device;
      })
      .addCase(updateDevicePin.fulfilled, (state, action) => {
        const { deviceId, pinId, value } = action.payload;
        if (state.devices[deviceId] && state.devices[deviceId].pins[pinId]) {
          state.devices[deviceId].pins[pinId].value = value;
        }
      })
      .addCase(addDevicePin.fulfilled, (state, action) => {
        const { deviceId, pinData } = action.payload;
        if (state.devices[deviceId]) {
          state.devices[deviceId].pins[pinData.id] = {
            type: pinData.type,
            label: pinData.label,
            value: null
          };
        }
      })
      .addCase(removeDevicePin.fulfilled, (state, action) => {
        const { deviceId, pinId } = action.payload;
        if (state.devices[deviceId] && state.devices[deviceId].pins[pinId]) {
          const updatedPins = { ...state.devices[deviceId].pins };
          delete updatedPins[pinId];
          state.devices[deviceId] = {
            ...state.devices[deviceId],
            pins: updatedPins
          };
        }
      })
      .addCase(sendCommand.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  }
});

export const { clearError } = deviceSlice.actions;
export default deviceSlice.reducer;
