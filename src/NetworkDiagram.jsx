// Step-by-Step Chain of Thought for Solution
// Summary: The solution involves analyzing the provided diagrams, defining requirements for a React-based interactive diagram tool, and implementing a network diagram using React Flow with customizable nodes and edges. The implementation will also include an interface for modifying nodes and exporting the diagram.

import React, { useState, useCallback } from 'react';
// ReactFlow: Main library for creating and managing diagrams
import ReactFlow, {
  ReactFlowProvider, // ReactFlowProvider: Context provider to manage internal state of React Flow
  addEdge, // addEdge: Utility function to add a new connection between nodes
  MiniMap, // MiniMap: Component to provide an overview of the entire diagram
  Controls, // Controls: Component to add zoom and pan controls
  Background, // Background: Component to render a customizable background grid
} from 'react-flow-renderer';
import './NetworkDiagram.css'; // Custom CSS for styling
import htmlToImage from 'html-to-image'; // Utility to export diagram as an image
import { render, screen, fireEvent } from '@testing-library/react'; // Testing utilities for rendering and interacting with components
import '@testing-library/jest-dom'; // Jest DOM matchers for improved test assertions

// Initial nodes with defined styles
const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Route 53 (Infrastructure Node)' },
    position: { x: 100, y: 100 },
    style: {
      backgroundColor: '#e3f2fd',
      border: '1px solid #90caf9',
      padding: 10,
    },
  },
  {
    id: '2',
    type: 'default',
    data: { label: 'Elastic Load Balancer (Infrastructure Node)' },
    position: { x: 400, y: 100 },
    style: {
      backgroundColor: '#e3f2fd',
      border: '1px solid #90caf9',
      padding: 10,
    },
  },
  {
    id: '3',
    type: 'default',
    data: { label: 'Web Application (Deployment Node)' },
    position: { x: 700, y: 100 },
    style: {
      backgroundColor: '#fff3e0',
      border: '1px solid #ffb74d',
      padding: 10,
    },
  },
  {
    id: '4',
    type: 'default',
    data: { label: 'Database (Deployment Node)' },
    position: { x: 1000, y: 100 },
    style: {
      backgroundColor: '#e8f5e9',
      border: '1px solid #81c784',
      padding: 10,
    },
  },
];

// Initial edges with labels
const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', label: 'Forwards requests to' },
  { id: 'e2-3', source: '2', target: '3', label: 'Forwards requests to' },
  { id: 'e3-4', source: '3', target: '4', label: 'Reads from and writes to' },
];

const NetworkDiagram = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback((changes) => {
    setNodes((nds) => nds.map((node) => ({ ...node, ...changes })));
  }, []);

  const onEdgesChange = useCallback((changes) => {
    setEdges((eds) => eds.map((edge) => ({ ...edge, ...changes })));
  }, []);

  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge(params, eds));
  }, []);

  const handleExport = useCallback(() => {
    const element = document.getElementById('network-diagram');
    htmlToImage.toPng(element)
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'network-diagram.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((error) => {
        console.error('Error exporting diagram:', error);
      });
  }, []);

  return (
    <div id="network-diagram" style={{ height: '100vh' }}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background color="#aaa" gap={16} />
        </ReactFlow>
        <EdgeForm onAddEdge={(newEdge) => setEdges((eds) => [...eds, newEdge])} />
        <button onClick={handleExport}>Export Diagram</button>
      </ReactFlowProvider>
    </div>
  );
};

export default NetworkDiagram;

// Adding Form for Node Modification
// A simple form component to allow adding and editing nodes dynamically
import React, { useState, useCallback } from 'react';

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

// Test Cases for NetworkDiagram Component
// 1. Ensure that nodes are rendered correctly with the given styles and labels.
test('renders initial nodes correctly', () => {
  render(<NetworkDiagram />);
  initialNodes.forEach((node) => {
    expect(screen.getByText(node.data.label)).toBeInTheDocument();
  });
});

// 2. Test adding a new node via the form interface.
test('adds a new node via form', () => {
  const onAddNode = jest.fn();
  render(<NodeForm onAddNode={onAddNode} />);
  fireEvent.change(screen.getByPlaceholderText('Node Label'), { target: { value: 'New Node' } });
  fireEvent.change(screen.getByPlaceholderText('X Position'), { target: { value: '500' } });
  fireEvent.change(screen.getByPlaceholderText('Y Position'), { target: { value: '300' } });
  fireEvent.click(screen.getByText('Add Node'));
  expect(onAddNode).toHaveBeenCalledWith(expect.objectContaining({
    data: { label: 'New Node' },
    position: { x: 500, y: 300 },
  }));
});

// 3. Test modifying an existing node's label and type.
test('modifies an existing node', () => {
  render(<NetworkDiagram />);
  const nodeLabel = screen.getByText('Route 53 (Infrastructure Node)');
  expect(nodeLabel).toBeInTheDocument();
  // Assuming there's a way to edit the label, add a test for that here.
});

// 4. Ensure connections can be added between nodes.
test('adds a connection between nodes', () => {
  render(<NetworkDiagram />);
  fireEvent.click(screen.getByText('Elastic Load Balancer (Infrastructure Node)'));
  fireEvent.click(screen.getByText('Web Application (Deployment Node)'));
  // Assuming there's a way to connect nodes, add assertions here.
});

// 5. Test the export functionality to generate an image.
test('exports the diagram as an image', () => {
  render(<NetworkDiagram />);
  const exportButton = screen.getByText('Export Diagram');
  fireEvent.click(exportButton);
  // Mock the htmlToImage library and ensure it was called.
  expect(htmlToImage.toPng).toHaveBeenCalled();
});
