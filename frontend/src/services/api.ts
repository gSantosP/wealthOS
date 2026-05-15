import axios from 'axios'
import type { DashboardData, Transaction, AiAnalysisRequest } from '../types'
import { MOCK_DASHBOARD, MOCK_AI_INSIGHT } from '../data/mock'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use(config => {
  const token = localStorage.getItem('wealthos_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Dashboard ──────────────────────────────────────
export async function getDashboard(): Promise<DashboardData> {
  try {
    const { data } = await api.get<DashboardData>('/dashboard')
    return data
  } catch {
    return MOCK_DASHBOARD
  }
}

// ── Transactions ───────────────────────────────────
export async function getTransactions(): Promise<Transaction[]> {
  try {
    const { data } = await api.get<Transaction[]>('/transactions')
    return data
  } catch {
    return MOCK_DASHBOARD.transactions
  }
}

export async function createTransaction(
  payload: Omit<Transaction, 'id'>
): Promise<Transaction> {
  try {
    const { data } = await api.post<Transaction>('/transactions', payload)
    return data
  } catch {
    return { ...payload, id: Date.now().toString() }
  }
}

export async function deleteTransaction(id: string): Promise<void> {
  try {
    await api.delete(`/transactions/${id}`)
  } catch {
    // mock mode — state already updated optimistically
  }
}

// ── AI Advisor ─────────────────────────────────────
export async function analyzeFinances(
  _payload: AiAnalysisRequest
): Promise<string> {
  try {
    const { data } = await api.post<{ insight: string }>('/ai/analyze', _payload)
    return data.insight
  } catch {
    // Simulate network delay for realism
    await new Promise(r => setTimeout(r, 1800))
    return MOCK_AI_INSIGHT
  }
}

// ── Auth ───────────────────────────────────────────
export async function login(
  email: string,
  password: string
): Promise<{ token: string }> {
  const { data } = await api.post('/auth/login', { email, password })
  localStorage.setItem('wealthos_token', data.token)
  return data
}

export async function register(
  name: string,
  email: string,
  password: string
): Promise<void> {
  await api.post('/auth/register', { name, email, password })
}

export function logout(): void {
  localStorage.removeItem('wealthos_token')
}
