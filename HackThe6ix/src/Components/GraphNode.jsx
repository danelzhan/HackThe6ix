import React, { useState, useCallback } from 'react';

const GraphNode = ({ 
  node, 
  x, 
  y, 
  nodeIndex,
  isSelected, 
  onClick, 
  onMouseEnter, 
  onMouseLeave,
  onDragStart,
  onDrag,
  onDragEnd
}) => {
  const nodeRadius = node.din ? 50 : 20; // 50 for drugs, 20 for food
  const [isDragging, setIsDragging] = useState(false);
  
  const getNodeColor = () => {
    if (isSelected) {
      return getDrugColor(node);
    }
    // Default colors when not selected
    return node.din ? '#C5B6F1' : '#FFB8B8';
  };

  const getDrugColor = (nodeData) => {
    // Selected state colors - use the same as default for consistency
    return nodeData.din ? '#C5B6F1' : '#FFB8B8';
  };

  const handleMouseDown = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    
    setIsDragging(true);
    onDragStart(event, nodeIndex);
    
    const handleMouseMove = (e) => {
      onDrag(e, nodeIndex);
    };
    
    const handleMouseUp = (e) => {
      setIsDragging(false);
      onDragEnd(e, nodeIndex);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [nodeIndex, onDragStart, onDrag, onDragEnd]);

  const handleClick = useCallback((event) => {
    if (!isDragging) {
      onClick(node);
    }
  }, [isDragging, node, onClick]);

  return (
    <g
      transform={`translate(${x}, ${y})`}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      onClick={handleClick}
      onMouseEnter={() => onMouseEnter(node, x, y)}
      onMouseLeave={onMouseLeave}
      onMouseDown={handleMouseDown}
    >
      {/* Node circle */}
      <circle
        r={nodeRadius}
        fill={getNodeColor()}
        stroke="none"
        style={{
          filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.2))'
        }}
      />
      
      {/* Node name inside circle */}
      <text
        x={0}
        y={0}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={nodeRadius > 30 ? "12" : "10"}
        fontFamily="Arial, sans-serif"
        fill="#333"
        style={{ userSelect: 'none', pointerEvents: 'none' }}
      >
        {node.drug_name || node.name}
      </text>
    </g>
  );
};

export default GraphNode;
