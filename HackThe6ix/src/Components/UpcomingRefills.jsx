import React, { useState, useEffect } from 'react';
import { useFetchCurrentUser } from '../Bridge.js';

const UpcomingRefills = () => {
  const [upcomingRefills, setUpcomingRefills] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchCurrentUser, userEmail, isAuthenticated } = useFetchCurrentUser();

  useEffect(() => {
    const fetchUpcomingRefills = async () => {
      if (isAuthenticated && userEmail) {
        try {
          setLoading(true);
          const patient = await fetchCurrentUser();
          
          if (patient && patient.nodes) {
            const currentDate = new Date();
            const drugNodes = patient.nodes.filter(node => node.din);
            
            const refillsNeeded = drugNodes
              .filter(drug => {
                if (!drug.end_date) return false;
                
                const endDate = new Date(drug.end_date);
                const timeDiff = endDate.getTime() - currentDate.getTime();
                const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
                
                return daysDiff >= 0 && daysDiff <= 8; // Within 8 days
              })
              .map(drug => {
                const endDate = new Date(drug.end_date);
                const timeDiff = endDate.getTime() - currentDate.getTime();
                const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
                
                return {
                  ...drug,
                  daysRemaining: daysDiff,
                  priority: daysDiff <= 4 ? 'critical' : 'low'
                };
              })
              .sort((a, b) => a.daysRemaining - b.daysRemaining); // Sort by most urgent first
            
            setUpcomingRefills(refillsNeeded);
          }
        } catch (error) {
          console.error('Error fetching upcoming refills:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    
    fetchUpcomingRefills();
  }, [isAuthenticated, userEmail]);

  // Same color logic as GraphNode.jsx and MedicationJournal
  const getMedicationColor = (medication) => {
    if (medication.din) {
      if (medication.category === 'cardiovascular') {
        return '#7B89FF';
      }
      if (medication.category === 'antibiotic') {
        return '#FFB8B8';
      }
      if (medication.category === 'mental') {
        return '#B3FEA9';
      }
      if (medication.category === 'hormonal') {
        return '#BAA9FE';
      }
      if (medication.category === 'pain') {
        return '#FED5A9';
      }
      if (medication.category === 'gi') {
        return '#FFFBB8';
      }
      if (medication.category === 'otc') {
        return '#c5c5c5ff';
      }
      return '#C5B6F1'; // Default purple for drugs
    }
    return '#D1FFB8'; // Green for food
  };

  const getPriorityConfig = (priority) => {
    if (priority === 'critical') {
      return {
        label: 'Critical Supply',
        color: '#ef4444',
        backgroundColor: '#fee2e2',
        borderColor: '#fca5a5'
      };
    } else {
      return {
        label: 'Low Supply',
        color: '#f59e0b',
        backgroundColor: '#fef3c7',
        borderColor: '#fbbf24'
      };
    }
  };

  if (loading) {
    return (
      <div style={{
        padding: '20px',
        textAlign: 'center',
        color: '#666',
        fontSize: '14px'
      }}>
        Loading upcoming refills...
      </div>
    );
  }

  if (upcomingRefills.length === 0) {
    return (
      <div style={{
        padding: '20px',
        textAlign: 'center',
        backgroundColor: '#f0fdf4',
        borderRadius: '12px',
        border: '1px solid #bbf7d0',
        margin: '16px 0'
      }}>
        <div style={{
          fontSize: '24px',
          marginBottom: '8px'
        }}>
          ✅
        </div>
        <div style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#166534',
          marginBottom: '4px'
        }}>
          All Good!
        </div>
        <div style={{
          fontSize: '14px',
          color: '#16a34a'
        }}>
          No medications need refills in the next 8 days.
        </div>
      </div>
    );
  }

  return (
    <div style={{ margin: '20px 0' }}>
      <h3 style={{
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span style={{ fontSize: '24px' }}>📋</span>
        Upcoming Refills
      </h3>
      
      <div style={{
        display: 'grid',
        gap: '12px',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))'
      }}>
        {upcomingRefills.map((medication, index) => {
          const medicationColor = getMedicationColor(medication);
          const priorityConfig = getPriorityConfig(medication.priority);
          
          return (
            <div
              key={`${medication.din}-refill-${index}`}
              style={{
                backgroundColor: medicationColor,
                borderRadius: '12px',
                padding: '16px',
                border: `2px solid ${priorityConfig.borderColor}`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0px)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}
            >
              {/* Header with priority badge */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '12px'
              }}>
                <div style={{
                  backgroundColor: priorityConfig.backgroundColor,
                  color: priorityConfig.color,
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  border: `1px solid ${priorityConfig.borderColor}`
                }}>
                  {priorityConfig.label}
                </div>
                
                <div style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#374151',
                  textAlign: 'right'
                }}>
                  {medication.daysRemaining === 0 ? 'Today' : 
                   medication.daysRemaining === 1 ? '1 day' : 
                   `${medication.daysRemaining} days`}
                </div>
              </div>
              
              {/* Medication info */}
              <div style={{
                marginBottom: '8px'
              }}>
                <div style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: '4px'
                }}>
                  {medication.drug_name}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#4b5563',
                  marginBottom: '4px'
                }}>
                  {medication.dosage} • {medication.frequency}
                </div>
                {medication.category && (
                  <div style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    textTransform: 'capitalize',
                    fontStyle: 'italic'
                  }}>
                    {medication.category}
                  </div>
                )}
              </div>
              
              {/* End date info */}
              <div style={{
                fontSize: '12px',
                color: '#6b7280',
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                padding: '6px 8px',
                borderRadius: '6px',
                marginTop: '8px'
              }}>
                <strong>Supply ends:</strong> {new Date(medication.end_date).toLocaleDateString()}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Action prompt */}
      <div style={{
        marginTop: '16px',
        padding: '12px',
        backgroundColor: '#eff6ff',
        borderRadius: '8px',
        border: '1px solid #bfdbfe',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '14px',
          color: '#1e40af',
          fontWeight: '500'
        }}>
          💡 Contact your pharmacy or doctor to schedule refills for medications running low.
        </div>
      </div>
    </div>
  );
};

export default UpcomingRefills;
