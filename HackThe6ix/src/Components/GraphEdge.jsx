import React, { useState } from 'react';

const GraphEdge = ({ edge, sourceX, sourceY, targetX, targetY, isHighlighted, onEdgeClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getInteractionColor = (severity) => {
    switch (severity) {
      case 'severe': return 'red';
      case 'moderate': return 'orange';
      case 'mild': return 'green';
      default: return '#b0b0b0';
    }
  };

  const getSeverityLabel = (severity) => {
    switch (severity) {
      case 'severe': return 'Severe';
      case 'moderate': return 'Moderate';
      case 'mild': return 'Mild';
      default: return 'Unknown';
    }
  };

  const strokeWidth = isHighlighted || isHovered ? 3 : 1.5;
  const color = isHighlighted || isHovered ? getInteractionColor(edge.severity) : '#b0b0b0';
  const glowFilter = isHovered ? `drop-shadow(0 0 8px ${getInteractionColor(edge.severity)})` : 'none';

  // Calculate midpoint for label
  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2;

  return (
    <g 
      onClick={(e) => {
        e.stopPropagation();
        console.log('GraphEdge clicked, calling onEdgeClick with:', edge);
        onEdgeClick && onEdgeClick(edge);
      }} 
      style={{ cursor: onEdgeClick ? 'pointer' : 'default' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Invisible wider line for easier clicking and hovering */}
      <line
        x1={sourceX}
        y1={sourceY}
        x2={targetX}
        y2={targetY}
        stroke="transparent"
        strokeWidth="10"
        style={{ cursor: onEdgeClick ? 'pointer' : 'default' }}
        onClick={(e) => {
          e.stopPropagation();
          console.log('Invisible line clicked');
          onEdgeClick && onEdgeClick(edge);
        }}
      />
      
      {/* Visible edge line */}
      <line
        x1={sourceX}
        y1={sourceY}
        x2={targetX}
        y2={targetY}
        stroke={color}
        strokeWidth={strokeWidth}
        opacity={isHovered ? 1 : 0.8}
        style={{ 
          pointerEvents: 'none',
          filter: glowFilter,
          transition: 'all 0.2s ease'
        }} // Let the wider invisible line handle clicks
      />
      
      {/* Label background */}
      {(isHighlighted || isHovered) && (
        <>
          <rect
            x={midX - 25}
            y={midY - 8}
            width="50"
            height="16"
            fill="white"
            stroke={color}
            strokeWidth="1"
            rx="3"
            opacity={0.9}
            style={{ 
              filter: isHovered ? `drop-shadow(0 0 4px ${getInteractionColor(edge.severity)})` : 'none',
              transition: 'all 0.2s ease'
            }}
          />
          
          {/* Label text */}
          <text
            x={midX}
            y={midY + 4}
            textAnchor="middle"
            fontSize="10"
            fontFamily="Arial, sans-serif"
            fill={color}
            style={{ 
              userSelect: 'none',
              filter: isHovered ? `drop-shadow(0 0 2px ${getInteractionColor(edge.severity)})` : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            {getSeverityLabel(edge.severity)}
          </text>
        </>
      )}
    </g>
  );
};

export default GraphEdge;
