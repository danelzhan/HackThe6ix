import React from 'react';

const DrugPopup = ({ drugNode, isVisible, onClose }) => {
  console.log('DrugPopup rendered:', { drugNode, isVisible });
  
  if (!isVisible || !drugNode) return null;

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
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
        onClick={onClose}
      >
        {/* Popup Window */}
        <div 
          style={{
            backgroundColor: 'white',
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
            borderBottomLeftRadius: '0px',
            borderBottomRightRadius: '0px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
            padding: '0',
            margin: '0'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #C5B6F1 0%, #A89EE8 100%)',
            padding: '20px 24px',
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
            position: 'relative'
          }}>
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '15px',
                right: '20px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#333',
                padding: '0',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>
            <h2 style={{
              margin: '0',
              color: '#333',
              fontSize: '24px',
              fontWeight: 'bold',
              paddingRight: '40px'
            }}>
              {drugNode.drug_name || 'Drug Information'}
            </h2>
          </div>

          {/* Content */}
          <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Basic Information */}
              <div style={{
                backgroundColor: '#f8f9fa',
                padding: '16px',
                borderRadius: '12px'
              }}>
                <h3 style={{ margin: '0 0 12px 0', color: '#333', fontSize: '18px' }}>
                  Basic Information
                </h3>
                <div style={{ display: 'grid', gap: '8px' }}>
                  {drugNode.din && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: '600', color: '#555' }}>DIN:</span>
                      <span style={{ color: '#333' }}>{drugNode.din}</span>
                    </div>
                  )}
                  {drugNode.dosage && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: '600', color: '#555' }}>Dosage:</span>
                      <span style={{ color: '#333' }}>{drugNode.dosage}</span>
                    </div>
                  )}
                  {drugNode.frequency && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: '600', color: '#555' }}>Frequency:</span>
                      <span style={{ color: '#333' }}>{drugNode.frequency}</span>
                    </div>
                  )}
                  {drugNode.category && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: '600', color: '#555' }}>Category:</span>
                      <span style={{ 
                        color: '#333',
                        textTransform: 'capitalize'
                      }}>{drugNode.category}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Information */}
              {drugNode.notes && (
                <div style={{
                  backgroundColor: '#f0f7ff',
                  padding: '16px',
                  borderRadius: '12px',
                  borderLeft: '4px solid #C5B6F1'
                }}>
                  <h3 style={{ margin: '0 0 12px 0', color: '#333', fontSize: '18px' }}>
                    Notes
                  </h3>
                  <p style={{ 
                    margin: '0', 
                    color: '#555', 
                    lineHeight: '1.5',
                    whiteSpace: 'pre-wrap'
                  }}>
                    {drugNode.notes}
                  </p>
                </div>
              )}

              {/* Additional fields if they exist */}
              {Object.entries(drugNode).map(([key, value]) => {
                // Skip fields we've already displayed
                if (['din', 'drug_name', 'dosage', 'frequency', 'category', 'notes', 'x', 'y', 'id'].includes(key) || !value) {
                  return null;
                }
                
                return (
                  <div key={key} style={{
                    backgroundColor: '#f8f9fa',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{ 
                      fontWeight: '600', 
                      color: '#555',
                      textTransform: 'capitalize'
                    }}>
                      {key.replace(/_/g, ' ')}:
                    </span>
                    <span style={{ color: '#333' }}>{String(value)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DrugPopup;
