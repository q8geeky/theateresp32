import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Control } from '../../types';

interface WorkspaceState {
  controls: Record<string, Control>;
  isEditing: boolean;
  selectedControlId: string | null;
}

const initialState: WorkspaceState = {
  controls: {},
  isEditing: false,
  selectedControlId: null,
};

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    addControl: (state, action: PayloadAction<Control>) => {
      state.controls[action.payload.id] = action.payload;
    },
    updateControl: (state, action: PayloadAction<Partial<Control> & { id: string }>) => {
      const { id, ...updates } = action.payload;
      if (state.controls[id]) {
        state.controls[id] = { ...state.controls[id], ...updates };
      }
    },
    removeControl: (state, action: PayloadAction<string>) => {
      delete state.controls[action.payload];
      if (state.selectedControlId === action.payload) {
        state.selectedControlId = null;
      }
    },
    moveControl: (state, action: PayloadAction<{ id: string; position: { x: number; y: number } }>) => {
      const { id, position } = action.payload;
      if (state.controls[id]) {
        state.controls[id].position = position;
      }
    },
    selectControl: (state, action: PayloadAction<string>) => {
      state.selectedControlId = action.payload;
    },
    clearSelection: (state) => {
      state.selectedControlId = null;
    },
    toggleEditMode: (state) => {
      state.isEditing = !state.isEditing;
      if (!state.isEditing) {
        state.selectedControlId = null;
      }
    },
    saveWorkspace: (state) => {
      // In a real app, this would save to backend
      console.log('Workspace saved:', state.controls);
    },
    loadWorkspace: (state, action: PayloadAction<Record<string, Control>>) => {
      state.controls = action.payload;
    },
    clearWorkspace: (state) => {
      state.controls = {};
      state.selectedControlId = null;
    },
  },
});

export const {
  addControl,
  updateControl,
  removeControl,
  moveControl,
  selectControl,
  clearSelection,
  toggleEditMode,
  saveWorkspace,
  loadWorkspace,
  clearWorkspace,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
