import React from 'react';

const GraphEdge = ({ edge, sourceX, sourceY, targetX, targetY, isHighlighted }) => {
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
      case 'severe': return 'Dangerous';
      case 'moderate': return 'Caution';
      case 'mild': return 'Safe';
      default: return 'Unknown';
    }
  };

  const strokeWidth = isHighlighted ? 3 : 1.5;
  const color = isHighlighted ? getInteractionColor(edge.severity) : '#b0b0b0';

  // Calculate midpoint for label
  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2;

  return (
    <g>
      {/* Edge line */}
      <line
        x1={sourceX}
        y1={sourceY}
        x2={targetX}
        y2={targetY}
        stroke={color}
        strokeWidth={strokeWidth}
        opacity={0.8}
      />
      
      {/* Label background */}
      {isHighlighted && (
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
          />
          
          {/* Label text */}
          <text
            x={midX}
            y={midY + 4}
            textAnchor="middle"
            fontSize="10"
            fontFamily="Arial, sans-serif"
            fill={color}
            style={{ userSelect: 'none' }}
          >
            {getSeverityLabel(edge.severity)}
          </text>
        </>
      )}
    </g>
  );
};

export default GraphEdge;
