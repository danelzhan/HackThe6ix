import { useEffect, useRef, useState } from 'react';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import 'vis-network/styles/vis-network.css';
import { FaPills, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import { fetchUserByEmail } from '../Bridge.js';


const DrugInteractionGraph = ({ patientEmail }) => {
  const networkRef = useRef(null);
  const containerRef = useRef(null);
  const [tooltip, setTooltip] = useState({ 
    visible: false, 
    content: '', 
    x: 0, 
    y: 0 
  });
  const [interactions, setInteractions] = useState([]);
  const [patientNodes, setPatientNodes] = useState([]);

  // Fetch real interactions and nodes from backend
  useEffect(() => {
    const fetchPatientData = async () => {
      if (patientEmail) {
        try {
          const patient = await fetchUserByEmail(patientEmail);
          
          if (patient) {
            // Extract nodes and edges from the Patient object
            setPatientNodes(patient.nodes || []);
            setInteractions(patient.edges || []);
          }
        } catch (error) {
          console.error('Error fetching patient data:', error);
          setInteractions([]);
          setPatientNodes([]);
        }
      }
    };
    
    fetchPatientData();
  }, [patientEmail]);

  // Helper function to map backend severity to display type
  const mapSeverityToType = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'major':
      case 'severe':
        return 'Dangerous';
      case 'moderate':
      case 'medium':
        return 'Caution';
      case 'mild':
      default:
        return 'Safe';
    }
  };

  // Real interaction generator - connected to backend
  const generateInteractions = () => {
    // Use real interactions from backend instead of mock data
    const networkInteractions = [];
    
    if (!interactions.length) {
      return networkInteractions;
    }
    
    // Convert backend interaction data to network format
    interactions.forEach(interaction => {
      // Handle drug-drug interactions
      if (interaction.din1 && interaction.din2) {
        const fromIndex = patientNodes.findIndex(node => node.din === interaction.din1);
        const toIndex = patientNodes.findIndex(node => node.din === interaction.din2);
        
        if (fromIndex !== -1 && toIndex !== -1) {
          networkInteractions.push({
            from: fromIndex,
            to: toIndex,
            type: mapSeverityToType(interaction.severity),
            description: interaction.advanced_info || `${interaction.interaction_type} interaction`,
            severity: interaction.severity,
            interaction_type: interaction.interaction_type
          });
        }
      }
      // Handle drug-food interactions
      else if (interaction.din1 && interaction.name) {
        const drugIndex = patientNodes.findIndex(node => node.din === interaction.din1);
        const foodIndex = patientNodes.findIndex(node => node.name === interaction.name);
        
        if (drugIndex !== -1 && foodIndex !== -1) {
          networkInteractions.push({
            from: drugIndex,
            to: foodIndex,
            type: mapSeverityToType(interaction.severity),
            description: interaction.advanced_info || `${interaction.interaction_type} interaction`,
            severity: interaction.severity,
            interaction_type: interaction.interaction_type
          });
        }
      }
    });
    
    return networkInteractions;
  };

  

  const generateDrugDetails = (node) => {
    // Handle both drug nodes and food nodes
    let details = `Name: ${node.drug_name || node.name}`;
    if (node.din) details += `\nDIN: ${node.din}`;
    if (node.dosage) details += `\nDosage: ${node.dosage}`;
    if (node.frequency) details += `\nFrequency: ${node.frequency}`;
    if (node.notes) details += `\nNotes: ${node.notes}`;
    return details;
  };

  useEffect(() => {
    if (!patientNodes.length) return;

    const nodes = new DataSet(
      patientNodes.map((node, index) => ({
        id: index,
        label: node.drug_name || node.name, // Use drug_name for drugs, name for foods
        color: '#e0e0e0',
        //opacity: 0.7,
        shape: 'box',
        margin: 10,
        font: { size: 14 },
        medication: node, // Store full node data
      }))
    );

    const edges = new DataSet(
      generateInteractions().map(interaction => ({
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
  }, [patientNodes, interactions]);

  return (
    <div id="graph_container">
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
        position: 'fixed',
        bottom: '10rem',
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
const getDrugColor = (node) => {
  // Customize based on node properties
  // Drug nodes have 'din' field, food nodes have 'name' only
  if (node.din) {
    return node.category === 'prescription' ? '#D2E5FF' : '#FFE8D2';
  } else {
    // Food nodes get a different color
    return '#E8F5E8';
  }
};

const getInteractionColor = (type) => {
  switch (type) {
    case 'Dangerous': return 'red';
    case 'Caution': return 'orange';
    default: return 'green';
  }
};

export default DrugInteractionGraph;