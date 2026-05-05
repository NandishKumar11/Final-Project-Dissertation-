import React, { useState } from 'react';
import { ITEM_DB } from '../data';

function Demo() {
  const [selectedItem, setSelectedItem] = useState('');
  const [weight, setWeight] = useState(200);
  const [conf, setConf] = useState(0.87);
  const [result, setResult] = useState(null);

  const handleItemChange = (e) => {
    const key = e.target.value;
    setSelectedItem(key);
    if (key && ITEM_DB[key]) {
      const item = ITEM_DB[key];
      const mid = Math.floor((item.wmin + item.wmax) / 2);
      setWeight(mid);
    }
  };

  const runAnalysis = () => {
    if (!selectedItem || !ITEM_DB[selectedItem]) {
      alert('Please select an item first!');
      return;
    }
    const item = ITEM_DB[selectedItem];
    const visionOk = conf >= 0.65;
    const weightOk = weight >= item.wmin && weight <= item.wmax;
    
    let status, statusClass;
    if (visionOk && weightOk) { status = 'CONFIRMED'; statusClass = 'confirmed'; }
    else if (visionOk && !weightOk) { status = 'WEIGHT_MISMATCH'; statusClass = 'mismatch'; }
    else if (!visionOk && weightOk) { status = 'LOW_CONFIDENCE'; statusClass = 'low-conf'; }
    else { status = 'UNKNOWN'; statusClass = 'unknown'; }

    const priceUsd = status === 'CONFIRMED' ? ((item.price_usd * weight) / 1000).toFixed(2) : null;

    const allItems = Object.keys(ITEM_DB);
    const others = allItems.filter(k => k !== selectedItem).sort(() => Math.random() - 0.5).slice(0, 2);
    
    const p2 = parseFloat(((1 - conf) * 0.6).toFixed(2));
    const p3 = parseFloat(((1 - conf) * 0.4).toFixed(2));

    setResult({
      itemKey: selectedItem,
      item,
      weight,
      conf,
      status,
      statusClass,
      priceUsd,
      weightOk,
      others,
      p2,
      p3
    });
  };

  const statusColors = { confirmed: 'var(--accent)', mismatch: 'var(--orange)', 'low-conf': 'var(--yellow)', unknown: 'var(--red)' };
  const statusIcon = { confirmed: '✅', mismatch: '⚠️', 'low-conf': '🔍', unknown: '❓' };

  return (
    <div className="section active" style={{ display: 'block' }}>
      <div style={{ padding: '24px' }}>
        <div className="card" style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div className="card-header">
            <div>
              <h3>Live Demo — Smart Scale Simulation</h3>
              <div className="card-sub">Select an item to simulate placing it on the scale</div>
            </div>
            <span className="badge badge-green">EfficientNetB0 Active</span>
          </div>
          <div className="card-body">
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>Select Item to Simulate</label>
              <select value={selectedItem} onChange={handleItemChange}>
                <option value="">— choose an item —</option>
                <optgroup label="🍎 Fruits">
                  {Object.keys(ITEM_DB).filter(k => ITEM_DB[k].cat === 'fruit').map(k => <option key={k} value={k}>{k.replace('_', ' ')}</option>)}
                </optgroup>
                <optgroup label="🥦 Vegetables">
                  {Object.keys(ITEM_DB).filter(k => ITEM_DB[k].cat === 'veg').map(k => <option key={k} value={k}>{k.replace('_', ' ')}</option>)}
                </optgroup>
                <optgroup label="📦 Packaged">
                  {Object.keys(ITEM_DB).filter(k => ITEM_DB[k].cat === 'pkg').map(k => <option key={k} value={k}>{k.replace('_', ' ')}</option>)}
                </optgroup>
                <optgroup label="🥐 Bakery">
                  {Object.keys(ITEM_DB).filter(k => ITEM_DB[k].cat === 'bakery').map(k => <option key={k} value={k}>{k.replace('_', ' ')}</option>)}
                </optgroup>
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>Simulated Weight: <span>{weight} g</span></label>
              <input 
                type="range" 
                min={selectedItem ? Math.max(10, ITEM_DB[selectedItem].wmin - 200) : 50} 
                max={selectedItem ? ITEM_DB[selectedItem].wmax + 500 : 3000} 
                value={weight} 
                step="10" 
                onChange={(e) => setWeight(parseInt(e.target.value))} 
                style={{ width: '100%' }} 
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>Model Confidence Variance</label>
              <input 
                type="range" 
                min="40" 
                max="99" 
                value={Math.round(conf * 100)} 
                step="1" 
                onChange={(e) => setConf(parseInt(e.target.value) / 100)} 
                style={{ width: '100%' }}
              />
              <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '4px' }}>Confidence: <strong>{(conf * 100).toFixed(0)}%</strong></div>
            </div>

            <button className="btn btn-primary" onClick={runAnalysis} style={{ width: '100%', marginBottom: '20px' }}>
              ⚖️ Place on Scale &amp; Analyze
            </button>

            {result && (
              <>
                <div style={{ marginBottom: '20px' }}>
                  <div className="scale-visual">
                    <div style={{ fontSize: '48px', marginBottom: '8px' }}>{result.item.emoji}</div>
                    <div className="scale-platform"></div>
                    <div className="scale-pillar"></div>
                    <div className="scale-base"></div>
                    <div className="weight-display">{result.weight} g</div>
                    <div className="weight-unit">SCALE READING</div>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>Top 3 Predictions</div>
                  
                  <div className="conf-bar-row">
                    <div className="conf-bar-label">{result.itemKey.replace('_', ' ')}</div>
                    <div className="conf-bar-track"><div className="conf-bar-fill" style={{ width: `${result.conf * 100}%`, background: 'var(--accent)' }}><span className="conf-bar-val">{(result.conf * 100).toFixed(0)}%</span></div></div>
                  </div>
                  
                  <div className="conf-bar-row">
                    <div className="conf-bar-label">{result.others[0].replace('_', ' ')}</div>
                    <div className="conf-bar-track"><div className="conf-bar-fill" style={{ width: `${result.p2 * 100}%`, background: '#1565C0' }}><span className="conf-bar-val">{(result.p2 * 100).toFixed(0)}%</span></div></div>
                  </div>
                  
                  <div className="conf-bar-row">
                    <div className="conf-bar-label">{result.others[1].replace('_', ' ')}</div>
                    <div className="conf-bar-track"><div className="conf-bar-fill" style={{ width: `${result.p3 * 100}%`, background: '#E85D04' }}><span className="conf-bar-val">{(result.p3 * 100).toFixed(0)}%</span></div></div>
                  </div>
                </div>

                <div className={`result-card ${result.statusClass}`}>
                  <div className="result-title" style={{ color: statusColors[result.statusClass] }}>{statusIcon[result.statusClass]} {result.status.replace('_', ' ')}</div>
                  <div className="result-item">{result.item.emoji} {result.itemKey.replace('_', ' ').toUpperCase()}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text2)', marginBottom: '12px' }}>Model: EfficientNetB0 · Confidence: {(result.conf * 100).toFixed(0)}%</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginTop: '8px' }}>
                    <div><div style={{ fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Weight</div><div style={{ fontFamily: "'Syne', sans-serif", fontSize: '20px', fontWeight: '700' }}>{result.weight}g</div></div>
                    <div><div style={{ fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Rate ($/kg)</div><div style={{ fontFamily: "'Syne', sans-serif", fontSize: '20px', fontWeight: '700' }}>${result.item.price_usd}</div></div>
                    <div><div style={{ fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Price</div><div className="result-price" style={{ color: statusColors[result.statusClass] }}>{result.priceUsd ? '$' + result.priceUsd : '—'}</div></div>
                  </div>
                  {!result.weightOk && <div style={{ marginTop: '12px', fontSize: '11px', color: statusColors[result.statusClass] }}>Expected range: {result.item.wmin}–{result.item.wmax}g · Actual: {result.weight}g</div>}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Demo;
