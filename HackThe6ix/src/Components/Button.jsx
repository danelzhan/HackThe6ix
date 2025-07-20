import React from "react";

export default function ManualInputButton({ onClick, label }) {
  return (
    <button className="manual-input-btn" onClick={onClick}>
      <span>{label}</span>
      <span className="arrow">→</span>
    </button>
  );
}
