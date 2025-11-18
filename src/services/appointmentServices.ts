import type { Appointment } from '../types/appointments.type'
import { getCurrentUser, canModify, isAdmin } from './userServices'

export interface StoredAppointment extends Appointment {
  id: string
  createdAt: string
  updatedAt: string
  createdBy?: string
}

const STORAGE_KEY = 'app:appointments'

function safeParse(json: string | null): StoredAppointment[] {
  if (!json) return []
  try {
    const data = JSON.parse(json)
    if (Array.isArray(data)) return data as StoredAppointment[]
    return []
  } catch {
    return []
  }
}

function persist(list: StoredAppointment[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export function getAppointments(): StoredAppointment[] {
  return safeParse(localStorage.getItem(STORAGE_KEY)).map(a => ({ ...a, createdBy: (a as any).createdBy }))
}

export function getAppointment(id: string): StoredAppointment | null {
  return getAppointments().find(a => a.id === id) || null
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return 'a_' + Math.random().toString(36).slice(2, 11)
}

export type NewAppointmentInput = Appointment

export function addAppointment(input: NewAppointmentInput): StoredAppointment {
  const now = new Date().toISOString()
  const record: StoredAppointment = {
    ...input,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
    createdBy: getCurrentUser()?.email,
  }
  const list = getAppointments()
  list.push(record)
  persist(list)
  return record
}

export function updateAppointment(id: string, updates: Partial<Appointment>): StoredAppointment | null {
  const list = getAppointments()
  const idx = list.findIndex(a => a.id === id)
  if (idx === -1) return null
  const original = list[idx]!
  if (!canModify(original.createdBy)) throw new Error('Not authorized to update appointment')
  const updated: StoredAppointment = {
    id: original.id,
    createdAt: original.createdAt,
    patientId: updates.patientId ?? original.patientId,
    doctorId: updates.doctorId ?? original.doctorId,
    appointmentDate: updates.appointmentDate ?? original.appointmentDate,
    appointmentTime: updates.appointmentTime ?? original.appointmentTime,
    notes: updates.notes ?? original.notes,
    reason: updates.reason ?? original.reason,
    status: (isAdmin() ? (updates.status ?? original.status) : original.status),
    updatedAt: new Date().toISOString(),
    createdBy: original.createdBy,
  }
  list[idx] = updated
  persist(list)
  return updated
}

export function deleteAppointment(id: string): boolean {
  const list = getAppointments()
  const idx = list.findIndex(a => a.id === id)
  if (idx === -1) return false
  if (!canModify(list[idx]!.createdBy)) throw new Error('Not authorized to delete appointment')
  const next = list.filter(a => a.id !== id)
  if (next.length === list.length) return false
  persist(next)
  return true
}

export function onAppointmentsChanged(handler: (e: Event) => void): void {
  window.addEventListener('appointments:changed', handler as any)
}

export function offAppointmentsChanged(handler: (e: Event) => void): void {
  window.removeEventListener('appointments:changed', handler as any)
}
