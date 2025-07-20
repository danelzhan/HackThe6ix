import React, { useEffect, useState } from 'react';

const InteractionPopup = ({ interaction, isVisible, onClose }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  
  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
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

  const handleClose = () => {
    setIsAnimating(false);
    // Wait for animation to complete before actually closing
    setTimeout(() => {
      onClose();
    }, 400);
  };

  const getSeverityConfig = (severity) => {
    const severityLower = severity?.toLowerCase() || '';
    if (severityLower.includes('severe') || severityLower.includes('major')) {
      return { 
        bg: '#fee2e2', 
        border: '#ef4444', 
        text: '#991b1b', 
        icon: '⚠️',
        gradient: 'linear-gradient(135deg, #fee2e2 0%, #fca5a5 100%)',
        badgeColor: '#dc2626'
      };
    } else if (severityLower.includes('moderate')) {
      return { 
        bg: '#fef3c7', 
        border: '#f59e0b', 
        text: '#92400e', 
        icon: '⚡',
        gradient: 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%)',
        badgeColor: '#d97706'
      };
    } else if (severityLower.includes('mild') || severityLower.includes('minor')) {
      return { 
        bg: '#dcfce7', 
        border: '#22c55e', 
        text: '#166534', 
        icon: 'ℹ️',
        gradient: 'linear-gradient(135deg, #dcfce7 0%, #86efac 100%)',
        badgeColor: '#16a34a'
      };
    }
    return { 
      bg: '#f3f4f6', 
      border: '#6b7280', 
      text: '#374151', 
      icon: '💊',
      gradient: 'linear-gradient(135deg, #f3f4f6 0%, #d1d5db 100%)',
      badgeColor: '#6b7280'
    };
  };

  const getInteractionTypeDisplay = (interaction) => {
    // Determine if it's drug-drug or drug-food interaction
    if (interaction?.din1 && interaction?.din2) {
      return {
        type: 'Drug-Drug Interaction',
        icon: '💊💊',
        description: `Interaction between ${interaction.drug_name1 || `Drug ${interaction.din1}`} and ${interaction.drug_name2 || `Drug ${interaction.din2}`}`
      };
    } else if (interaction?.din1 && interaction?.name) {
      return {
        type: 'Drug-Food Interaction',
        icon: '💊🍎',
        description: `Interaction between ${interaction.drug_name1 || `Drug ${interaction.din1}`} and ${interaction.name}`
      };
    } else if (interaction?.currentDrugName && interaction?.otherName) {
      // Handle the enriched interaction format from DrugPopup
      return {
        type: interaction.type === 'drug-drug' ? 'Drug-Drug Interaction' : 'Drug-Food Interaction',
        icon: interaction.type === 'drug-drug' ? '💊💊' : '💊🍎',
        description: `Interaction between ${interaction.currentDrugName} and ${interaction.otherName}`
      };
    }
    
    return {
      type: 'Unknown Interaction',
      icon: '❓',
      description: 'Interaction details'
    };
  };

  const formatInteractionType = (type) => {
    if (!type) return 'General Interaction';
    
    // Convert snake_case or camelCase to Title Case
    return type
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/[_-]/g, ' ') // Replace underscores and hyphens with spaces
      .replace(/\b\w/g, l => l.toUpperCase()) // Capitalize first letter of each word
      .trim();
  };

  if (!shouldRender || !interaction) return null;

  const severityConfig = getSeverityConfig(interaction.severity);
  const interactionDisplay = getInteractionTypeDisplay(interaction);

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
          zIndex: 1001, // Higher than DrugPopup
          transition: 'background-color 0.4s ease',
          cursor: 'pointer'
        }}
        onClick={handleClose}
      >
        {/* Popup Window */}
        <div 
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) scale(${isAnimating ? '1' : '0.8'})`,
            backgroundColor: 'white',
            borderRadius: '24px',
            maxWidth: '600px',
            width: '90vw',
            maxHeight: '80vh',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            opacity: isAnimating ? '1' : '0',
            transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            display: 'flex',
            flexDirection: 'column'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{
            background: severityConfig.gradient,
            padding: '24px',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            position: 'relative'
          }}>
            <button
              onClick={handleClose}
              style={{
                position: 'absolute',
                top: '20px',
                right: '24px',
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                fontSize: '20px',
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
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <span style={{ fontSize: '32px' }}>{interactionDisplay.icon}</span>
              <div>
                <h2 style={{
                  margin: '0',
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                }}>
                  {interactionDisplay.type}
                </h2>
                <div style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontWeight: '500'
                }}>
                  {interactionDisplay.description}
                </div>
              </div>
            </div>

            {/* Severity Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: severityConfig.badgeColor,
              color: 'white',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
              textTransform: 'uppercase',
              marginTop: '8px'
            }}>
              <span>{severityConfig.icon}</span>
              {interaction.severity || 'Unknown'} Severity
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
              
              {/* Interaction Details */}
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
                    backgroundColor: severityConfig.badgeColor,
                    borderRadius: '50%'
                  }} />
                  Interaction Details
                </h3>
                
                <div style={{ display: 'grid', gap: '12px' }}>
                  {/* Drug Information */}
                  {interaction.din1 && (
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      padding: '12px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px'
                    }}>
                      <span style={{ fontWeight: '600', color: '#374151' }}>Drug 1:</span>
                      <span style={{ color: '#1f2937', fontWeight: '500' }}>
                        {interaction.drug_name1 || interaction.currentDrugName || `DIN: ${interaction.din1}`}
                      </span>
                    </div>
                  )}
                  
                  {interaction.din2 && (
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      padding: '12px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px'
                    }}>
                      <span style={{ fontWeight: '600', color: '#374151' }}>Drug 2:</span>
                      <span style={{ color: '#1f2937', fontWeight: '500' }}>
                        {interaction.drug_name2 || `DIN: ${interaction.din2}`}
                      </span>
                    </div>
                  )}

                  {interaction.name && (
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      padding: '12px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px'
                    }}>
                      <span style={{ fontWeight: '600', color: '#374151' }}>Substance:</span>
                      <span style={{ color: '#1f2937', fontWeight: '500' }}>
                        {interaction.name}
                      </span>
                    </div>
                  )}

                  {interaction.otherName && !interaction.din2 && !interaction.name && (
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      padding: '12px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px'
                    }}>
                      <span style={{ fontWeight: '600', color: '#374151' }}>
                        {interaction.type === 'drug-food' ? 'Food/Substance:' : 'Other Drug:'}
                      </span>
                      <span style={{ color: '#1f2937', fontWeight: '500' }}>
                        {interaction.otherName}
                      </span>
                    </div>
                  )}

                  {interaction.interaction_type && (
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      padding: '12px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px'
                    }}>
                      <span style={{ fontWeight: '600', color: '#374151' }}>Interaction Type:</span>
                      <span style={{ color: '#1f2937', fontWeight: '500' }}>
                        {formatInteractionType(interaction.interaction_type)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Advanced Information */}
              {interaction.advanced_info && (
                <div style={{
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '16px',
                  border: `1px solid ${severityConfig.border}`,
                  borderLeft: `4px solid ${severityConfig.border}`,
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
                      backgroundColor: severityConfig.badgeColor,
                      borderRadius: '50%'
                    }} />
                    Clinical Information
                  </h3>
                  <div style={{ 
                    color: '#374151', 
                    lineHeight: '1.7',
                    fontSize: '16px',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {interaction.advanced_info}
                  </div>
                </div>
              )}

              {/* Research Links */}
              {interaction.research_links && interaction.research_links.length > 0 && (
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
                      backgroundColor: severityConfig.badgeColor,
                      borderRadius: '50%'
                    }} />
                    Research & References
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {interaction.research_links.map((link, index) => (
                      <a 
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '12px',
                          backgroundColor: '#f8fafc',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          color: '#2563eb',
                          fontWeight: '500',
                          transition: 'all 0.2s ease',
                          border: '1px solid transparent'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#eff6ff';
                          e.target.style.borderColor = '#3b82f6';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#f8fafc';
                          e.target.style.borderColor = 'transparent';
                        }}
                      >
                        <span style={{ fontSize: '16px' }}>🔗</span>
                        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {link.length > 50 ? `${link.substring(0, 50)}...` : link}
                        </span>
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>↗</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Safety Recommendations - Only for drug-drug interactions */}
              {interactionDisplay.type === 'Drug-Drug Interaction' && (
                <div style={{
                  backgroundColor: severityConfig.bg,
                  padding: '20px',
                  borderRadius: '16px',
                  border: `1px solid ${severityConfig.border}`,
                  borderLeft: `4px solid ${severityConfig.border}`
                }}>
                  <h3 style={{ 
                    margin: '0 0 16px 0', 
                    color: severityConfig.text, 
                    fontSize: '18px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ fontSize: '20px' }}>{severityConfig.icon}</span>
                    Safety Recommendations
                  </h3>
                  <div style={{ 
                    color: severityConfig.text, 
                    lineHeight: '1.6',
                    fontSize: '15px'
                  }}>
                    {interaction.severity?.toLowerCase().includes('severe') && (
                      <div>
                        <strong>⚠️ HIGH PRIORITY:</strong> Consult your healthcare provider immediately. This interaction may require medication adjustment, timing changes, or alternative treatments.
                      </div>
                    )}
                    {interaction.severity?.toLowerCase().includes('moderate') && (
                      <div>
                        <strong>⚡ MODERATE CONCERN:</strong> Monitor for side effects and discuss with your healthcare provider at your next appointment. Consider timing adjustments between medications.
                      </div>
                    )}
                    {interaction.severity?.toLowerCase().includes('mild') && (
                      <div>
                        <strong>ℹ️ LOW RISK:</strong> Generally safe combination. Continue monitoring and inform your healthcare provider if you notice any unusual symptoms.
                      </div>
                    )}
                    {!interaction.severity && (
                      <div>
                        <strong>💊 GENERAL ADVICE:</strong> Always inform your healthcare providers about all medications, supplements, and foods you consume regularly.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InteractionPopup;
