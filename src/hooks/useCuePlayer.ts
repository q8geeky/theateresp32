import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { stopCue } from '../store/slices/cueSlice';
import { sendCommand } from '../store/slices/deviceSlice';
import { CueBlock } from '../types';

export const useCuePlayer = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { cues, activeCueId, isPlaying } = useSelector((state: RootState) => state.cues);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    // Clean up any existing timeouts
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];

    if (isPlaying && activeCueId) {
      const activeCue = cues.find(cue => cue.id === activeCueId);
      
      if (activeCue) {
        // Schedule each block's actions
        activeCue.blocks.forEach((block: CueBlock) => {
          const timeout = setTimeout(() => {
            // Execute all actions in this block
            block.actions.forEach(action => {
              const device = action.deviceId;
              const pin = action.pinId;
              const value = action.value;
              
              // Send command to the device
              dispatch(sendCommand({ deviceId: device, pin, value }));
            });
          }, block.triggerTime);
          
          timeoutRefs.current.push(timeout);
        });
        
        // Schedule the end of the cue
        const endTimeout = setTimeout(() => {
          dispatch(stopCue());
        }, activeCue.totalDuration);
        
        timeoutRefs.current.push(endTimeout);
      }
    }
    
    // Clean up on unmount
    return () => {
      timeoutRefs.current.forEach(clearTimeout);
    };
  }, [isPlaying, activeCueId, cues, dispatch]);
};
