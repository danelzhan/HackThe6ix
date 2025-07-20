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
    // TODO: send to backend
  };

  return (
    <div className="journal-container">
    <form onSubmit={handleSubmit} className="p-4 space-y-4 bg-white max-w-md mx-auto rounded-xl shadow">
      
      <div className="form-header">
        <button className="invisi-button" onClick={() => window.location.href = '/journal'}>
          <FiX size={24} />
        </button>
        <h2 className="text-xl font-semibold text-center">Upload Medication</h2>
      </div>
      <div>
        <input
          type="text"
          placeholder="Medication Name *"
          value={medicationName}
          onChange={(e) => setMedicationName(e.target.value)}
          required
          className="w-full p-3 border rounded-lg"
        />
        <br />
        <input
          type="text"
          placeholder="Drug ID Number (DIN)"
          value={din}
          onChange={(e) => setDin(e.target.value)}
          className="w-full p-3 mt-2 border rounded-lg"
        />
      </div>

      <div>

        <label className="form-label block mb-1 font-medium">Category <span className="red">*</span></label>
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

      <div>
        <label className="form-label block mb-1 font-medium">Dosage Form</label>
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

      <div>
        <label className="form-label block mb-1 font-medium">Frequency</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="1"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="w-20 p-3 border rounded-lg"
          />
          <label className="form-trailing-label">times / day</label>
        </div>
      </div>

      <div>
        <label className="form-label block mb-1 font-medium">Start <span className="red">*</span></label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          className="w-full p-3 border rounded-lg"
          required
        />
      </div>

      <div className="checkbox-container">
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


      <div>
        <textarea
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full p-3 border rounded-lg"
          rows={3}
        />
      </div>

      <button
        type="submit"
        className="form-button"
      >
        Complete and Upload
      </button>
    </form>
    </div>
  );
}
