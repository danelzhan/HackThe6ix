import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {  FiX } from 'react-icons/fi';

export function MedicationForm() {
  const [medicationName, setMedicationName] = useState('');
  const [din, setDin] = useState('');
  const [category, setCategory] = useState('');
  const [dosageForm, setDosageForm] = useState('');
  const [frequency, setFrequency] = useState(1);
  const [startDate, setStartDate] = useState(new Date());
  const [currentlyTaking, setCurrentlyTaking] = useState(true);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
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
  };

  return (
    <div className="app">
    <div className="journal-container medication-form">
    <form onSubmit={handleSubmit} >
        <div className="form-header">
          <button className="invisi-button" onClick={() => window.location.href = '/journal'}>
            <FiX size={24} />
          </button>
          <h2 className="text-xl font-semibold text-center">Upload Medication</h2>
        </div>

        {/* Medication Name + DIN */}
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Medication Name *"
            value={medicationName}
            onChange={(e) => setMedicationName(e.target.value)}
            required
            className="w-full p-3 border rounded-lg select-space"
          />
          <input
            type="text"
            placeholder="Drug ID Number (DIN)"
            value={din}
            onChange={(e) => setDin(e.target.value)}
            className="w-full p-3 border rounded-lg select-space"
          />
        </div>

        {/* Category */}
        <div className="select-space">
          <label className="form-label">Category <span className="red">*</span></label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full p-3 border rounded-lg"
          >
            <option value="">Type</option>
            <option value="antibiotic">Antibiotic/Antivirals</option>
            <option value="cardiovascular">Cardiovascular</option>
            <option value="hormonal">Hormonal/Endocrine</option>
            <option value="gi">GI/Respiratory</option>
            <option value="mental">Mental Health</option>
            <option value="otc">OTC/Supplements</option>
            <option value="pain">Pain/Inflammation</option>
          </select>
        </div>

        {/* Dosage Form */}
        <div className="select-space">
          <label className="form-label">Dosage Form</label>
          <select
            value={dosageForm}
            onChange={(e) => setDosageForm(e.target.value)}
            className="w-full p-3 border rounded-lg"
          >
            <option value="">Form</option>
            <option value="tablet">Tablet</option>
            <option value="capsule">Capsule</option>
            <option value="liquid">Liquid</option>
          </select>
        </div>

        {/* Frequency */}
        <div className="select-space">
          <label className="form-label">Frequency</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-24 p-3 border rounded-lg"
            />
            <label className="form-trailing-label">times / day</label>
          </div>
        </div>

        {/* Start Date */}
        <div className="select-space">
          <label className="form-label">Start <span className="red">*</span></label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            className="w-full p-3 border rounded-lg"
            required
          />
        </div>

        {/* Checkbox */}
        <div className="select-space">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={currentlyTaking}
              onChange={() => setCurrentlyTaking(!currentlyTaking)}
              className="mr-2"
            />
            Currently taking this medication
          </label>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <textarea
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-3 border rounded-lg"
            rows={3}
          />
        </div>

        {/* Submit */}
        <button type="submit" className="form-button">
          Complete and Upload
        </button>
      </form>

    </div>
    </div>
  );
}
