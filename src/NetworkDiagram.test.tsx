import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'; // Testing utilities for rendering and interacting with components
import '@testing-library/jest-dom'; // Jest DOM matchers for improved test assertions

import NetworkDiagram, {NodeForm, EdgeForm} from './NetworkDiagram'; // Import the NetworkDiagram component
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
  