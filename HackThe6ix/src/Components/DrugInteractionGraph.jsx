import { useEffect, useRef } from 'react';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import 'vis-network/styles/vis-network.css';
import { FaPills, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

const DrugInteractionGraph = ({ medications }) => {
  const networkRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!medications.length) return;

    // Transform medication data into nodes and edges
    const nodes = new DataSet(
      medications.map((med, index) => ({
        id: index,
        label: med.name,
        title: generateDrugTooltip(med),
        color: getDrugColor(med),
        shape: 'box',
        margin: 10,
        font: { size: 14 },
      }))
    );

    // Generate sample interactions !!!!!!!!!!!!!! (replace with actual data)
    const edges = new DataSet(
      generateInteractions(medications).map(interaction => ({
        from: interaction.from,
        to: interaction.to,
        label: interaction.type,
        color: getInteractionColor(interaction.type),
        width: 2,
        dashes: interaction.type === 'Caution',
        length: 300
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
        hover: true,
      },
    };

    networkRef.current = new Network(containerRef.current, data, options);


    return () => {

    };
  }, [medications]);

  const generateDrugTooltip = (med) => {
    let tooltip = ``;
    if (med.dosage) tooltip += `Dosage: ${med.dosage}`;
    if (med.frequency) tooltip += `\nFrequency: ${med.frequency}`;
    if (med.notes) tooltip += `\nNotes: ${med.notes}`;
    return tooltip;
  };


  return (
    <div style={{ height: '500px', border: '1px solid #eee', borderRadius: '8px' }}>
      <div ref={containerRef} style={{ height: '100%', width: '100%' }} />
      
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        backgroundColor: 'white',
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
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
  // Customize based on your drug properties
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