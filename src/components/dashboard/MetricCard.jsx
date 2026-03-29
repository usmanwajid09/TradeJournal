import React from 'react';

const MetricCard = ({ label, value, delta, isPositive }) => (
  <div className="metric-card card">
    <span className="text-xs text-tertiary uppercase ls-caps">{label}</span>
    <div className="metric-value-row">
      <span className="text-lg">{value}</span>
      {delta && (
        <span className={`delta-badge ${isPositive ? 'text-green' : 'text-red'}`}>
          {isPositive ? '↑' : '↓'} {delta}
        </span>
      )}
    </div>
  </div>
);

export default MetricCard;
