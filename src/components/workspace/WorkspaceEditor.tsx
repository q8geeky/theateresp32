import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { addCue, updateCue, removeCue, addCueBlock, removeCueBlock } from '../../store/slices/cueSlice';
import { Cue, CueBlock, CueAction } from '../../types';
import { Play, Pause, Plus, Trash2, Clock, Save } from 'lucide-react';

const CueEditor: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { cues } = useSelector((state: RootState) => state.cues);
  const { devices } = useSelector((state: RootState) => state.devices);
  
  const [selectedCue, setSelectedCue] = useState<string | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  
  const handleAddCue = () => {
    const newCue: Cue = {
      id: `cue-${Date.now()}`,
      name: `New Cue ${cues.length + 1}`,
      blocks: [],
      totalDuration: 0
    };
    
    dispatch(addCue(newCue));
    setSelectedCue(newCue.id);
  };
  
  const handleAddBlock = () => {
    if (!selectedCue) return;
    
    const cue = cues.find(c => c.id === selectedCue);
    if (!cue) return;
    
    const lastBlock = cue.blocks[cue.blocks.length - 1];
    const startTime = lastBlock ? lastBlock.triggerTime + lastBlock.duration : 0;
    
    const newBlock: CueBlock = {
      