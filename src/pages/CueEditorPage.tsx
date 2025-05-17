import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { 
  addCue, 
  updateCue, 
  removeCue, 
  setActiveCue,
  playCue,
  pauseCue,
  stopCue
} from '../store/slices/cueSlice';
import { v4 as uuidv4 } from 'uuid';
import { Cue } from '../types';
import { Play, Pause, Square, Plus, Trash } from 'lucide-react';

const CueEditorPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { cues, activeCueId, isPlaying, currentTime } = useSelector((state: RootState) => state.cues);
  const [newCueName, setNewCueName] = useState('');
  
  const handleAddCue = () => {
    if (!newCueName.trim()) return;
    
    const newCue: Cue = {
      id: uuidv4(),
      name: newCueName,
      blocks: [],
      totalDuration: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    dispatch(addCue(newCue));
    setNewCueName('');
  };
  
  const handleSelectCue = (cueId: string) => {
    dispatch(setActiveCue(cueId));
  };
  
  const handlePlay = () => {
    dispatch(playCue());
  };
  
  const handlePause = () => {
    dispatch(pauseCue());
  };
  
  const handleStop = () => {
    dispatch(stopCue());
  };
  
  const handleDeleteCue = (cueId: string) => {
    dispatch(removeCue(cueId));
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const activeCue = activeCueId ? cues[activeCueId] : null;
  
  return (
    <div className="p-4 h-full flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Cue Editor</h1>
        <p className="text-gray-600">Create and manage cues for your theatrical performance</p>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Cue List */}
        <div className="w-64 bg-white border-r overflow-y-auto">
          <div className="p-3 border-b">
            <div className="flex">
              <input
                type="text"
                value={newCueName}
                onChange={(e) => setNewCueName(e.target.value)}
                placeholder="New cue name"
                className="flex-1 p-2 border rounded-l text-sm"
              />
              <button
                onClick={handleAddCue}
                disabled={!newCueName.trim()}
                className="p-2 bg-blue-500 text-white rounded-r hover:bg-blue-600 disabled:bg-blue-300"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          
          <div className="divide-y">
            {Object.values(cues).length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No cues yet. Create one to get started.
              </div>
            ) : (
              Object.values(cues).map(cue => (
                <div
                  key={cue.id}
                  className={`p-3 flex justify-between items-center cursor-pointer ${
                    activeCueId === cue.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleSelectCue(cue.id)}
                >
                  <div>
                    <div className="font-medium">{cue.name}</div>
                    <div className="text-xs text-gray-500">
                      {formatTime(cue.totalDuration)}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCue(cue.id);
                    }}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Cue Editor */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
          {activeCue ? (
            <div>
              <div className="bg-white p-4 rounded-md shadow-sm mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">{activeCue.name}</h2>
                  <div className="flex space-x-2">
                    {isPlaying ? (
                      <button
                        onClick={handlePause}
                        className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                        title="Pause"
                      >
                        <Pause size={16} />
                      </button>
                    ) : (
                      <button
                        onClick={handlePlay}
                        className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
                        title="Play"
                      >
                        <Play size={16} />
                      </button>
                    )}
                    <button
                      onClick={handleStop}
                      className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                      title="Stop"
                    >
                      <Square size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-100 rounded-md p-2">
                  <div className="flex justify-between text-sm text-gray-500 mb-1">
                    <span>Current Time: {formatTime(currentTime)}</span>
                    <span>Total Duration: {formatTime(activeCue.totalDuration)}</span>
                  </div>
                  
                  <div className="relative h-8 bg-gray-200 rounded overflow-hidden">
                    <div
                      className="absolute h-full bg-blue-500 opacity-50"
                      style={{ width: `${(currentTime / Math.max(activeCue.totalDuration, 0.1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-md shadow-sm">
                <h3 className="font-bold mb-2">Cue Blocks</h3>
                
                {activeCue.blocks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No blocks in this cue yet.</p>
                    <p className="text-sm mt-2">Add a block to start building your cue sequence.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Blocks would be rendered here */}
                    <p className="text-center py-4 text-gray-500">
                      Block editor implementation in progress...
                    </p>
                  </div>
                )}
                
                <button
                  className="mt-4 flex items-center text-blue-500 hover:text-blue-700"
                >
                  <Plus size={16} className="mr-1" />
                  Add Block
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <p>No cue selected</p>
                <p className="text-sm mt-2">Select a cue from the list or create a new one</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CueEditorPage;
