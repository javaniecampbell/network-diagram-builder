// Adding Form for Node Modification
// A simple form component to allow adding and editing nodes dynamically
import  { useState, useCallback } from 'react';


// Adding Form for Edge Modification
// A simple form component to allow adding and editing edges dynamically
const EdgeForm = ({ onAddEdge }) => {
    const [source, setSource] = useState('');
    const [target, setTarget] = useState('');
    const [label, setLabel] = useState('');
  
    const handleAddEdge = useCallback(() => {
      onAddEdge({
        id: `e${Date.now()}`,
        source,
        target,
        label,
      });
      setSource('');
      setTarget('');
      setLabel('');
    }, [onAddEdge, source, target, label]);
  
    return (
      <div className="edge-form">
        <input
          type="text"
          placeholder="Source Node ID"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        />
        <input
          type="text"
          placeholder="Target Node ID"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
        />
        <input
          type="text"
          placeholder="Edge Label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <button onClick={handleAddEdge}>Add Edge</button>
      </div>
    );
  };

  export { EdgeForm }