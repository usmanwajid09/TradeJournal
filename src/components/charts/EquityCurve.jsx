import React, { useMemo, useEffect, useState } from 'react';
import './EquityCurve.css';

const EquityCurve = ({ trades }) => {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const { points, linePath, areaPath, lastPnL, labels } = useMemo(() => {
    if (!trades || trades.length === 0) return { points: [], linePath: '', areaPath: '', lastPnL: 0, labels: [] };

    // Sort chronologically for the curve
    const chronTrades = [...trades].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    let balance = 50000; // BASE_CAPITAL
    const dataPoints = [{ x: 0, y: balance }];
    
    chronTrades.forEach(t => {
      balance += t.result;
      dataPoints.push({ x: dataPoints.length, y: balance });
    });

    const min = Math.min(...dataPoints.map(p => p.y)) * 0.99;
    const max = Math.max(...dataPoints.map(p => p.y)) * 1.01;
    const range = max - min;
    
    const width = 800;
    const height = 280;
    
    // Transform coordinates for SVG (0,0 is top-left)
    const svgPoints = dataPoints.map((p, i) => ({
      x: (i / (dataPoints.length - 1)) * width,
      y: height - ((p.y - min) / range) * height
    }));

    const lPath = svgPoints.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');
    const aPath = `${lPath} L ${width} ${height} L 0 ${height} Z`;

    const last = chronTrades.reduce((sum, t) => sum + t.result, 0);
    
    // Generate simple time labels
    const labelCount = 5;
    const step = Math.floor(chronTrades.length / (labelCount - 1));
    const labelIndices = Array.from({ length: labelCount }, (_, i) => Math.min(i * step, chronTrades.length - 1));
    const lbls = labelIndices.map(idx => new Date(chronTrades[idx].date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }));

    return { points: svgPoints, linePath: lPath, areaPath: aPath, lastPnL: last, labels: lbls };
  }, [trades]);

  return (
    <div className="equity-card card">
      <div className="equity-header">
        <div className="header-left">
          <span className="text-xs text-tertiary uppercase">Portfolio Equity</span>
          <div className="equity-values">
            <span className="text-xl">$54,210.00</span>
            <span className={`badge ${lastPnL >= 0 ? 'text-green' : 'text-red'}`} style={{background: 'transparent', border: 'none', padding: 0}}>
               {lastPnL >= 0 ? '▲' : '▼'} {((lastPnL / 50000) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="time-range-tabs">
          <button className="tab active">1W</button>
          <button className="tab">1M</button>
          <button className="tab">3M</button>
          <button className="tab">All</button>
        </div>
      </div>

      <div className="chart-container">
        <svg viewBox="0 0 800 280" className={`equity-svg ${isAnimated ? 'animated' : ''}`}>
          {/* Grid Lines */}
          <line x1="0" y1="70" x2="800" y2="70" className="grid-line" />
          <line x1="0" y1="140" x2="800" y2="140" className="grid-line" />
          <line x1="0" y1="210" x2="800" y2="210" className="grid-line" />
          
          {/* Area Fill */}
          <path d={areaPath} className="curve-area" />
          
          {/* Main Line */}
          <path d={linePath} className="curve-line" />
          
          {/* Interaction Overlay (Simplified) */}
          <rect width="800" height="280" fill="transparent" />
        </svg>

        <div className="chart-labels">
          {labels.map((l, i) => (
            <span key={i} className="text-xs text-tertiary">{l}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EquityCurve;
