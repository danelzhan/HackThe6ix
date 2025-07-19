import { useEffect, useRef, useState } from 'react';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import 'vis-network/styles/vis-network.css';
import { FaPills, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';


const DrugInteractionGraph = ({ medications }) => {
  const networkRef = useRef(null);
  const containerRef = useRef(null);
  const [tooltip, setTooltip] = useState({ 
    visible: false, 
    content: '', 
    x: 0, 
    y: 0 
  });

  

  const generateDrugDetails = (med) => {
    let details = `Name: ${med.name}`;
    if (med.dosage) details += `\nDosage: ${med.dosage}`;
    if (med.frequency) details += `\nFrequency: ${med.frequency}`;
    if (med.notes) details += `\nNotes: ${med.notes}`;
    return details;
  };

  useEffect(() => {
    if (!medications.length) return;

    const nodes = new DataSet(
      medications.map((med, index) => ({
        id: index,
        label: med.name,
        color: '#e0e0e0',
        //opacity: 0.7,
        shape: 'box',
        margin: 10,
        font: { size: 14 },
        medication: med, // Store full medication data
      }))
    );

    const edges = new DataSet(
      generateInteractions(medications).map(interaction => ({
        from: interaction.from,
        to: interaction.to,
        label: interaction.type,
        //color: getInteractionColor(interaction.type),
        color: '#b0b0b0',
        width: 2,
        dashes: interaction.type === 'Caution',
        length: 300,
      }))
    );

    const data = { nodes, edges };
    const options = {
      physics: {
        enabled: true,
        repulsion: {
          nodeDistance: 400,
        },
      },
      nodes: {
        borderWidth: 2,
        shadow: true,
      },
      edges: {
        smooth: true,
        arrows: { to: { enabled: false } },
        font: { size: 10, align: 'middle' },
      },
      interaction: {
        dragNodes: true,
        hover: false,
      },
    };

    networkRef.current = new Network(containerRef.current, data, options);

  const handleClick = (params) => {
      if (params.nodes.length) {
        const nodeId = params.nodes[0];
        const node = nodes.get(nodeId);

        // Update node's color
        nodes.update({
          id: nodeId,
          color: {
            background:  getDrugColor(nodes.get(nodeId).medication), 
            border: getDrugColor(nodes.get(nodeId).medication),
            highlight: {
              background:  getDrugColor(nodes.get(nodeId).medication),
              border: getDrugColor(nodes.get(nodeId).medication)
            }
          },
          font: { color: '#000' }
        });

        // Highlight connected edges
        const connectedEdges = networkRef.current.getConnectedEdges(nodeId);
        edges.update(connectedEdges.map(edgeId => ({
          id: edgeId,
          color: getInteractionColor(edges.get(edgeId).label),
          width: 2
        })));

        if (node?.medication) {
          setTooltip({
            visible: true,
            content: generateDrugDetails(node.medication),
            x: params.pointer.DOM.x,
            y: params.pointer.DOM.y
          });
        }
      } else {
        // Reset all nodes and edges when clicking empty space
        nodes.update(nodes.get().map(node => ({
          id: node.id,
          color: {
            background: '#e0e0e0',
            border: '#b0b0b0',
            highlight: {
              background: getDrugColor(node.medication),
              border: getDrugColor(node.medication)
            }
          },
          font: { color: '#333' }
        })));

        edges.update(edges.get().map(edge => ({
          id: edge.id,
          color: '#b0b0b0',
          width: 1
        })));

        setTooltip({ ...tooltip, visible: false });
      }
    };

    networkRef.current.on('click', handleClick);

    return () => {
      networkRef.current?.off('click', handleClick);
    };
  }, [medications]);

  return (
    <div style={{ height: '500px', border: '1px solid #eee', borderRadius: '8px', position: 'relative' }}>
      <div ref={containerRef} style={{ height: '100%', width: '100%' }} />
      
      {/* Tooltip */}
      {tooltip.visible && (
        <div style={{
          position: 'absolute',
          left: tooltip.x,
          top: tooltip.y,
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          zIndex: 100,
          maxWidth: '300px'
        }}>
          {tooltip.content.split('\n').map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      )}

      {/* Legend */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        backgroundColor: 'white',
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
          <FaExclamationTriangle color="red" style={{ marginRight: '5px' }} />
          <span>Dangerous</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
          <FaExclamationTriangle color="orange" style={{ marginRight: '5px' }} />
          <span>Caution</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FaCheckCircle color="green" style={{ marginRight: '5px' }} />
          <span>Safe</span>
        </div>
      </div>
    </div>
  );
};
 
// Helper functions
const getDrugColor = (med) => {
  // Customize based on drug properties
  return med.category === 'prescription' ? '#D2E5FF' : '#FFE8D2';
};

const getInteractionColor = (type) => {
  switch (type) {
    case 'Dangerous': return 'red';
    case 'Caution': return 'orange';
    default: return 'green';
  }
};

// Mock interaction generator - !!!!!!!!!!!!!!! replace with actual data
// Right now its generating random interactions, !!! REPLACE
const generateInteractions = (medications) => {
  const interactions = [];
  for (let i = 0; i < medications.length; i++) {
    for (let j = i + 1; j < medications.length; j++) {
      const types = ['Dangerous', 'Caution', 'Safe'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      interactions.push({
        from: i,
        to: j,
        type: randomType,
        description: `Potential ${randomType.toLowerCase()} interaction`
      });
    }
  }
  return interactions;
};

export default DrugInteractionGraph;