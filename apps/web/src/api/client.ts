export async function apiPost<T>(path: string, payload: unknown): Promise<T> {
  const response = await fetch(`http://localhost:3000${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return response.json() as Promise<T>;
}
