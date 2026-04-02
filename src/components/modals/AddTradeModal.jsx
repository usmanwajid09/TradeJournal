import React, { useState } from 'react';
import './AddTradeModal.css';

const AddTradeModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    pair: '',
    direction: 'Long',
    session: 'London',
    entry: '',
    sl: '',
    tp: '',
    tags: [],
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const rr = Math.abs((formData.tp - formData.entry) / (formData.entry - formData.sl)).toFixed(2);
    // Rough calc for demo
    const result = formData.direction === 'Long' 
      ? (parseFloat(formData.tp) - parseFloat(formData.entry)) * 1000 
      : (parseFloat(formData.entry) - parseFloat(formData.tp)) * 1000;

    onAdd({
      ...formData,
      entry: parseFloat(formData.entry),
      sl: parseFloat(formData.sl),
      tp: parseFloat(formData.tp),
      rr: parseFloat(rr),
      result: parseFloat(result) || 0
    });
    onClose();
  };

  const toggleTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag) 
        : [...prev.tags, tag]
    }));
  };

  const tags = ["BoS", "CHoCH", "FVG", "Liquidity", "IFVG", "OB", "BPR", "NWOG"];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="text-lg">Log New Trade</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label className="text-xs text-tertiary uppercase ls-caps">Pair</label>
              <input 
                type="text" className="input" placeholder="e.g. XAUUSD" required
                value={formData.pair} onChange={e => setFormData({...formData, pair: e.target.value.toUpperCase()})}
              />
            </div>
            <div className="form-group">
              <label className="text-xs text-tertiary uppercase ls-caps">Direction</label>
              <div className="toggle-group">
                <button 
                  type="button" 
                  className={`toggle-btn ${formData.direction === 'Long' ? 'active-long' : ''}`}
                  onClick={() => setFormData({...formData, direction: 'Long'})}
                >Long</button>
                <button 
                  type="button" 
                  className={`toggle-btn ${formData.direction === 'Short' ? 'active-short' : ''}`}
                  onClick={() => setFormData({...formData, direction: 'Short'})}
                >Short</button>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="text-xs text-tertiary uppercase ls-caps">Entry Price</label>
              <input 
                type="number" step="any" className="input" placeholder="0.0000" required
                value={formData.entry} onChange={e => setFormData({...formData, entry: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label className="text-xs text-tertiary uppercase ls-caps">Stop Loss</label>
              <input 
                type="number" step="any" className="input" placeholder="0.0000" required
                value={formData.sl} onChange={e => setFormData({...formData, sl: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label className="text-xs text-tertiary uppercase ls-caps">Take Profit</label>
              <input 
                type="number" step="any" className="input" placeholder="0.0000" required
                value={formData.tp} onChange={e => setFormData({...formData, tp: e.target.value})}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="text-xs text-tertiary uppercase ls-caps">Market Structure Tags</label>
            <div className="tag-cloud">
              {tags.map(tag => (
                <button 
                  key={tag} type="button" 
                  className={`tag-chip ${formData.tags.includes(tag) ? 'active' : ''}`}
                  onClick={() => toggleTag(tag)}
                >{tag}</button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="text-xs text-tertiary uppercase ls-caps">Notes</label>
            <textarea 
              className="input textarea" rows="3" placeholder="Market structure observations..."
              value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}
            ></textarea>
          </div>

          <button type="submit" className="button-primary w-full mt-4">Log Trade</button>
        </form>
      </div>
    </div>
  );
};

export default AddTradeModal;
