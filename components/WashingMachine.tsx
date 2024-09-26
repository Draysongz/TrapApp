import React from 'react';

const WashingMachine: React.FC = () => (
  <svg width="100" height="100" viewBox="0 0 100 100" className="animate-spin">
    <circle cx="50" cy="50" r="45" fill="none" stroke="#4ade80" strokeWidth="5" />
    <circle cx="50" cy="50" r="20" fill="#4ade80" />
    <rect x="46" y="10" width="8" height="15" fill="#4ade80" />
    <rect x="46" y="75" width="8" height="15" fill="#4ade80" />
    <rect x="10" y="46" width="15" height="8" fill="#4ade80" />
    <rect x="75" y="46" width="15" height="8" fill="#4ade80" />
  </svg>
);

export default WashingMachine;