import React from 'react';
import { FiEdit2, FiSave } from 'react-icons/fi';
import '../App.css'

const EditButton = ({ editMode, onToggle }) => {
  return (
    <div className ="edit-button-div">

        <h4 className = "edit-button-title">Medical Journal</h4>
        <button className="edit-button" onClick={onToggle}>
        {editMode ? (
            <> Save
            </>
        ) : (
            <>Edit
            </>
        )}
        </button>
    
    </div>
  );
};

export default EditButton;