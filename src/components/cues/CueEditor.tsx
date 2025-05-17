import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { 
  addCue, 
  updateCue, 
  deleteCue, 
  addCueBlock, 
  updateCueBlock, 
  deleteCueBlock,
  loadCues,
  playCue,
  stopCue,
  setCueActive
} from '../../store/slices/cueSlice';
import { Cue, CueBlock, CueAction } from '../../types';
import { 
  Plus, 
  Save, 
  Trash, 
  Play, 
  Square, 
  Clock, 
  Settings, 
  ChevronRight, 
  ChevronDown,
  Edit,
  X
} from 'lucide-react';

const CueEditor: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { cues, activeCueId, isPlaying, currentTime, isLoading } = useSelector((state: RootState) => state.cues);
  const { devices } = useSelector((state: RootState) => state.devices);
  
  const [selectedCueId, setSelectedCueId] = useState<string | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isEditingCue, setIsEditingCue] = useState(false);
  const [isEditingBlock, setIsEditingBlock] = useState(false);
  
  // Form states
  const [cueForm, setCueForm] = useState({
    name: '',
    id: ''
  });
  
  const [blockForm, setBlockForm] = useState({
    id: '',
    name: '',
    startTime: 0,
    duration: 1000
  });
  
  const [actionForm, setActionForm] = useState<CueAction>({
    deviceId: '',
    pinId: '',
    type: '',
    value: ''
  });
  
  useEffect(() => {
    dispatch(loadCues());
  }, [dispatch]);
  
  const selectedCue = selectedCueId ? cues[selectedCueId] : null;
  const selectedBlock = selectedCue && selectedBlockId 
    ? selectedCue.blocks.find(block => block.id === selectedBlockId) 
    : null;
  
  const handleCreateCue = () => {
    const newId = `cue-${Date.now()}`;
    setCueForm({
      name: 'New Cue',
      id: newId
    });
    setIsEditingCue(true);
  };
  
  const handleSaveCue = () => {
    if (isEditingCue) {
      const newCue: Cue = {
        id: cueForm.id,
        name: cueForm.name,
        blocks: [],
        totalDuration: 0
      };
      
      dispatch(addCue(newCue));
      setSelectedCueId(newCue.id);
      setIsEditingCue(false);
    }
  };
  
  const handleUpdateCue = (cueId: string, updates: Partial<Cue>) => {
    dispatch(updateCue({ id: cueId, ...updates }));
  };
  
  const handleDeleteCue = (cueId: string) => {
    dispatch(deleteCue(cueId));
    if (selectedCueId === cueId) {
      setSelectedCueId(null);
      setSelectedBlockId(null);
    }
  };
  
  const handleCreateBlock = () => {
    if (!selectedCueId) return;
    
    const newId = `block-${Date.now()}`;
    setBlockForm({
      id: newId,
      name: 'New Block',
      startTime: 0,
      duration: 1000
    });
    setIsEditingBlock(true);
  };
  
  const handleSaveBlock = () => {
    if (isEditingBlock && selectedCueId) {
      const newBlock: CueBlock = {
        id: blockForm.id,
        name: blockForm.name,
        startTime: blockForm.startTime,
        duration: blockForm.duration,
        actions: []
      };
      
      dispatch(addCueBlock({ cueId: selectedCueId, block: newBlock }));
      setSelectedBlockId(newBlock.id);
      setIsEditingBlock(false);
    }
  };
  
  const handleUpdateBlock = (blockId: string, updates: Partial<CueBlock>) => {
    if (!selectedCueId) return;
    
    dispatch(updateCueBlock({ 
      cueId: selectedCueId, 
      blockId, 
      updates 
    }));
  };
  
  const handleDeleteBlock = (blockId: string) => {
    if (!selectedCueId) return;
    
    dispatch(deleteCueBlock({ cueId: selectedCueId, blockId }));
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }
  };
  
  const handleAddAction = () => {
    if (!selectedCueId || !selectedBlockId || !actionForm.deviceId || !actionForm.pinId) return;
    
    const newAction: CueAction = {
      ...actionForm,
      type: devices[actionForm.deviceId]?.pins[actionForm.pinId]?.type || 'Custom'
    };
    
    const updatedBlock = {
      ...selectedBlock,
      actions: [...(selectedBlock?.actions || []), newAction]
    };
    
    handleUpdateBlock(selectedBlockId, updatedBlock);
    
    // Reset form
    setActionForm({
      deviceId: '',
      pinId: '',
      type: '',
      value: ''
    });
  };
  
  const handleRemoveAction = (index: number) => {
    if (!selectedCueId || !selectedBlockId || !selectedBlock) return;
    
    const updatedActions = [...selectedBlock.actions];
    updatedActions.splice(index, 1);
    
    handleUpdateBlock(selectedBlockId, {
      ...selectedBlock,
      actions: updatedActions
    });
  };
  
  const handlePlayCue = (cueId: string) => {
    dispatch(setCueActive(cueId));
    dispatch(playCue());
  };
  
  const handleStopCue = () => {
    dispatch(stopCue());
  };
  
  // Timeline rendering
  const renderTimeline = () => {
    if (!selectedCue) return null;
    
    const totalDuration = selectedCue.totalDuration || 10000; // Default to 10s if no duration
    const timeScale = 100 / totalDuration; // 100% width divided by duration
    
    return (
      <div className="mt-4 border rounded p-2 bg-gray-50">
        <div className="flex justify-between mb-1">
          <span>0s</span>
          <span>{(totalDuration / 1000).toFixed(1)}s</span>
        </div>
        <div className="relative h-20 bg-gray-200 rounded overflow-hidden">
          {/* Time marker */}
          {isPlaying && (
            <div 
              className="absolute top-0 h-full w-0.5 bg-red-500 z-10 transition-all duration-100"
              style={{ left: `${(currentTime / totalDuration) * 100}%` }}
            />
          )}
          
          {/* Blocks */}
          {selectedCue.blocks.map(block => (
            <div 
              key={block.id}
              className={`absolute h-12 rounded p-1 text-xs text-white overflow-hidden cursor-pointer
                ${selectedBlockId === block.id ? 'bg-blue-600 ring-2 ring-blue-300' : 'bg-blue-500'}`}
              style={{
                left: `${(block.startTime / totalDuration) * 100}%`,
                width: `${(block.duration / totalDuration) * 100}%`,
                top: '4px'
              }}
              onClick={() => setSelectedBlockId(block.id)}
            >
              {block.name}
            </div>
          ))}
        </div>
        
        {/* Controls */}
        <div className="flex mt-2 space-x-2">
          {isPlaying ? (
            <button 
              className="px-3 py-1 bg-red-500 text-white rounded flex items-center"
              onClick={handleStopCue}
            >
              <Square size={16} className="mr-1" /> Stop
            </button>
          ) : (
            <button 
              className="px-3 py-1 bg-green-500 text-white rounded flex items-center"
              onClick={() => handlePlayCue(selectedCue.id)}
            >
              <Play size={16} className="mr-1" /> Play
            </button>
          )}
          <button 
            className="px-3 py-1 bg-blue-500 text-white rounded flex items-center"
            onClick={handleCreateBlock}
          >
            <Plus size={16} className="mr-1" /> Add Block
          </button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="flex h-full">
      {/* Cue List Sidebar */}
      <div className="w-64 bg-gray-100 border-r border-gray-200 p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Cues</h2>
          <button
            onClick={handleCreateCue}
            className="p-1 rounded-full bg-blue-500 text-white hover:bg-blue-600"
            title="Create New Cue"
          >
            <Plus size={18} />
          </button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <ul className="space-y-1">
            {Object.values(cues).map(cue => (
              <li 
                key={cue.id}
                className={`p-2 rounded cursor-pointer flex justify-between items-center
                  ${selectedCueId === cue.id ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-200'}`}
                onClick={() => setSelectedCueId(cue.id)}
              >
                <span className="truncate">{cue.name}</span>
                <div className="flex space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlayCue(cue.id);
                    }}
                    className="p-1 text-gray-600 hover:text-green-600"
                    title="Play Cue"
                  >
                    <Play size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCue(cue.id);
                    }}
                    className="p-1 text-gray-600 hover:text-red-600"
                    title="Delete Cue"
                  >
                    <Trash size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {isEditingCue ? (
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">Create New Cue</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cue Name
              </label>
              <input
                type="text"
                value={cueForm.name}
                onChange={(e) => setCueForm({ ...cueForm, name: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsEditingCue(false)}
                className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCue}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save Cue
              </button>
            </div>
          </div>
        ) : isEditingBlock ? (
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">Create New Block</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Block Name
              </label>
              <input
                type="text"
                value={blockForm.name}
                onChange={(e) => setBlockForm({ ...blockForm, name: e.target.value })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time (ms)
                </label>
                <input
                  type="number"
                  value={blockForm.startTime}
                  onChange={(e) => setBlockForm({ ...blockForm, startTime: parseInt(e.target.value) || 0 })}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (ms)
                </label>
                <input
                  type="number"
                  value={blockForm.duration}
                  onChange={(e) => setBlockForm({ ...blockForm, duration: parseInt(e.target.value) || 1000 })}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsEditingBlock(false)}
                className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveBlock}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save Block
              </button>
            </div>
          </div>
        ) : selectedCue ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">{selectedCue.name}</h1>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePlayCue(selectedCue.id)}
                  className="px-4 py-2 bg-green-500 text-white rounded flex items-center"
                  disabled={isPlaying}
                >
                  <Play size={18} className="mr-1" /> Play
                </button>
                <button
                  onClick={() => {
                    setCueForm({
                      id: selectedCue.id,
                      name: selectedCue.name
                    });
                    setIsEditingCue(true);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded flex items-center"
                >
                  <Edit size={18} className="mr-1" /> Edit
                </button>
              </div>
            </div>
            
            {/* Timeline */}
            {renderTimeline()}
            
            {/* Block Details */}
            {selectedBlock && (
              <div className="mt-6 bg-white p-4 rounded shadow">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">{selectedBlock.name}</h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setBlockForm({
                          id: selectedBlock.id,
                          name: selectedBlock.name,
                          startTime: selectedBlock.startTime,
                          duration: selectedBlock.duration
                        });
                        setIsEditingBlock(true);
                      }}
                      className="p-1 text-gray-600 hover:text-blue-600"
                      title="Edit Block"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteBlock(selectedBlock.id)}
                      className="p-1 text-gray-600 hover:text-red-600"
                      title="Delete Block"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-500">Start Time:</span> {selectedBlock.startTime}ms
                  </div>
                  <div>
                    <span className="text-gray-500">Duration:</span> {selectedBlock.duration}ms
                  </div>
                </div>
                
                {/* Actions */}
                <div className="mt-4">
                  <h3 className="text-md font-medium mb-2">Actions</h3>
                  
                  {selectedBlock.actions && selectedBlock.actions.length > 0 ? (
                    <ul className="space-y-2 mb-4">
                      {selectedBlock.actions.map((action, index) => (
                        <li key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div>
                            <span className="font-medium">{devices[action.deviceId]?.name || 'Unknown Device'}</span>
                            <span className="mx-1">→</span>
                            <span>{devices[action.deviceId]?.pins[action.pinId]?.label || action.pinId}</span>
                            <span className="mx-1">=</span>
                            <span className="font-mono">{typeof action.value === 'object' ? JSON.stringify(action.value) : action.value}</span>
                          </div>
                          <button
                            onClick={() => handleRemoveAction(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X size={16} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic mb-4">No actions defined</p>
                  )}
                  
                  {/* Add Action Form */}
                  <div className="bg-gray-50 p-3 rounded">
                    <h4 className="text-sm font-medium mb-2">Add New Action</h4>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Device</label>
                        <select
                          value={actionForm.deviceId}
                          onChange={(e) => setActionForm({ ...actionForm, deviceId: e.target.value, pinId: '' })}
                          className="w-full p-1.5 text-sm border rounded"
                        >
                          <option value="">Select Device</option>
                          {Object.values(devices).map(device => (
                            <option key={device.id} value={device.id}>
                              {device.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Pin</label>
                        <select
                          value={actionForm.pinId}
                          onChange={(e) => setActionForm({ ...actionForm, pinId: e.target.value })}
                          className="w-full p-1.5 text-sm border rounded"
                          disabled={!actionForm.deviceId}
                        >
                          <option value="">Select Pin</option>
                          {actionForm.deviceId && Object.entries(devices[actionForm.deviceId]?.pins || {}).map(([pinId, config]) => (
                            <option key={pinId} value={pinId}>
                              {config.label || pinId} ({config.type})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="block text-xs text-gray-500 mb-1">Value</label>
                      <input
                        type="text"
                        value={actionForm.value}
                        onChange={(e) => setActionForm({ ...actionForm, value: e.target.value })}
                        className="w-full p-1.5 text-sm border rounded"
                        placeholder="Enter value (e.g., 255, #ff0000, 90)"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={handleAddAction}
                        disabled={!actionForm.deviceId || !actionForm.pinId || actionForm.value === ''}
                        className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        Add Action
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="mb-4">
              <Clock size={48} />
            </div>
            <p className="mb-2">Select a cue from the sidebar or create a new one</p>
            <button
              onClick={handleCreateCue}
              className="px-4 py-2 bg-blue-500 text-white rounded flex items-center"
            >
              <Plus size={18} className="mr-1" /> Create New Cue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CueEditor;
