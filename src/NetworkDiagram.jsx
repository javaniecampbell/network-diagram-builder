// Step-by-Step Chain of Thought for Solution
// Summary: The solution involves analyzing the provided diagrams, defining requirements for a React-based interactive diagram tool, and implementing a network diagram using React Flow with customizable nodes and edges. The implementation will also include an interface for modifying nodes and exporting the diagram.

import  { useState, useCallback } from 'react';
// ReactFlow: Main library for creating and managing diagrams
import  {
    ReactFlow,
  ReactFlowProvider, // ReactFlowProvider: Context provider to manage internal state of React Flow
  addEdge, // addEdge: Utility function to add a new connection between nodes
  MiniMap, // MiniMap: Component to provide an overview of the entire diagram
  Controls, // Controls: Component to add zoom and pan controls
  Background, // Background: Component to render a customizable background grid
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './NetworkDiagram.css'; // Custom CSS for styling
import * as htmlToImage from 'html-to-image'; // Utility to export diagram as an image
import { NodeForm } from './NodeForm';
import { EdgeForm } from './EdgeForm';


const EdgeFormModal = ({ isOpen, onClose, onAddEdge }) => {
  const [source, setSource] = useState('');
  const [target, setTarget] = useState('');
  const [label, setLabel] = useState('');

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add Edge</h2>
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
        <button onClick={() => { onAddEdge({ source, target, label }); onClose(); }}>Add Edge</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

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
    type: 'output',
    data: { label: 'Database (Deployment Node)' },
    position: { x: 1000, y: 100 },
    style: {
      backgroundColor: '#e8f5e9',
      border: '1px solid #81c784',
      padding: 10,
    },
  },
  {
    id: '5',
    type: 'customNode',
    data: { label: 'Route 53 (Infrastructure Node)', details: 'Highly available and scalable cloud DNS service.' },
    position: { x: 100, y: 300 },
    style: {
      backgroundColor: '#e3f2fd',
      border: '1px solid #90caf9',
      padding: 10,
    },
  },
  {
    id: '6',
    type: 'customNode',
    data: { label: 'Elastic Load Balancer (Infrastructure Node)', details: 'Automatically distributes incoming application traffic.' },
    position: { x: 400, y: 300 },
    style: {
      backgroundColor: '#e3f2fd',
      border: '1px solid #90caf9',
      padding: 10,
    },
  },
  {
    id: '7',
    type: 'customNode',
    data: { label: 'Web Application (Deployment Node)', details: 'Allows employees to view and manage information regarding the veterinarians, clients, and their pets.' },
    position: { x: 700, y: 300 },
    style: {
      backgroundColor: '#fff3e0',
      border: '1px solid #ffb74d',
      padding: 10,
    },
  },
  {
    id: '8',
    type: 'customNode',
    data: { label: 'Database (Deployment Node)', details: 'Stores information regarding the veterinarians, clients, and their pets.' },
    position: { x: 1000, y: 300 },
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
  { id: 'e5-6', source: '5', target: '6', label: 'Forwards requests to' },
  { id: 'e6-7', source: '6', target: '7', label: 'Forwards requests to' },
  { id: 'e7-8', source: '7', target: '8', label: 'Reads from and writes to' },
];

const CustomNode = ({ data }) => {
  return (
    <div className="custom-node" style={{ padding: 10, border: '1px solid #333', backgroundColor: '#f9f9f9', borderRadius: 5 }}>
      <h4>{data.label}</h4>
      <p>{data.details}</p>
    </div>
  );
};

const nodeTypes = {
  customNode: CustomNode,
};

const NetworkDiagram = ({ miniMapHeight = 100, miniMapWidth = 150 }) => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [isEdgeFormOpen, setIsEdgeFormOpen] = useState(false);
  const [newNodeLabel, setNewNodeLabel] = useState('');
  const [newNodeDetails, setNewNodeDetails] = useState('');
  

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

  const addNode = () => {
    const id = (nodes.length + 1).toString();
    const newNode = {
      id,
      type: 'customNode',
      data: { label: newNodeLabel, details: newNodeDetails },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      style: {
        backgroundColor: '#e3f2fd',
        border: '1px solid #90caf9',
        padding: 10,
      },
    };
    setNodes((nds) => [...nds, newNode]);
    setNewNodeLabel('');
    setNewNodeDetails('');
  };

  return (
    <div id="network-diagram" style={{ height: '100vh' }}>
      <ReactFlowProvider>
      <div className="node-form">
          <input
            type="text"
            placeholder="Node Label"
            value={newNodeLabel}
            onChange={(e) => setNewNodeLabel(e.target.value)}
          />
          <input
            type="text"
            placeholder="Node Details"
            value={newNodeDetails}
            onChange={(e) => setNewNodeDetails(e.target.value)}
          />
          <button onClick={addNode}>Add Node</button>
        </div>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          nodeTypes={nodeTypes}
        >
         <MiniMap nodeColor={(node) => {
            switch (node.type) {
              case 'input':
                return '#0041d0';
              case 'default':
                return '#1a192b';
              case 'output':
                return '#ff0072';
              default:
                return '#eee';
            }
          }} height={miniMapHeight} width={miniMapWidth} />
          <Controls style={{ top: 'auto', bottom: 20, right: 20, width: '10px' }} />
          <Background color="#aaa" gap={16} />
        </ReactFlow>
        {/* <EdgeForm onAddEdge={(newEdge) => setEdges((eds) => [...eds, newEdge])} /> */}
        <button onClick={() => setIsEdgeFormOpen(true)}>Add Edge</button>
          
        <button onClick={handleExport}>Export Diagram</button>
        <EdgeFormModal
              isOpen={isEdgeFormOpen}
              onClose={() => setIsEdgeFormOpen(false)}
              onAddEdge={(edge) => console.log('Edge added:', edge)}
            />
      </ReactFlowProvider>
    </div>
  );
};

export default NetworkDiagram;




export {
    NodeForm,
    EdgeForm,
    NetworkDiagram
}