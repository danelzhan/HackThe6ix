import React from 'react';
import { FaPills } from 'react-icons/fa';

const GraphNode = ({ node, x, y, isSelected, onClick, onMouseEnter, onMouseLeave }) => {
  const nodeRadius = 20;
  
  const getNodeColor = () => {
    if (isSelected) {
      return getDrugColor(node);
    }
    return '#e0e0e0';
  };

  const getDrugColor = (nodeData) => {
    // Drug nodes have 'din' field, food nodes have 'name' only
    if (nodeData.din) {
      return nodeData.category === 'prescription' ? '#D2E5FF' : '#FFE8D2';
    } else {
      // Food nodes get a different color
      return '#E8F5E8';
    }
  };

  return (
    <g
      transform={`translate(${x}, ${y})`}
      style={{ cursor: 'pointer' }}
      onClick={() => onClick(node)}
      onMouseEnter={() => onMouseEnter(node, x, y)}
      onMouseLeave={onMouseLeave}
    >
      {/* Node circle */}
      <circle
        r={nodeRadius}
        fill={getNodeColor()}
        stroke="#b0b0b0"
        strokeWidth="2"
        style={{
          filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.2))'
        }}
      />
      
      {/* Icon */}
      <foreignObject
        x={-8}
        y={-8}
        width="16"
        height="16"
      >
        <FaPills 
          size={16} 
          color={node.din ? "#666" : "#4a8b3a"} 
        />
      </foreignObject>
      
      {/* Label */}
      <text
        y={nodeRadius + 15}
        textAnchor="middle"
        fontSize="12"
        fontFamily="Arial, sans-serif"
        fill="#333"
        style={{ userSelect: 'none' }}
      >
        {node.drug_name || node.name}
      </text>
    </g>
  );
};

export default GraphNode;
