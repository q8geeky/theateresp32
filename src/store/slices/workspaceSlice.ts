import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Control, WorkspaceState } from '../../types';

// Mock data for development
const mockControls: Control[] = [
  {
    id: '1',
    type: 'colorPicker',
    deviceId: '1',
    pinId: 'D9',
    position: { x: 100, y: 100 },
    size: { width: 200, height: 150 },
    label: 'RGB Strip Control',
    value: '#ff0000'
  },
  {
    id: '2',
    type: 'servoControl',
    deviceId: '1',
    pinId: 'D6',
    position: { x: 350, y: 100 },
    size: { width: 180, height: 120 },
    label: 'Curtain Servo',
    value: 90
  },
  {
    id: '3',
    type: 'toggle',
    deviceId: '1',
    pinId: 'D4',
    position: { x: 100, y: 300 },
    size: { width: 150, height: 80 },
    label: 'Fog Machine',
    value: false
  }
];

export const loadWorkspace = createAsyncThunk(
  'workspace/load',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, this would load from an API or local storage
      return mockControls;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to load workspace');
    }
  }
);

export const saveWorkspace = createAsyncThunk(
  'workspace/save',
  async (controls: Control[], { rejectWithValue }) => {
    try {
      // In a real app, this would save to an API or local storage
      console.log('Saving workspace:', controls);
      return controls;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to save workspace');
    }
  }
);

const initialState: WorkspaceState = {
  controls: [],
  selectedControlId: undefined,
  isLoading: false,
  error: null
};

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    addControl: (state, action: PayloadAction<Control>) => {
      state.controls.push(action.payload);
    },
    updateControl: (state, action: PayloadAction<Control>) => {
      const index = state.controls.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.controls[index] = action.payload;
      }
    },
    removeControl: (state, action: PayloadAction<string>) => {
      state.controls = state.controls.filter(c => c.id !== action.payload);
      if (state.selectedControlId === action.payload) {
        state.selectedControlId = undefined;
      }
    },
    selectControl: (state, action: PayloadAction<string | undefined>) => {
      state.selectedControlId = action.payload;
    },
    moveControl: (
      state,
      action: PayloadAction<{ id: string; position: { x: number; y: number } }>
    ) => {
      const { id, position } = action.payload;
      const control = state.controls.find(c => c.id === id);
      if (control) {
        control.position = position;
      }
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadWorkspace.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadWorkspace.fulfilled, (state, action) => {
        state.isLoading = false;
        state.controls = action.payload;
      })
      .addCase(loadWorkspace.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(saveWorkspace.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveWorkspace.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(saveWorkspace.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const {
  addControl,
  updateControl,
  removeControl,
  selectControl,
  moveControl,
  clearError
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
