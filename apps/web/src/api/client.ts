const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

export async function apiPost<T>(path: string, payload: unknown, tenantId = 'tenant_demo'): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-tenant-id': tenantId },
    body: JSON.stringify(payload)
  });
  return response.json() as Promise<T>;
}

export async function apiGet<T>(path: string, tenantId = 'tenant_demo'): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'x-tenant-id': tenantId }
  });
  return response.json() as Promise<T>;
}
