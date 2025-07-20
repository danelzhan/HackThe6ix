import React from "react";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function ManualInputButton({ onClick, label }) {
  return (
    <button className="manual-input-btn" onClick={onClick}>
      <span>{label}</span>
      <span className="arrow" style={{display: "flex", justifyContent: "center", alignItems: "center"}}><ArrowForwardIcon /></span>
    </button>
  );
}
