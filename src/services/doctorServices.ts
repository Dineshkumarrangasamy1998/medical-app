import type { Doctor } from '../types/doctors.type'
import { getCurrentUser, canModify } from './userServices'

export interface StoredDoctor extends Doctor {
  id: string
  createdAt: string
  updatedAt: string
  createdBy?: string
}

const STORAGE_KEY = 'app:doctors'

function safeParse(json: string | null): StoredDoctor[] {
  if (!json) return []
  try {
    const data = JSON.parse(json)
    if (Array.isArray(data)) return data as StoredDoctor[]
    return []
  } catch {
    return []
  }
}

function persist(list: StoredDoctor[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  // window.dispatchEvent(new Event('doctors:changed'))
}

export function getDoctors(): StoredDoctor[] {
  return safeParse(localStorage.getItem(STORAGE_KEY)).map(d => ({ ...d, createdBy: (d as any).createdBy }))
}

export function getDoctor(id: string): StoredDoctor | null {
  return getDoctors().find(d => d.id === id) || null
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return 'd_' + Math.random().toString(36).slice(2, 11)
}

export type NewDoctorInput = Doctor

export function addDoctor(input: NewDoctorInput): StoredDoctor {
  const now = new Date().toISOString()
  const doctor: StoredDoctor = {
    ...input,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
    createdBy: getCurrentUser()?.email,
  }
  const list = getDoctors()
  list.push(doctor)
  persist(list)
  return doctor
}

export function updateDoctor(id: string, updates: Partial<Doctor>): StoredDoctor | null {
  const list = getDoctors()
  const idx = list.findIndex(d => d.id === id)
  if (idx === -1) return null
  const original = list[idx]!
  if (!canModify(original.createdBy)) throw new Error('Not authorized to update doctor')
  const updated: StoredDoctor = {
    id: original.id,
    createdAt: original.createdAt,
    doctorName: updates.doctorName ?? original.doctorName,
    doctorSpecialist: updates.doctorSpecialist ?? original.doctorSpecialist,
    doctorEmail: updates.doctorEmail ?? original.doctorEmail,
    doctorContact: updates.doctorContact ?? original.doctorContact,
    doctorExperience: updates.doctorExperience ?? original.doctorExperience,
    updatedAt: new Date().toISOString(),
    createdBy: original.createdBy,
  }
  list[idx] = updated
  persist(list)
  return updated
}

export function deleteDoctor(id: string): boolean {
  const list = getDoctors()
  const idx = list.findIndex(d => d.id === id)
  if (idx === -1) return false
  if (!canModify(list[idx]!.createdBy)) throw new Error('Not authorized to delete doctor')
  const next = list.filter(d => d.id !== id)
  if (next.length === list.length) return false
  persist(next)
  return true
}

export function clearDoctors(): void {
  persist([])
}

export function replaceDoctors(newDoctors: NewDoctorInput[]): StoredDoctor[] {
  const now = new Date().toISOString()
  const list: StoredDoctor[] = newDoctors.map(d => ({
    ...d,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  }))
  persist(list)
  return list
}

export function onDoctorsChanged(handler: (e: Event) => void): void {
  window.addEventListener('doctors:changed', handler as any)
}

export function offDoctorsChanged(handler: (e: Event) => void): void {
  window.removeEventListener('doctors:changed', handler as any)
}
