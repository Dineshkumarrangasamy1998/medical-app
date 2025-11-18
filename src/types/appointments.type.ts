export type AppointmentStatus = 'Scheduled' | 'Completed' | 'Cancelled'

export interface Appointment {
  patientId: string
  doctorId: string
  appointmentDate: string // YYYY-MM-DD
  appointmentTime: string // HH:mm
  notes: string
  reason?: string
  status: AppointmentStatus
}
