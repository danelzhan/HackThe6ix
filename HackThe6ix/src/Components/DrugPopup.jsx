import React, { useEffect, useState } from 'react';
import { useFetchCurrentUser } from '../Bridge.js';
import InteractionPopup from './InteractionPopup.jsx';

const DrugPopup = ({ drugNode, isVisible, onClose }) => {
  console.log('DrugPopup rendered:', { drugNode, isVisible });
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedInteraction, setSelectedInteraction] = useState(null);
  const [interactionPopupVisible, setInteractionPopupVisible] = useState(false);
  const { fetchCurrentUser, userEmail, isAuthenticated } = useFetchCurrentUser();
  
  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      // Fetch interactions when popup becomes visible
      fetchInteractions();
      // Small delay to ensure the component is mounted before starting animation
      const timer = setTimeout(() => {
        setIsAnimating(true);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      // Wait for animation to complete before removing from DOM
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const fetchInteractions = async () => {
    if (!isAuthenticated || !userEmail || !drugNode?.din) {
      return;
    }

    try {
      setLoading(true);
      const patient = await fetchCurrentUser();
      
      if (patient && patient.edges) {
        // Find interactions where this drug appears as din1 or din2 (drug-drug)
        // or where this drug is din1 and there's a name field (drug-food/substance)
        const drugInteractions = patient.edges.filter(edge => 
          edge.din1 === drugNode.din || edge.din2 === drugNode.din
        );

        // Categorize and enrich interactions
        const enrichedInteractions = drugInteractions.map(interaction => {
          // Check if it's a drug-drug interaction (both din1 and din2 exist)
          if (interaction.din1 && interaction.din2) {
            const otherDin = interaction.din1 === drugNode.din ? interaction.din2 : interaction.din1;
            const otherDrug = patient.nodes?.find(node => node.din === otherDin);
            
            return {
              ...interaction,
              type: 'drug-drug',
              otherDin,
              otherName: otherDrug?.drug_name || `Drug ${otherDin}`,
              currentDrugName: drugNode.drug_name
            };
          }
          // Drug-food/substance interaction (din1 + name field)
          else if (interaction.din1 === drugNode.din && interaction.name) {
            return {
              ...interaction,
              type: 'drug-food',
              otherName: interaction.name,
              currentDrugName: drugNode.drug_name
            };
          }
          
          return null;
        }).filter(Boolean); // Remove null entries

        setInteractions(enrichedInteractions);
      }
    } catch (error) {
      console.error('Error fetching interactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsAnimating(false);
    // Wait for animation to complete before actually closing
    setTimeout(() => {
      onClose();
    }, 400);
  };

  const getSeverityColor = (severity) => {
    const severityLower = severity?.toLowerCase() || '';
    if (severityLower.includes('severe') || severityLower.includes('major')) {
      return { bg: '#fee2e2', border: '#ef4444', text: '#991b1b', icon: '⚠️' };
    } else if (severityLower.includes('moderate')) {
      return { bg: '#fef3c7', border: '#f59e0b', text: '#92400e', icon: '⚡' };
    } else if (severityLower.includes('mild') || severityLower.includes('minor')) {
      return { bg: '#dcfce7', border: '#22c55e', text: '#166534', icon: 'ℹ️' };
    }
    return { bg: '#f3f4f6', border: '#6b7280', text: '#374151', icon: '💊' };
  };

  const getInteractionTypeIcon = (type) => {
    return type === 'drug-drug' ? '💊' : '🍎';
  };

  const handleInteractionClick = (interaction) => {
    setSelectedInteraction(interaction);
    setInteractionPopupVisible(true);
  };

  const handleInteractionPopupClose = () => {
    setInteractionPopupVisible(false);
    setSelectedInteraction(null);
  };

  if (!shouldRender || !drugNode) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: `rgba(0, 0, 0, ${isAnimating ? '0.5' : '0'})`,
          zIndex: 1000,
          transition: 'background-color 0.4s ease',
          cursor: 'pointer'
        }}
        onClick={handleClose}
      >
        {/* Popup Window */}
        <div 
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'white',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            borderBottomLeftRadius: '0px',
            borderBottomRightRadius: '0px',
            maxHeight: '85vh',
            minHeight: '60vh',
            overflow: 'hidden',
            boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.2)',
            transform: `translateY(${isAnimating ? '0%' : '100%'})`,
            transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            display: 'flex',
            flexDirection: 'column'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drag Handle */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '12px 0 8px 0'
          }}>
            <div style={{
              width: '40px',
              height: '4px',
              backgroundColor: '#d1d5db',
              borderRadius: '2px'
            }} />
          </div>

          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #C5B6F1 0%, #A89EE8 100%)',
            padding: '20px 24px',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            position: 'relative',
            marginTop: '-4px'
          }}>
            <button
              onClick={handleClose}
              style={{
                position: 'absolute',
                top: '15px',
                right: '20px',
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer',
                color: 'white',
                padding: '8px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s ease',
                fontWeight: 'bold'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
            >
              ×
            </button>
            <h2 style={{
              margin: '0',
              color: 'white',
              fontSize: '24px',
              fontWeight: 'bold',
              paddingRight: '50px',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              {drugNode.drug_name || 'Drug Information'}
            </h2>
            <div style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.9)',
              marginTop: '4px',
              fontWeight: '500'
            }}>
              {drugNode.din ? `DIN: ${drugNode.din}` : 'Medication Details'}
            </div>
          </div>

          {/* Content */}
          <div style={{ 
            padding: '24px', 
            flex: 1, 
            overflowY: 'auto',
            backgroundColor: '#fafafa'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Basic Information */}
              <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '16px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                border: '1px solid #e5e7eb'
              }}>
                <h3 style={{ 
                  margin: '0 0 16px 0', 
                  color: '#1f2937', 
                  fontSize: '18px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#C5B6F1',
                    borderRadius: '50%'
                  }} />
                  Basic Information
                </h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {drugNode.din && (
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      padding: '12px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px'
                    }}>
                      <span style={{ fontWeight: '600', color: '#374151' }}>DIN:</span>
                      <span style={{ color: '#1f2937', fontWeight: '500' }}>{drugNode.din}</span>
                    </div>
                  )}
                  {drugNode.dosage && (
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      padding: '12px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px'
                    }}>
                      <span style={{ fontWeight: '600', color: '#374151' }}>Dosage:</span>
                      <span style={{ color: '#1f2937', fontWeight: '500' }}>{drugNode.dosage}</span>
                    </div>
                  )}
                  {drugNode.frequency && (
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      padding: '12px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px'
                    }}>
                      <span style={{ fontWeight: '600', color: '#374151' }}>Frequency:</span>
                      <span style={{ color: '#1f2937', fontWeight: '500' }}>{drugNode.frequency}</span>
                    </div>
                  )}
                  {drugNode.category && (
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      padding: '12px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px'
                    }}>
                      <span style={{ fontWeight: '600', color: '#374151' }}>Category:</span>
                      <span style={{ 
                        color: '#1f2937',
                        textTransform: 'capitalize',
                        fontWeight: '500'
                      }}>{drugNode.category}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Information */}
              {drugNode.notes && (
                <div style={{
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '16px',
                  border: '1px solid #C5B6F1',
                  borderLeft: '4px solid #C5B6F1',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                }}>
                  <h3 style={{ 
                    margin: '0 0 16px 0', 
                    color: '#1f2937', 
                    fontSize: '18px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: '#C5B6F1',
                      borderRadius: '50%'
                    }} />
                    Notes
                  </h3>
                  <p style={{ 
                    margin: '0', 
                    color: '#374151', 
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap',
                    fontSize: '16px'
                  }}>
                    {drugNode.notes}
                  </p>
                </div>
              )}

              {/* Drug Interactions Section */}
              <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '16px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                border: '1px solid #e5e7eb'
              }}>
                <h3 style={{ 
                  margin: '0 0 16px 0', 
                  color: '#1f2937', 
                  fontSize: '18px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#C5B6F1',
                    borderRadius: '50%'
                  }} />
                  Drug Interactions
                  {loading && (
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid #e5e7eb',
                      borderTop: '2px solid #C5B6F1',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                  )}
                </h3>
                
                {loading ? (
                  <div style={{
                    padding: '20px',
                    textAlign: 'center',
                    color: '#6b7280',
                    fontSize: '14px'
                  }}>
                    Loading interactions...
                  </div>
                ) : interactions.length > 0 ? (
                  <div style={{ display: 'grid', gap: '8px', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
                    {interactions.map((interaction, index) => {
                      const severityStyle = getSeverityColor(interaction.severity);
                      const typeIcon = getInteractionTypeIcon(interaction.type);
                      return (
                        <div key={index} style={{
                          padding: '12px',
                          backgroundColor: severityStyle.bg,
                          border: `1px solid ${severityStyle.border}`,
                          borderRadius: '8px',
                          transition: 'all 0.2s ease',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleInteractionClick(interaction)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0px)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '8px'
                          }}>
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              gap: '8px',
                              flex: 1,
                              minWidth: 0
                            }}>
                              <span style={{ fontSize: '16px', flexShrink: 0 }}>
                                {typeIcon}
                              </span>
                              <div style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                color: severityStyle.text,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}>
                                {interaction.otherName}
                              </div>
                            </div>
                            
                            <span style={{
                              fontSize: '10px',
                              padding: '2px 6px',
                              backgroundColor: severityStyle.border,
                              color: 'white',
                              borderRadius: '4px',
                              fontWeight: '600',
                              textTransform: 'uppercase',
                              flexShrink: 0
                            }}>
                              {interaction.severity || 'Unknown'}
                            </span>
                          </div>
                          
                          {interaction.type === 'drug-food' && (
                            <div style={{
                              fontSize: '11px',
                              color: severityStyle.text,
                              marginTop: '4px',
                              opacity: 0.8
                            }}>
                              Food/Substance Interaction
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{
                    padding: '20px',
                    textAlign: 'center',
                    color: '#6b7280',
                    fontSize: '14px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px',
                    border: '1px dashed #d1d5db'
                  }}>
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>✅</div>
                    <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                      No Known Interactions
                    </div>
                    <div>
                      This medication has no recorded interactions with your current medications or known food/substances.
                    </div>
                  </div>
                )}
              </div>

              {/* Additional fields if they exist */}
              {Object.entries(drugNode).some(([key, value]) => 
                !['din', 'drug_name', 'dosage', 'frequency', 'category', 'notes', 'x', 'y', 'id'].includes(key) && value
              ) && (
                <div style={{
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '16px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                  border: '1px solid #e5e7eb'
                }}>
                  <h3 style={{ 
                    margin: '0 0 16px 0', 
                    color: '#1f2937', 
                    fontSize: '18px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      backgroundColor: '#C5B6F1',
                      borderRadius: '50%'
                    }} />
                    Additional Details
                  </h3>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {Object.entries(drugNode).map(([key, value]) => {
                      // Skip fields we've already displayed
                      if (['din', 'drug_name', 'dosage', 'frequency', 'category', 'notes', 'x', 'y', 'id'].includes(key) || !value) {
                        return null;
                      }
                      
                      return (
                        <div key={key} style={{
                          padding: '12px',
                          backgroundColor: '#f8fafc',
                          borderRadius: '8px',
                          display: 'flex',
                          justifyContent: 'space-between'
                        }}>
                          <span style={{ 
                            fontWeight: '600', 
                            color: '#374151',
                            textTransform: 'capitalize'
                          }}>
                            {key.replace(/_/g, ' ')}:
                          </span>
                          <span style={{ color: '#1f2937', fontWeight: '500' }}>{String(value)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Interaction Detail Popup */}
      <InteractionPopup
        interaction={selectedInteraction}
        isVisible={interactionPopupVisible}
        onClose={handleInteractionPopupClose}
      />
      
      {/* Add spinner animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </>
  );
};

export default DrugPopup;
