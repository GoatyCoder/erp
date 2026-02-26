import { FormEvent, useState } from 'react';
import { apiGet, apiPost } from '../api/client';

export function ReceivingPage() {
  const [lotCode, setLotCode] = useState('ING-2026-0001');
  const [lastLot, setLastLot] = useState<any>(null);
  const [lots, setLots] = useState<any[]>([]);

  const createLot = async (e: FormEvent) => {
    e.preventDefault();
    const lot = await apiPost('/receiving/inbound-lots', { tenantId: 'tenant_demo', actorUserId: 'user_1', lotCode });
    setLastLot(lot);
  };

  const refreshLots = async () => {
    const data = await apiGet<any[]>('/receiving/inbound-lots?tenantId=tenant_demo');
    setLots(data);
  };

  return (
    <section style={{ marginTop: 16 }}>
      <h2>Ricezione</h2>
      <form onSubmit={createLot} style={{ display: 'flex', gap: 8 }}>
        <input value={lotCode} onChange={(e) => setLotCode(e.target.value)} placeholder="Codice lotto" />
        <button type="submit">Crea lotto ingresso</button>
      </form>
      <button onClick={refreshLots} style={{ marginTop: 8 }}>Aggiorna elenco lotti</button>
      {lastLot && <pre>{JSON.stringify(lastLot, null, 2)}</pre>}
      {lots.length > 0 && <pre>{JSON.stringify(lots, null, 2)}</pre>}
    </section>
  );
}
