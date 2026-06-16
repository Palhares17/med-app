import { STORAGE_KEYS } from "@/core/constants"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3333"

async function getAuthHeader(): Promise<HeadersInit> {
  const raw = localStorage.getItem(STORAGE_KEYS.USER)
  if (!raw) return {}
  try {
    const user = JSON.parse(raw)
    if (user?.accessToken) {
      return { Authorization: `Bearer ${user.accessToken}` }
    }
  } catch {}
  return {}
}

export async function apiGet<T>(path: string): Promise<T> {
  const headers = await getAuthHeader()
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...headers },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error ?? "Erro desconhecido")
  }
  return res.json()
}

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const headers = await getAuthHeader()
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error ?? "Erro desconhecido")
  }
  return res.json()
}

export async function apiDelete(path: string): Promise<void> {
  const headers = await getAuthHeader()
  const res = await fetch(`${API_URL}${path}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", ...headers },
  })
  if (!res.ok && res.status !== 204) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error ?? "Erro desconhecido")
  }
}
