import { FormEvent, useState } from 'react';
import { apiPost } from '../api/client';

export function QualityPage() {
  const [lotId, setLotId] = useState('');
  const [result, setResult] = useState<any>(null);

  const hold = async (e: FormEvent) => {
    e.preventDefault();
    setResult(await apiPost('/quality/hold', { tenantId: 'tenant_demo', targetId: lotId, reason: 'Controllo qualità' }));
  };

  const release = async () => {
    setResult(await apiPost('/quality/release', { tenantId: 'tenant_demo', targetId: lotId }));
  };

  return (
    <section style={{ marginTop: 16 }}>
      <h2>QC Hold/Release</h2>
      <form onSubmit={hold} style={{ display: 'flex', gap: 8 }}>
        <input value={lotId} onChange={(e) => setLotId(e.target.value)} placeholder="lot-ING-2026-0001" />
        <button type="submit">Metti in hold</button>
        <button type="button" onClick={release}>Rilascia</button>
      </form>
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </section>
  );
}
