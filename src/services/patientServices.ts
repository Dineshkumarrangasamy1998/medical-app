import type { Patient } from '../types/patients.type'
import { getCurrentUser, canModify } from './userServices'

export interface StoredPatient extends Patient {
	id: string
	createdAt: string
	updatedAt: string
	createdBy?: string
}

const STORAGE_KEY = 'app:patients'

function safeParse(json: string | null): StoredPatient[] {
	if (!json) return []
	try {
		const data = JSON.parse(json)
		if (Array.isArray(data)) return data as StoredPatient[]
		return []
	} catch {
		return []
	}
}

function persist(list: StoredPatient[]): void {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export function getPatients(): StoredPatient[] {
	const list = safeParse(localStorage.getItem(STORAGE_KEY))
	return list.map(p => ({
		...p,
		patientAlternateContact: (p as any).patientAlternateContact ?? '',
		patientDateOfBirth: (p as any).patientDateOfBirth ?? '',
		createdBy: (p as any).createdBy,
	}))
}

function generateId(): string {
	if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
		return crypto.randomUUID()
	}
	return 'p_' + Math.random().toString(36).slice(2, 11)
}

export type NewPatientInput = Patient

export function addPatient(input: NewPatientInput): StoredPatient {
	console.log("calling");
	debugger
	const now = new Date().toISOString()
	const patient: StoredPatient = {
		...input,
		id: generateId(),
		createdAt: now,
		updatedAt: now,
		createdBy: getCurrentUser()?.email,
	}
	const list = getPatients()
	list.push(patient)
	persist(list)
	return patient
}

export function updatePatient(id: string, updates: Partial<Patient>): StoredPatient | null {
	const list = getPatients()
	const idx = list.findIndex(p => p.id === id)
	if (idx === -1) return null
	const original = list[idx]!
	if (!canModify(original.createdBy)) throw new Error('Not authorized to update patient')
	const updated: StoredPatient = {
		id: original.id,
		createdAt: original.createdAt,
		patientName: updates.patientName ?? original.patientName,
		patientGender: updates.patientGender ?? original.patientGender,
		patientAddress: updates.patientAddress ?? original.patientAddress,
		patientContact: updates.patientContact ?? original.patientContact,
		patientAlternateContact: (updates as any).patientAlternateContact ?? (original as any).patientAlternateContact ?? '',
		patientEmail: updates.patientEmail ?? original.patientEmail,
		patientDateOfBirth: (updates as any).patientDateOfBirth ?? (original as any).patientDateOfBirth ?? '',
		updatedAt: new Date().toISOString(),
		createdBy: original.createdBy,
	}
	list[idx] = updated
	persist(list)
	return updated
}

export function deletePatient(id: string): boolean {
	const list = getPatients()
	const idx = list.findIndex(p => p.id === id)
	if (idx === -1) return false
	if (!canModify(list[idx]!.createdBy)) throw new Error('Not authorized to delete patient')
	const next = list.filter(p => p.id !== id)
	if (next.length === list.length) return false
	persist(next)
	return true
}

// Subscribe helper (consumer can remove listener manually)
export function onPatientsChanged(handler: (e: Event) => void): void {
	window.addEventListener('patients:changed', handler as any)
}

export function offPatientsChanged(handler: (e: Event) => void): void {
	window.removeEventListener('patients:changed', handler as any)
}

