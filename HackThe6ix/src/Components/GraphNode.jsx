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
  onDragEnd,
  onDrugClick
}) => {
  const nodeRadius = node.din ? 50 : 20; // 50 for drugs, 20 for food
  const [isDragging, setIsDragging] = useState(false);
  
  const getNodeColor = () => {
    // Use specified colors: C5B6F1 for drugs, FFB8B8 for food
    if (node.din) {
        // cardiovascular, antibiotic, mental, hormonal, pain, GI, OTC
        if(node.category === 'cardiovascular'){
            return '#7B89FF'
        }
        if(node.category === 'antibiotic'){
            return '#FFB8B8'
        }
        if(node.category === 'mental'){
            return '#B3FEA9'
        }
        if(node.category === 'hormonal'){
            return '#BAA9FE'
        }
        if(node.category === 'pain'){
            return '#FED5A9'
        }
        if(node.category === 'gi'){
            return '#FFFBB8'
        }
        if(node.category === 'otc'){
            return '#c5c5c5ff'
        }
        return '#C5B6F1'; // Default purple for drugs
      return '#C5B6F1'; // Purple for drugs
    } else {
      return '#D1FFB8'; // Grey for food
    }
  };

  const handleMouseDown = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    
    const startX = event.clientX;
    const startY = event.clientY;
    let hasDragged = false;
    
    setIsDragging(true);
    onDragStart(event, nodeIndex);
    
    const handleMouseMove = (e) => {
      const deltaX = Math.abs(e.clientX - startX);
      const deltaY = Math.abs(e.clientY - startY);
      
      if (deltaX > 5 || deltaY > 5) {
        hasDragged = true;
      }
      
      onDrag(e, nodeIndex);
    };
    
    const handleMouseUp = (e) => {
      setIsDragging(false);
      onDragEnd(e, nodeIndex);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      // If we didn't drag much, treat it as a click
      if (!hasDragged) {
        setTimeout(() => {
          if (node.din) {
            console.log('Drug node clicked:', node);
            onDrugClick && onDrugClick(node);
          } else {
            onClick && onClick(node);
          }
        }, 0);
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [nodeIndex, onDragStart, onDrag, onDragEnd, node, onDrugClick, onClick]);

  return (
    <g
      transform={`translate(${x}, ${y})`}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
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
      
      {/* Label inside the circle */}
      <text
        y="0"
        dy="0.35em"
        textAnchor="middle"
        fontSize="12"
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
