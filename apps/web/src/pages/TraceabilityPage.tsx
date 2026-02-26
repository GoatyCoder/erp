import { FormEvent, useState } from 'react';
import { apiGet } from '../api/client';

export function TraceabilityPage() {
  const [lotCode, setLotCode] = useState('ING-2026-0001');
  const [shipmentId, setShipmentId] = useState('');
  const [forward, setForward] = useState<any>(null);
  const [backward, setBackward] = useState<any>(null);

  const runForward = async (e: FormEvent) => {
    e.preventDefault();
    setForward(await apiGet(`/reporting/traceability/forward?tenantId=tenant_demo&lotCode=${encodeURIComponent(lotCode)}`));
  };

  const runBackward = async (e: FormEvent) => {
    e.preventDefault();
    setBackward(await apiGet(`/reporting/traceability/backward?tenantId=tenant_demo&shipmentId=${encodeURIComponent(shipmentId)}`));
  };

  return (
    <section style={{ marginTop: 16 }}>
      <h2>Ricerca Tracciabilità</h2>
      <form onSubmit={runForward} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <input value={lotCode} onChange={(e) => setLotCode(e.target.value)} placeholder="lot code" />
        <button type="submit">Trace Forward</button>
      </form>
      <form onSubmit={runBackward} style={{ display: 'flex', gap: 8 }}>
        <input value={shipmentId} onChange={(e) => setShipmentId(e.target.value)} placeholder="shipment id" />
        <button type="submit">Trace Backward</button>
      </form>
      {forward && <pre>{JSON.stringify(forward, null, 2)}</pre>}
      {backward && <pre>{JSON.stringify(backward, null, 2)}</pre>}
    </section>
  );
}
