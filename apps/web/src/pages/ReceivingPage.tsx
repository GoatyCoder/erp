import { CSSProperties, FormEvent, useMemo, useState } from 'react';
import { apiGet, apiPost } from '../api/client';

export function ReceivingPage() {
  const [lotCode, setLotCode] = useState('ING-2026-0001');
  const [weightLotId, setWeightLotId] = useState('');
  const [grossKg, setGrossKg] = useState('');
  const [tareKg, setTareKg] = useState('0');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [lastLot, setLastLot] = useState<any>(null);
  const [lastWeight, setLastWeight] = useState<any>(null);
  const [lots, setLots] = useState<any[]>([]);

  const parsedGrossKg = Number(grossKg || 0);
  const parsedTareKg = Number(tareKg || 0);
  const netPreview = useMemo(() => {
    if (!Number.isFinite(parsedGrossKg) || !Number.isFinite(parsedTareKg)) return null;
    if (parsedGrossKg <= 0 || parsedTareKg < 0 || parsedTareKg > parsedGrossKg) return null;
    return (parsedGrossKg - parsedTareKg).toFixed(2);
  }, [parsedGrossKg, parsedTareKg]);

  const createLot = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const lot = await apiPost('/receiving/inbound-lots', { tenantId: 'tenant_demo', actorUserId: 'user_1', lotCode });
    setLastLot(lot);
    setWeightLotId(lot.id);
    setSuccess(`Lotto ${lot.lotCode} creato correttamente.`);
    await refreshLots();
  };

  const refreshLots = async () => {
    const data = await apiGet<any[]>('/receiving/inbound-lots?tenantId=tenant_demo');
    setLots(data);
  };

  const recordWeight = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!weightLotId) {
      setError('Seleziona o inserisci un ID lotto da pesare.');
      return;
    }

    if (!Number.isFinite(parsedGrossKg) || parsedGrossKg <= 0) {
      setError('Il peso lordo deve essere un numero maggiore di zero.');
      return;
    }

    if (!Number.isFinite(parsedTareKg) || parsedTareKg < 0 || parsedTareKg > parsedGrossKg) {
      setError('La tara deve essere compresa tra 0 e il peso lordo.');
      return;
    }

    const weight = await apiPost('/receiving/weights', {
      tenantId: 'tenant_demo',
      actorUserId: 'user_1',
      lotId: weightLotId,
      grossKg: parsedGrossKg,
      tareKg: parsedTareKg
    });

    setLastWeight(weight);
    setSuccess(`Pesatura registrata per ${weightLotId}: netto ${weight.netKg.toFixed(2)} kg.`);
    setGrossKg('');
    setTareKg('0');
    await refreshLots();
  };

  return (
    <section style={{ marginTop: 16, display: 'grid', gap: 16 }}>
      <header>
        <h2 style={{ marginBottom: 4 }}>Ricezione merce</h2>
        <p style={{ margin: 0, color: '#566176' }}>Gestione rapida dei lotti in ingresso e registrazione pesatura per gli addetti di magazzino.</p>
      </header>

      {error && <div style={{ background: '#fdecef', color: '#9b1c31', padding: 12, borderRadius: 10 }}>{error}</div>}
      {success && <div style={{ background: '#ebf8f1', color: '#0f6a43', padding: 12, borderRadius: 10 }}>{success}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
        <form onSubmit={createLot} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16, display: 'grid', gap: 10 }}>
          <h3 style={{ margin: 0 }}>Nuovo lotto in ingresso</h3>
          <label style={{ display: 'grid', gap: 6 }}>
            <span style={{ fontSize: 13, color: '#334155' }}>Codice lotto</span>
            <input value={lotCode} onChange={(e) => setLotCode(e.target.value)} placeholder="es. ING-2026-0001" style={inputStyle} required />
          </label>
          <button type="submit" style={primaryButtonStyle}>Crea lotto ingresso</button>
        </form>

        <form onSubmit={recordWeight} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16, display: 'grid', gap: 10 }}>
          <h3 style={{ margin: 0 }}>Pesatura merce in ingresso</h3>
          <label style={{ display: 'grid', gap: 6 }}>
            <span style={{ fontSize: 13, color: '#334155' }}>ID lotto</span>
            <input value={weightLotId} onChange={(e) => setWeightLotId(e.target.value)} placeholder="Seleziona dal prospetto o digita ID" style={inputStyle} required />
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <label style={{ display: 'grid', gap: 6 }}>
              <span style={{ fontSize: 13, color: '#334155' }}>Peso lordo (kg)</span>
              <input value={grossKg} onChange={(e) => setGrossKg(e.target.value)} type="number" step="0.01" min="0" style={inputStyle} required />
            </label>
            <label style={{ display: 'grid', gap: 6 }}>
              <span style={{ fontSize: 13, color: '#334155' }}>Tara (kg)</span>
              <input value={tareKg} onChange={(e) => setTareKg(e.target.value)} type="number" step="0.01" min="0" style={inputStyle} required />
            </label>
          </div>

          <div style={{ background: '#f8fafc', borderRadius: 10, padding: 10, fontSize: 14 }}>
            Netto calcolato: <strong>{netPreview ? `${netPreview} kg` : '—'}</strong>
          </div>

          <button type="submit" style={primaryButtonStyle}>Registra pesatura</button>
        </form>
      </div>

      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ margin: 0 }}>Lotti ingresso</h3>
          <button onClick={refreshLots} style={secondaryButtonStyle}>Aggiorna elenco</button>
        </div>

        {lots.length === 0 ? (
          <p style={{ margin: 0, color: '#64748b' }}>Nessun lotto disponibile. Crea il primo lotto per iniziare.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                  <th style={thStyle}>Lotto</th>
                  <th style={thStyle}>Stato</th>
                  <th style={thStyle}>Lordo</th>
                  <th style={thStyle}>Tara</th>
                  <th style={thStyle}>Netto</th>
                  <th style={thStyle}>Azione</th>
                </tr>
              </thead>
              <tbody>
                {lots.map((lot) => (
                  <tr key={lot.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={tdStyle}><strong>{lot.lotCode}</strong><br /><span style={{ color: '#64748b', fontSize: 12 }}>{lot.id}</span></td>
                    <td style={tdStyle}><span style={badgeStyle}>{lot.status}</span></td>
                    <td style={tdStyle}>{lot.grossKg != null ? `${Number(lot.grossKg).toFixed(2)} kg` : '—'}</td>
                    <td style={tdStyle}>{lot.tareKg != null ? `${Number(lot.tareKg).toFixed(2)} kg` : '—'}</td>
                    <td style={tdStyle}>{lot.netKg != null ? `${Number(lot.netKg).toFixed(2)} kg` : '—'}</td>
                    <td style={tdStyle}><button onClick={() => setWeightLotId(lot.id)} style={secondaryButtonStyle}>Seleziona</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {(lastLot || lastWeight) && (
        <details>
          <summary style={{ cursor: 'pointer', color: '#334155' }}>Dettagli tecnici ultima operazione</summary>
          {lastLot && <pre>{JSON.stringify(lastLot, null, 2)}</pre>}
          {lastWeight && <pre>{JSON.stringify(lastWeight, null, 2)}</pre>}
        </details>
      )}
    </section>
  );
}

const inputStyle: CSSProperties = {
  border: '1px solid #cbd5e1',
  borderRadius: 8,
  padding: '10px 12px'
};

const primaryButtonStyle: CSSProperties = {
  background: '#0f172a',
  color: '#fff',
  border: 0,
  borderRadius: 8,
  padding: '10px 14px',
  fontWeight: 600,
  cursor: 'pointer'
};

const secondaryButtonStyle: CSSProperties = {
  background: '#f1f5f9',
  color: '#0f172a',
  border: '1px solid #cbd5e1',
  borderRadius: 8,
  padding: '8px 12px',
  fontWeight: 600,
  cursor: 'pointer'
};

const badgeStyle: CSSProperties = {
  background: '#e2e8f0',
  color: '#334155',
  borderRadius: 999,
  padding: '4px 8px',
  fontSize: 12,
  fontWeight: 700
};

const thStyle: CSSProperties = {
  padding: '8px 6px'
};

const tdStyle: CSSProperties = {
  padding: '10px 6px',
  verticalAlign: 'middle'
};
