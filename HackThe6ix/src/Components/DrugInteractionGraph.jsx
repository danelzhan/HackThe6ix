import { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { FaPills, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import { useFetchCurrentUser } from '../Bridge.js';
import GraphNode from './GraphNode.jsx';
import GraphEdge from './GraphEdge.jsx';
import DrugPopup from './DrugPopup.jsx';
import InteractionPopup from './InteractionPopup.jsx';

const DrugInteractionGraph = () => {
  const svgRef = useRef(null);
  const simulationRef = useRef(null);
  const nodesRef = useRef([]);
  const [tooltip, setTooltip] = useState({ 
    visible: false, 
    content: '', 
    x: 0, 
    y: 0 
  });
  const [interactions, setInteractions] = useState([]);
  const [patientNodes, setPatientNodes] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [highlightedEdges, setHighlightedEdges] = useState(new Set());
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [forceUpdate, setForceUpdate] = useState(0);
  const [drugPopup, setDrugPopup] = useState({ visible: false, drug: null });
  const [interactionPopup, setInteractionPopup] = useState({ visible: false, interaction: null });
  const { fetchCurrentUser, userEmail, isAuthenticated } = useFetchCurrentUser();

  // Fetch real interactions and nodes from backend
  useEffect(() => {
    const fetchPatientData = async () => {
      if (isAuthenticated && userEmail) {
        try {
          const patient = await fetchCurrentUser();
          
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
  }, [isAuthenticated, userEmail]);

  // Helper function to map backend severity to standardized severity
  const mapSeverityToStandard = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'major':
      case 'severe':
      case 'dangerous':
        return 'severe';
      case 'moderate':
      case 'medium':
      case 'caution':
        return 'moderate';
      case 'mild':
      case 'minor':
      case 'safe':
      default:
        return 'mild';
    }
  };

  // Process interactions for D3 format
  const generateInteractions = useCallback(() => {
    const networkInteractions = [];
    
    if (!interactions.length || !patientNodes.length) {
      return networkInteractions;
    }
    
    // Convert backend interaction data to D3 format
    interactions.forEach((interaction, index) => {
      // Handle drug-drug interactions
      if (interaction.din1 && interaction.din2) {
        const sourceIndex = patientNodes.findIndex(node => node.din === interaction.din1);
        const targetIndex = patientNodes.findIndex(node => node.din === interaction.din2);
        
        if (sourceIndex !== -1 && targetIndex !== -1) {
          networkInteractions.push({
            id: `edge-${index}`,
            source: sourceIndex,
            target: targetIndex,
            severity: mapSeverityToStandard(interaction.severity),
            description: interaction.advanced_info || `${interaction.interaction_type} interaction`,
            interaction_type: interaction.interaction_type,
            originalIndex: index // Store the original interaction index
          });
        }
      }
      // Handle drug-food interactions
      else if (interaction.din1 && interaction.name) {
        const drugIndex = patientNodes.findIndex(node => node.din === interaction.din1);
        const foodIndex = patientNodes.findIndex(node => node.name === interaction.name);
        
        if (drugIndex !== -1 && foodIndex !== -1) {
          networkInteractions.push({
            id: `edge-${index}`,
            source: drugIndex,
            target: foodIndex,
            severity: mapSeverityToStandard(interaction.severity),
            description: interaction.advanced_info || `${interaction.interaction_type} interaction`,
            interaction_type: interaction.interaction_type,
            originalIndex: index // Store the original interaction index
          });
        }
      }
    });
    
    return networkInteractions;
  }, [interactions, patientNodes]);

  const generateDrugDetails = (node) => {
    // Handle both drug nodes and food nodes
    let details = `Name: ${node.drug_name || node.name}`;
    if (node.din) details += `\nDIN: ${node.din}`;
    if (node.dosage) details += `\nDosage: ${node.dosage}`;
    if (node.frequency) details += `\nFrequency: ${node.frequency}`;
    if (node.notes) details += `\nNotes: ${node.notes}`;
    return details;
  };

  const handleNodeClick = useCallback((node) => {
    const nodeIndex = patientNodes.indexOf(node);
    setSelectedNode(nodeIndex);
    
    // Find connected edges
    const connectedEdgeIds = new Set();
    const processedInteractions = generateInteractions();
    
    processedInteractions.forEach(edge => {
      if (edge.source === nodeIndex || edge.target === nodeIndex) {
        connectedEdgeIds.add(edge.id);
      }
    });
    
    setHighlightedEdges(connectedEdgeIds);
  }, [patientNodes, generateInteractions]);

  const handleNodeMouseEnter = useCallback((node, x, y) => {
    setTooltip({
      visible: true,
      content: generateDrugDetails(node),
      x: x + 20,
      y: y - 10
    });
  }, []);

  const handleNodeMouseLeave = useCallback(() => {
    setTooltip(prev => ({ ...prev, visible: false }));
  }, []);

  const handleBackgroundClick = useCallback(() => {
    setSelectedNode(null);
    setHighlightedEdges(new Set());
    setTooltip(prev => ({ ...prev, visible: false }));
    setDrugPopup({ visible: false, drug: null });
    setInteractionPopup({ visible: false, interaction: null });
  }, []);

  const handleDrugClick = useCallback((drugNode) => {
    console.log('Drug clicked:', drugNode);
    console.log('Setting popup visible with drug:', drugNode.drug_name);
    setDrugPopup({ visible: true, drug: drugNode });
  }, []);

  const handleClosePopup = useCallback(() => {
    setDrugPopup({ visible: false, drug: null });
  }, []);

  const handleEdgeClick = useCallback((edge) => {
    // Use the originalIndex to get the backend interaction data
    if (edge.originalIndex !== undefined && interactions[edge.originalIndex]) {
      setInteractionPopup({ visible: true, interaction: interactions[edge.originalIndex] });
    }
  }, [interactions]);

  const handleCloseInteractionPopup = useCallback(() => {
    setInteractionPopup({ visible: false, interaction: null });
  }, []);

  // Drag handling functions
  const handleDragStart = useCallback((event, nodeIndex) => {
    event.preventDefault();
    event.stopPropagation();
    
    const simulation = simulationRef.current;
    const node = nodesRef.current[nodeIndex];
    
    if (simulation && node) {
      simulation.alphaTarget(0.3).restart();
      node.fx = node.x;
      node.fy = node.y;
    }
  }, []);

  const handleDrag = useCallback((event, nodeIndex) => {
    const simulation = simulationRef.current;
    const node = nodesRef.current[nodeIndex];
    const svgRect = svgRef.current?.getBoundingClientRect();
    
    if (simulation && node && svgRect) {
      const x = event.clientX - svgRect.left;
      const y = event.clientY - svgRect.top;
      
      node.fx = x;
      node.fy = y;
    }
  }, []);

  const handleDragEnd = useCallback((event, nodeIndex) => {
    const simulation = simulationRef.current;
    const node = nodesRef.current[nodeIndex];
    
    if (simulation && node) {
      simulation.alphaTarget(0);
      // Release the fixed position so physics can continue
      node.fx = null;
      node.fy = null;
    }
  }, []);

  // Update dimensions on window resize
  useEffect(() => {
    const updateDimensions = () => {
      const container = svgRef.current?.parentElement;
      if (container) {
        setDimensions({
          width: container.clientWidth,
          height: container.clientHeight
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // D3 Force Simulation Setup
  useEffect(() => {
    if (!patientNodes.length) return;

    // Prepare data for D3 - preserve existing positions if they exist
    const nodes = patientNodes.map((node, index) => ({
      ...node,
      id: index,
      x: node.x || dimensions.width / 2 + (Math.random() - 0.5) * 100,
      y: node.y || dimensions.height / 2 + (Math.random() - 0.5) * 100
    }));

    // Store nodes reference for drag operations
    nodesRef.current = nodes;

    const edges = generateInteractions();

    // Create force simulation
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(edges)
        .id(d => d.id)
        .distance(150)
        .strength(0.3)
      )
      .force("charge", d3.forceManyBody()
        .strength(-800)
        .distanceMax(300)
      )
      .force("center", d3.forceCenter(dimensions.width / 2, dimensions.height / 2))
      .force("collision", d3.forceCollide()
        .radius(d => d.din ? 55 : 25) // 55 for drugs, 25 for food (with some padding)
      );

    simulationRef.current = simulation;

    // Update positions on tick - this keeps physics running
    simulation.on("tick", () => {
      // Update the original patientNodes array with new positions
      nodes.forEach((node, index) => {
        if (patientNodes[index]) {
          patientNodes[index].x = node.x;
          patientNodes[index].y = node.y;
        }
      });
      // Force re-render
      setForceUpdate(prev => prev + 1);
    });

    return () => {
      simulation.stop();
    };
  }, [patientNodes.length, interactions.length, dimensions.width, dimensions.height]);

  return (
    <div id="graph_container" style={{ height: '100%', width: '100%', position: 'relative' }}>
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        style={{ border: '1px solid #ddd' }}
        onClick={handleBackgroundClick}
      >
        {/* Render edges first (so they appear behind nodes) */}
        {generateInteractions().map(edge => {
          const sourceNode = patientNodes[edge.source];
          const targetNode = patientNodes[edge.target];
          
          if (!sourceNode || !targetNode || !sourceNode.x || !targetNode.x) return null;
          
          return (
            <GraphEdge
              key={edge.id}
              edge={edge}
              sourceX={sourceNode.x}
              sourceY={sourceNode.y}
              targetX={targetNode.x}
              targetY={targetNode.y}
              isHighlighted={highlightedEdges.has(edge.id)}
              onEdgeClick={handleEdgeClick}
            />
          );
        })}
        
        {/* Render nodes */}
        {patientNodes.map((node, index) => {
          if (!node.x || !node.y) return null;
          
          return (
            <GraphNode
              key={index}
              node={node}
              nodeIndex={index}
              x={node.x}
              y={node.y}
              isSelected={selectedNode === index}
              onClick={handleNodeClick}
              onMouseEnter={handleNodeMouseEnter}
              onMouseLeave={handleNodeMouseLeave}
              onDragStart={handleDragStart}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
              onDrugClick={handleDrugClick}
            />
          );
        })}
      </svg>
      
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
          maxWidth: '300px',
          pointerEvents: 'none'
        }}>
          {tooltip.content.split('\n').map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      )}

      {/* Legend */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        left: '1rem',
        backgroundColor: 'white',
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
          <FaExclamationTriangle color="red" style={{ marginRight: '5px' }} />
          <span>Severe</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
          <FaExclamationTriangle color="orange" style={{ marginRight: '5px' }} />
          <span>Moderate</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FaCheckCircle color="green" style={{ marginRight: '5px' }} />
          <span>Mild</span>
        </div>
      </div>

      {/* Drug Popup */}
      <DrugPopup
        drugNode={drugPopup.drug}
        isVisible={drugPopup.visible}
        onClose={handleClosePopup}
      />

      {/* Interaction Popup */}
      <InteractionPopup
        interaction={interactionPopup.interaction}
        isVisible={interactionPopup.visible}
        onClose={handleCloseInteractionPopup}
      />
    </div>
  );
};

export default DrugInteractionGraph;