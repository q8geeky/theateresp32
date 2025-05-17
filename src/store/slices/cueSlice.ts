import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Cue, CueBlock, CueAction } from '../../types';

interface CueState {
  cues: Record<string, Cue>;
  activeCueId: string | null;
  isPlaying: boolean;
  currentTime: number;
}

const initialState: CueState = {
  cues: {},
  activeCueId: null,
  isPlaying: false,
  currentTime: 0,
};

const cueSlice = createSlice({
  name: 'cues',
  initialState,
  reducers: {
    addCue: (state, action: PayloadAction<Cue>) => {
      state.cues[action.payload.id] = action.payload;
    },
    updateCue: (state, action: PayloadAction<Partial<Cue> & { id: string }>) => {
      const { id, ...updates } = action.payload;
      if (state.cues[id]) {
        state.cues[id] = { ...state.cues[id], ...updates };
      }
    },
    removeCue: (state, action: PayloadAction<string>) => {
      delete state.cues[action.payload];
      if (state.activeCueId === action.payload) {
        state.activeCueId = null;
      }
    },
    addCueBlock: (state, action: PayloadAction<{ cueId: string; block: CueBlock }>) => {
      const { cueId, block } = action.payload;
      if (state.cues[cueId]) {
        state.cues[cueId].blocks.push(block);
        // Recalculate total duration
        const maxEndTime = Math.max(
          ...state.cues[cueId].blocks.map(b => b.triggerTime + b.duration)
        );
        state.cues[cueId].totalDuration = maxEndTime;
      }
    },
    updateCueBlock: (state, action: PayloadAction<{ 
      cueId: string; 
      blockId: string; 
      updates: Partial<CueBlock> 
    }>) => {
      const { cueId, blockId, updates } = action.payload;
      if (state.cues[cueId]) {
        const blockIndex = state.cues[cueId].blocks.findIndex(b => b.id === blockId);
        if (blockIndex !== -1) {
          state.cues[cueId].blocks[blockIndex] = {
            ...state.cues[cueId].blocks[blockIndex],
            ...updates
          };
          
          // Recalculate total duration
          const maxEndTime = Math.max(
            ...state.cues[cueId].blocks.map(b => b.triggerTime + b.duration)
          );
          state.cues[cueId].totalDuration = maxEndTime;
        }
      }
    },
    removeCueBlock: (state, action: PayloadAction<{ cueId: string; blockId: string }>) => {
      const { cueId, blockId } = action.payload;
      if (state.cues[cueId]) {
        state.cues[cueId].blocks = state.cues[cueId].blocks.filter(b => b.id !== blockId);
        
        // Recalculate total duration
        if (state.cues[cueId].blocks.length > 0) {
          const maxEndTime = Math.max(
            ...state.cues[cueId].blocks.map(b => b.triggerTime + b.duration)
          );
          state.cues[cueId].totalDuration = maxEndTime;
        } else {
          state.cues[cueId].totalDuration = 0;
        }
      }
    },
    addCueAction: (state, action: PayloadAction<{ 
      cueId: string; 
      blockId: string; 
      cueAction: CueAction 
    }>) => {
      const { cueId, blockId, cueAction } = action.payload;
      if (state.cues[cueId]) {
        const blockIndex = state.cues[cueId].blocks.findIndex(b => b.id === blockId);
        if (blockIndex !== -1) {
          state.cues[cueId].blocks[blockIndex].actions.push(cueAction);
        }
      }
    },
    updateCueAction: (state, action: PayloadAction<{ 
      cueId: string; 
      blockId: string; 
      actionId: string; 
      updates: Partial<CueAction> 
    }>) => {
      const { cueId, blockId, actionId, updates } = action.payload;
      if (state.cues[cueId]) {
        const blockIndex = state.cues[cueId].blocks.findIndex(b => b.id === blockId);
        if (blockIndex !== -1) {
          const actionIndex = state.cues[cueId].blocks[blockIndex].actions.findIndex(a => a.id === actionId);
          if (actionIndex !== -1) {
            state.cues[cueId].blocks[blockIndex].actions[actionIndex] = {
              ...state.cues[cueId].blocks[blockIndex].actions[actionIndex],
              ...updates
            };
          }
        }
      }
    },
    removeCueAction: (state, action: PayloadAction<{ 
      cueId: string; 
      blockId: string; 
      actionId: string 
    }>) => {
      const { cueId, blockId, actionId } = action.payload;
      if (state.cues[cueId]) {
        const blockIndex = state.cues[cueId].blocks.findIndex(b => b.id === blockId);
        if (blockIndex !== -1) {
          state.cues[cueId].blocks[blockIndex].actions = 
            state.cues[cueId].blocks[blockIndex].actions.filter(a => a.id !== actionId);
        }
      }
    },
    setActiveCue: (state, action: PayloadAction<string>) => {
      state.activeCueId = action.payload;
      state.currentTime = 0;
      state.isPlaying = false;
    },
    playCue: (state) => {
      if (state.activeCueId) {
        state.isPlaying = true;
        state.currentTime = 0;
      }
    },
    pauseCue: (state) => {
      state.isPlaying = false;
    },
    stopCue: (state) => {
      state.isPlaying = false;
      state.currentTime = 0;
    },
    updateCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
      
      // Auto-stop if we reach the end
      if (state.activeCueId && state.currentTime >= state.cues[state.activeCueId].totalDuration) {
        state.isPlaying = false;
      }
    },
  },
});

export const {
  addCue,
  updateCue,
  removeCue,
  addCueBlock,
  updateCueBlock,
  removeCueBlock,
  addCueAction,
  updateCueAction,
  removeCueAction,
  setActiveCue,
  playCue,
  pauseCue,
  stopCue,
  updateCurrentTime,
} = cueSlice.actions;

export default cueSlice.reducer;
