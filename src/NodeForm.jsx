// Adding Form for Node Modification
// A simple form component to allow adding and editing nodes dynamically
import  { useState, useCallback } from 'react';

const NodeForm = ({ onAddNode }) => {
  const [label, setLabel] = useState('');
  const [type, setType] = useState('default');
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const handleAddNode = useCallback(() => {
    onAddNode({
      id: `${Date.now()}`,
      type,
      data: { label },
      position: { x: parseInt(x), y: parseInt(y) },
      style: {
        backgroundColor: type === 'input' ? '#e3f2fd' : type === 'output' ? '#e8f5e9' : '#ffffff',
        border: '1px solid #90caf9',
        padding: 10,
      },
    });
    setLabel('');
    setX(0);
    setY(0);
  }, [onAddNode, label, type, x, y]);

  return (
    <div className="node-form">
      <input
        type="text"
        placeholder="Node Label"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
      />
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="default">Default</option>
        <option value="input">Input</option>
        <option value="output">Output</option>
      </select>
      <input
        type="number"
        placeholder="X Position"
        value={x}
        onChange={(e) => setX(e.target.value)}
      />
      <input
        type="number"
        placeholder="Y Position"
        value={y}
        onChange={(e) => setY(e.target.value)}
      />
      <button onClick={handleAddNode}>Add Node</button>
    </div>
  );
};

export { NodeForm };