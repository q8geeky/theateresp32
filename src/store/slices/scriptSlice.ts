import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Script, ScriptsState } from '../../types';

// Mock data for development
const mockScripts: Record<string, Script> = {
  '1': {
    id: '1',
    name: 'RGB Fade',
    code: `// Fade RGB strip through colors
const colors = ['#ff0000', '#00ff00', '#0000ff'];
let colorIndex = 0;

function nextColor() {
  colorIndex = (colorIndex + 1) % colors.length;
  return colors[colorIndex];
}

// This will be called by the system
function execute(device, pin) {
  return nextColor();
}`,
    deviceId: '1'
  },
  '2': {
    id: '2',
    name: 'Servo Sweep',
    code: `// Sweep servo back and forth
let position = 0;
let direction = 1;

function execute(device, pin) {
  position += direction * 10;
  
  if (position >= 180) {
    position = 180;
    direction = -1;
  } else if (position <= 0) {
    position = 0;
    direction = 1;
  }
  
  return position;
}`,
    deviceId: '1'
  }
};

export const loadScripts = createAsyncThunk(
  'scripts/load',
  async (_, { rejectWithValue }) => {
    try {
      // In a real app, this would load from an API or local storage
      return mockScripts;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to load scripts');
    }
  }
);

export const saveScript = createAsyncThunk(
  'scripts/save',
  async (script: Script, { rejectWithValue }) => {
    try {
      // In a real app, this would save to an API or local storage
      console.log('Saving script:', script);
      return script;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to save script');
    }
  }
);

export const executeScript = createAsyncThunk(
  'scripts/execute',
  async (
    { scriptId, deviceId, pinId }: { scriptId: string; deviceId: string; pinId: string },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as { scripts: ScriptsState };
      const script = state.scripts.scripts[scriptId];
      
      if (!script) {
        return rejectWithValue('Script not found');
      }
      
      // In a real app, this would execute the script in a sandboxed environment
      // and send the result to the device
      console.log(`Executing script: ${script.name} on device ${deviceId}, pin ${pinId}`);
      
      // Mock execution - in a real app, you'd use a proper JS interpreter
      // This is just a simplified example
      const mockResult = Math.random() > 0.5 ? '#ff00ff' : 90;
      
      return {
        scriptId,
        deviceId,
        pinId,
        result: mockResult
      };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to execute script');
    }
  }
);

const initialState: ScriptsState = {
  scripts: {},
  isLoading: false,
  error: null
};

const scriptSlice = createSlice({
  name: 'scripts',
  initialState,
  reducers: {
    addScript: (state, action: PayloadAction<Script>) => {
      state.scripts[action.payload.id] = action.payload;
    },
    updateScript: (state, action: PayloadAction<Script>) => {
      state.scripts[action.payload.id] = action.payload;
    },
    deleteScript: (state, action: PayloadAction<string>) => {
      delete state.scripts[action.payload];
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadScripts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadScripts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.scripts = action.payload;
      })
      .addCase(loadScripts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(saveScript.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveScript.fulfilled, (state, action) => {
        state.isLoading = false;
        state.scripts[action.payload.id] = action.payload;
      })
      .addCase(saveScript.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(executeScript.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  }
});

export const { addScript, updateScript, deleteScript, clearError } = scriptSlice.actions;
export default scriptSlice.reducer;
