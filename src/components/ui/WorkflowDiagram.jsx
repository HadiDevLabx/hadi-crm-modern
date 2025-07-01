import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  addEdge,
  ConnectionLineType,
  Panel,
  useReactFlow,
  useNodesState,
  useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion } from 'framer-motion';
import { cn } from '../../utils/shadcn-utils';
import * as d3 from 'd3';

// Custom node styles
const nodeStyles = {
  default: {
    background: '#ffffff',
    color: '#333333',
    border: '1px solid #ddd',
  },
  action: {
    background: '#4F46E5',
    color: '#ffffff',
    border: '1px solid #4338CA',
  },
  decision: {
    background: '#F59E0B',
    color: '#ffffff',
    border: '1px solid #D97706',
  },
  input: {
    background: '#10B981',
    color: '#ffffff',
    border: '1px solid #059669',
  },
  output: {
    background: '#EF4444',
    color: '#ffffff',
    border: '1px solid #DC2626',
  }
};

// Custom node component
const CustomNode = ({ data, isConnectable }) => {
  const nodeType = data.type || 'default';
  const style = nodeStyles[nodeType] || nodeStyles.default;
  
  return (
    <div 
      className={cn(
        'px-4 py-2 rounded-md shadow-md transition-all duration-200',
        'hover:shadow-lg hover:scale-105',
      )}
      style={{
        background: style.background,
        color: style.color,
        borderColor: style.border,
      }}
    >
      {data.label}
      {data.description && (
        <div className="text-xs mt-1 opacity-80">
          {data.description}
        </div>
      )}
    </div>
  );
};

// Node types definition
const nodeTypes = {
  custom: CustomNode,
};

