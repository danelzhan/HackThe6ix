import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FiX, FiCheck, FiCalendar, FiPill, FiClock, FiUser, FiFileText } from 'react-icons/fi';

export function MedicationForm() {
  const navigate = useNavigate();
  const [medicationName, setMedicationName] = useState('');
  const [din, setDin] = useState('');
  const [category, setCategory] = useState('');
  const [dosageForm, setDosageForm] = useState('');
  const [frequency, setFrequency] = useState(1);
  const [startDate, setStartDate] = useState(new Date());
  const [currentlyTaking, setCurrentlyTaking] = useState(true);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const data = {
      medicationName,
      din,
      category,
      dosageForm,
      frequency,
      startDate,
      currentlyTaking,
      notes
    };
    
    console.log('Form submitted:', data);
    //!! TODO: send to backend
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    navigate('/journal');
  };

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e5e7eb 100%)',
    padding: '20px'
  };

  const cardStyle = {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: 'white',
    borderRadius: '20px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    overflow: 'hidden'
  };

  const headerStyle = {
    background: 'linear-gradient(135deg, #C5B6F1 0%, #9f7aea 100%)',
    padding: '24px',
    color: 'white',
    position: 'relative'
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: '24px',
    left: '24px',
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  const inputStyle = {
    width: '100%',
    padding: '16px 20px',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '16px',
    transition: 'all 0.2s ease',
    backgroundColor: '#fafafa',
    outline: 'none'
  };

  const sectionStyle = {
    padding: '24px',
    backgroundColor: '#f8fafc',
    borderRadius: '16px',
    border: '1px solid #e5e7eb'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const submitButtonStyle = {
    width: '100%',
    padding: '18px',
    background: isSubmitting 
      ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
      : 'linear-gradient(135deg, #C5B6F1 0%, #9f7aea 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '18px',
    fontWeight: '600',
    cursor: isSubmitting ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 14px 0 rgba(197, 182, 241, 0.39)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '8px'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <button 
            onClick={() => navigate('/journal')}
            style={closeButtonStyle}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
          >
            <FiX size={20} color="white" />
          </button>
          
          <div style={{ textAlign: 'center', marginTop: '8px' }}>
            <FiPill size={32} style={{ marginBottom: '12px' }} />
            <h1 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              margin: 0,
              textShadow: '0 2px 4px rgba(0,0,0,0.1)' 
            }}>
              Add New Medication
            </h1>
            <p style={{ 
              fontSize: '16px', 
              margin: '8px 0 0 0', 
              opacity: 0.9 
            }}>
              Keep track of your health journey
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '32px' }}>
          <div style={{ display: 'grid', gap: '24px' }}>
            
            {/* Medication Info Section */}
            <div style={sectionStyle}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <FiPill color="#C5B6F1" />
                Medication Information
              </h3>
              
              <div style={{ display: 'grid', gap: '20px' }}>
                <div>
                  <label style={labelStyle}>
                    <FiFileText size={16} />
                    Medication Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter medication name"
                    value={medicationName}
                    onChange={(e) => setMedicationName(e.target.value)}
                    required
                    style={inputStyle}
                  />
                </div>
                
                <div>
                  <label style={labelStyle}>
                    Drug Identification Number (DIN)
                  </label>
                  <input
                    type="text"
                    placeholder="Optional - helps with drug interactions"
                    value={din}
                    onChange={(e) => setDin(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            {/* Category & Form Section */}
            <div style={sectionStyle}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <FiUser color="#C5B6F1" />
                Classification
              </h3>
              
              <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: '1fr 1fr' }}>
                <div>
                  <label style={labelStyle}>Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    style={{
                      ...inputStyle,
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">Select category</option>
                    <option value="antibiotic">🦠 Antibiotic/Antivirals</option>
                    <option value="cardiovascular">❤️ Cardiovascular</option>
                    <option value="hormonal">⚡ Hormonal/Endocrine</option>
                    <option value="gi">🫁 GI/Respiratory</option>
                    <option value="mental">🧠 Mental Health</option>
                    <option value="otc">💊 OTC/Supplements</option>
                    <option value="pain">🩹 Pain/Inflammation</option>
                  </select>
                </div>
                
                <div>
                  <label style={labelStyle}>Dosage Form</label>
                  <select
                    value={dosageForm}
                    onChange={(e) => setDosageForm(e.target.value)}
                    style={{
                      ...inputStyle,
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">Select form</option>
                    <option value="tablet">💊 Tablet</option>
                    <option value="capsule">🔴 Capsule</option>
                    <option value="liquid">🧪 Liquid</option>
                    <option value="injection">💉 Injection</option>
                    <option value="cream">🧴 Cream/Ointment</option>
                    <option value="patch">🩹 Patch</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Schedule Section */}
            <div style={sectionStyle}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <FiClock color="#C5B6F1" />
                Schedule & Duration
              </h3>
              
              <div style={{ display: 'grid', gap: '20px' }}>
                <div>
                  <label style={labelStyle}>
                    <FiClock size={16} />
                    Frequency
                  </label>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    padding: '16px 20px',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    border: '2px solid #e5e7eb'
                  }}>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      style={{
                        width: '80px',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        textAlign: 'center',
                        fontSize: '16px',
                        fontWeight: '600'
                      }}
                    />
                    <span style={{ 
                      fontSize: '16px', 
                      color: '#6b7280',
                      fontWeight: '500'
                    }}>
                      times per day
                    </span>
                  </div>
                </div>
                
                <div>
                  <label style={labelStyle}>
                    <FiCalendar size={16} />
                    Start Date *
                  </label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    required
                    dateFormat="MMMM d, yyyy"
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            {/* Status & Notes */}
            <div style={sectionStyle}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  padding: '16px',
                  backgroundColor: currentlyTaking ? '#dcfce7' : 'white',
                  border: `2px solid ${currentlyTaking ? '#22c55e' : '#e5e7eb'}`,
                  borderRadius: '12px',
                  transition: 'all 0.2s ease'
                }}>
                  <input
                    type="checkbox"
                    checked={currentlyTaking}
                    onChange={() => setCurrentlyTaking(!currentlyTaking)}
                    style={{ 
                      width: '20px', 
                      height: '20px',
                      accentColor: '#22c55e'
                    }}
                  />
                  <span style={{ 
                    fontSize: '16px', 
                    fontWeight: '500',
                    color: currentlyTaking ? '#15803d' : '#6b7280'
                  }}>
                    Currently taking this medication
                  </span>
                  {currentlyTaking && <FiCheck color="#15803d" size={20} />}
                </label>
              </div>
              
              <div>
                <label style={labelStyle}>
                  <FiFileText size={16} />
                  Additional Notes
                </label>
                <textarea
                  placeholder="Any special instructions, side effects to monitor, or other important information..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  style={{
                    ...inputStyle,
                    resize: 'vertical',
                    minHeight: '100px'
                  }}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isSubmitting}
              style={submitButtonStyle}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px 0 rgba(197, 182, 241, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.target.style.transform = 'translateY(0px)';
                  e.target.style.boxShadow = '0 4px 14px 0 rgba(197, 182, 241, 0.39)';
                }
              }}
            >
              {isSubmitting ? (
                <>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid #ffffff',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Saving...
                </>
              ) : (
                <>
                  <FiCheck size={20} />
                  Complete and Add Medication
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
