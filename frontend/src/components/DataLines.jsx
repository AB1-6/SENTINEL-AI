import React from 'react';

export default function DataLines() {
  return (
    <div aria-hidden className="data-lines pointer-events-none fixed inset-0 z-0">
      <div className="data-lines__scan" />
      <div className="data-lines__vertical" />
      <div className="data-lines__particles" />
    </div>
  );
}
