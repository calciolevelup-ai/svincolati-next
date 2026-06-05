import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Sport, SportConfig } from './types'
import { SPORTS } from './constants'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function scfg(sport?: Sport | string | null): SportConfig {
  return SPORTS[(sport as Sport) || 'calcio'] || SPORTS.calcio
}

export function initials(name?: string | null): string {
  if (!name) return '?'
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0] || '').join('').toUpperCase()
}

export function relTime(ts: string | number): string {
  const ms = typeof ts === 'string' ? new Date(ts).getTime() : ts
  const diff = Date.now() - ms
  if (diff < 60000) return 'adesso'
  if (diff < 3600000) return `${Math.floor(diff / 60000)} min fa`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} ore fa`
  if (diff < 2592000000) return `${Math.floor(diff / 86400000)} giorni fa`
  return new Date(ms).toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })
}

export function calcAge(dob?: string | null): number | null {
  if (!dob) return null
  const age = Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 3600 * 1000))
  return age > 0 && age < 100 ? age : null
}

export function adDaysLeft(expiresAt: string): number {
  return Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 86400000))
}

export function fmtDate(ts: string): string {
  return new Date(ts).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })
}