// WorkflowDiagram component
export const WorkflowDiagram = ({
  className,
  style,
  height = 500,
  nodes: initialNodes = [],
  edges: initialEdges = [],
  defaultLayout = 'horizontal',
  autoLayout = true,
  editable = false,
  onNodesChange,
  onEdgesChange,
  onConnect,
  ...props
}) => {
  // Node and edge state
  const [nodes, setNodes, onNodesChangeInternal] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChangeInternal] = useEdgesState(initialEdges);
  const [layout, setLayout] = useState(defaultLayout);
  const reactFlowInstance = useReactFlow();
  const reactFlowWrapper = useRef(null);

  // Handle node changes
  const handleNodesChange = useCallback((changes) => {
    onNodesChangeInternal(changes);
    if (onNodesChange) onNodesChange(changes);
  }, [onNodesChangeInternal, onNodesChange]);

  // Handle edge changes
  const handleEdgesChange = useCallback((changes) => {
    onEdgesChangeInternal(changes);
    if (onEdgesChange) onEdgesChange(changes);
  }, [onEdgesChangeInternal, onEdgesChange]);

  // Handle connections
  const handleConnect = useCallback((params) => {
    const newEdge = {
      ...params,
      animated: true,
      type: 'smoothstep',
    };
    
    if (onConnect) onConnect(newEdge);
    setEdges((eds) => addEdge(newEdge, eds));
  }, [setEdges, onConnect]);

  // Auto layout nodes using D3 force simulation
  const applyAutoLayout = useCallback(() => {
    if (!autoLayout || nodes.length === 0) return;

    // Clone nodes to avoid direct mutation
    const nodesCopy = nodes.map(node => ({ ...node }));
    
    // Create force simulation
    const simulation = d3.forceSimulation(nodesCopy)
      .force('link', d3.forceLink()
        .id(d => d.id)
        .links(edges.map(edge => ({
          source: edge.source,
          target: edge.target
        })))
        .distance(150)
      )
      .force('charge', d3.forceManyBody().strength(-500))
      .force('collide', d3.forceCollide(80));
    
    if (layout === 'horizontal') {
      simulation.force('x', d3.forceX().strength(0.1))
        .force('y', d3.forceY().strength(0.1));
    } else {
      simulation.force('center', d3.forceCenter());
    }
    
    // Run simulation synchronously
    for (let i = 0; i < 300; i++) {
      simulation.tick();
    }
    
    // Update node positions
    const updatedNodes = nodesCopy.map(node => ({
      ...node,
      position: { x: node.x, y: node.y }
    }));
    
    setNodes(updatedNodes);
  }, [nodes, edges, layout, autoLayout, setNodes]);

  // Apply layout when nodes/edges/layout change
  useEffect(() => {
    applyAutoLayout();
  }, [applyAutoLayout]);

  // Layout switchers
  const applyHorizontalLayout = () => {
    setLayout('horizontal');
    applyAutoLayout();
  };
  
  const applyVerticalLayout = () => {
    setLayout('vertical');
    applyAutoLayout();
  };

  // Center view
  const centerView = useCallback(() => {
    if (reactFlowInstance) {
      reactFlowInstance.fitView({ padding: 0.2 });
    }
  }, [reactFlowInstance]);

  // Center view after mounting
  useEffect(() => {
    setTimeout(centerView, 100);
  }, [centerView]);

  // Handle drag and drop
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event) => {
    if (!editable) return;
    event.preventDefault();

    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const type = event.dataTransfer.getData('application/reactflow');
    
    if (typeof type === 'undefined' || !type) {
      return;
    }

    const position = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });
    
    const newNode = {
      id: `node-${Date.now()}`,
      type: 'custom',
      position,
      data: { label: `${type} node`, type },
    };

    setNodes((nds) => nds.concat(newNode));
  }, [reactFlowInstance, setNodes, editable]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        'rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
        className
      )}
      style={{ height, ...style }}
      {...props}
    >
      <div ref={reactFlowWrapper} className="w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={handleConnect}
          onDragOver={onDragOver}
          onDrop={onDrop}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          connectionLineType={ConnectionLineType.SmoothStep}
          defaultEdgeOptions={{ animated: true, type: 'smoothstep' }}
          className="bg-gray-50 dark:bg-gray-900"
        >
          <Controls />
          <Background color="#aaaaaa" gap={16} />
          <MiniMap 
            nodeStrokeColor={(n) => {
              const nodeType = n.data?.type || 'default';
              return nodeStyles[nodeType]?.border || nodeStyles.default.border;
            }}
            nodeColor={(n) => {
              const nodeType = n.data?.type || 'default';
              return nodeStyles[nodeType]?.background || nodeStyles.default.background;
            }}
          />
          <Panel position="top-right">
            <div className="flex gap-2">
              <button
                onClick={applyHorizontalLayout}
                className={cn(
                  'px-3 py-1 text-xs rounded transition-colors',
                  layout === 'horizontal' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                )}
              >
                Horizontal
              </button>
              <button
                onClick={applyVerticalLayout}
                className={cn(
                  'px-3 py-1 text-xs rounded transition-colors',
                  layout === 'vertical' 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                )}
              >
                Vertical
              </button>
              <button
                onClick={centerView}
                className="px-3 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Center
              </button>
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </motion.div>
  );
};

// Workflow nodes sidebar component for editing mode
export const WorkflowNodesSidebar = ({ className, style }) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        'p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800',
        className
      )}
      style={style}
    >
      <h3 className="font-medium mb-3">Nodes</h3>
      <div className="flex flex-col gap-2">
        {Object.keys(nodeStyles).map((type) => (
          <div
            key={type}
            draggable
            onDragStart={(event) => onDragStart(event, type)}
            className="cursor-grab p-2 rounded text-sm capitalize"
            style={{
              background: nodeStyles[type].background,
              color: nodeStyles[type].color,
              border: `1px solid ${nodeStyles[type].border}`
            }}
          >
            {type}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// FlowProvider for managing the flow context
export const FlowProvider = ({ children }) => {
  return (
    <ReactFlow.ReactFlowProvider>
      {children}
    </ReactFlow.ReactFlowProvider>
  );
};

export default WorkflowDiagram;
