export interface Patient {
  patientName: string;
  patientGender: string;
  patientAddress: string;
  patientContact: string;
  patientAlternateContact: string; // newly added
  patientEmail: string;
  patientDateOfBirth: string; // ISO date string (YYYY-MM-DD)
}
