<template>
	<div>
		<form @submit.prevent="submitForm">
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<div class="space-y-1 text-sm">
					<label for="patientId" class="block text-gray-600 required">Patient</label>
					<select id="patientId" v-model="patientId" @change="onInput('patientId')" class="w-full px-4 py-3 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500" required>
						<option value="" disabled>Select patient</option>
						<option v-for="p in patients" :key="p.id" :value="p.id">{{ p.patientName }}</option>
					</select>
					<p v-if="touched.patientId && errors.patientId" class="text-xs text-red-600">{{ errors.patientId }}</p>
				</div>

				<div class="space-y-1 text-sm">
					<label for="doctorId" class="block text-gray-600 required">Doctor</label>
					<select id="doctorId" v-model="doctorId" @change="onInput('doctorId')" class="w-full px-4 py-3 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500" required>
						<option value="" disabled>Select doctor</option>
						<option v-for="d in doctors" :key="d.id" :value="d.id">{{ d.doctorName }} — {{ d.doctorSpecialist }}</option>
					</select>
					<p v-if="touched.doctorId && errors.doctorId" class="text-xs text-red-600">{{ errors.doctorId }}</p>
				</div>

				<div class="space-y-1 text-sm">
					<label for="date" class="block text-gray-600 required">Date</label>
					<input type="date" id="date" v-model="appointmentDate" @input="onInput('appointmentDate')" @blur="onInput('appointmentDate')" :min="today" class="w-full px-4 py-3 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500" required />
					<p v-if="touched.appointmentDate && errors.appointmentDate" class="text-xs text-red-600">{{ errors.appointmentDate }}</p>
				</div>

				<div class="space-y-1 text-sm">
					<label for="time" class="block text-gray-600 required">Time</label>
					<input type="time" id="time" v-model="appointmentTime" @input="onInput('appointmentTime')" @blur="onInput('appointmentTime')" placeholder="09:30" class="w-full px-4 py-3 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500" required />
					<p v-if="touched.appointmentTime && errors.appointmentTime" class="text-xs text-red-600">{{ errors.appointmentTime }}</p>
				</div>

				<div class="space-y-1 text-sm">
					<label for="status" class="block text-gray-600">Status</label>
					<select v-if="canChangeStatus" id="status" v-model="status" @change="onInput('status')" class="w-full px-4 py-3 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500">
						<option value="Scheduled">Scheduled</option>
						<option value="Completed">Completed</option>
						<option value="Cancelled">Cancelled</option>
					</select>
					<p v-else class="px-3 py-2 rounded border bg-gray-50 text-gray-600">{{ status }}</p>
				</div>

				<div class="space-y-1 text-sm">
					<label for="reason" class="block text-gray-600">Reason</label>
					<input id="reason" type="text" v-model="reason" @input="onInput('reason')" @blur="onInput('reason')" placeholder="e.g., Follow-up, Consultation" class="w-full px-4 py-3 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
				</div>

				<div class="space-y-1 text-sm md:col-span-2">
					<label for="notes" class="block text-gray-600">Notes</label>
					<textarea id="notes" v-model="notes" @input="onInput('notes')" @blur="onInput('notes')" class="w-full px-4 py-3 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500 input" rows="3" placeholder="Additional details"></textarea>
				</div>
			</div>

			<div class="flex justify-end items-center gap-1 mt-2">
				<button type="button" class="mr-4 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400" @click="$emit('cancel-form')">Cancel</button>
				<button type="submit" :disabled="!formValid" :class="['px-4 py-2 rounded-md text-white', formValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed']">{{ isEditMode ? 'Update' : 'Submit' }}</button>
			</div>
		</form>
	</div>
</template>

<script lang="ts">
import { getPatients, type StoredPatient } from '../../services/patientServices'
import { getDoctors, type StoredDoctor } from '../../services/doctorServices'
import { addAppointment, updateAppointment } from '../../services/appointmentServices'
import { isAdmin } from '../../services/userServices'
import type { AppointmentStatus } from '../../types/appointments.type'
import { toastMixin } from '../../utils/toast'

export default {
	name: 'CreateAppointment',
	mixins: [toastMixin],
	props: {
		userData: { type: Object, required: false },
	},
	data() {
		return {
			patients: [] as StoredPatient[],
			doctors: [] as StoredDoctor[],
			patientId: '',
			doctorId: '',
			appointmentDate: '',
			appointmentTime: '',
			status: 'Scheduled' as AppointmentStatus,
			reason: '',
			notes: '',
			errors: {
				patientId: '',
				doctorId: '',
				appointmentDate: '',
				appointmentTime: '',
			} as Record<string, string>,
			touched: {
				patientId: false,
				doctorId: false,
				appointmentDate: false,
				appointmentTime: false,
				status: false,
				reason: false,
				notes: false,
			} as Record<string, boolean>,
		}
	},
	emits: ['appointment-added', 'cancel-form', 'appointment-updated'],
	computed: {
		formValid(): boolean { return this.checkValid() },
		isEditMode(): boolean { return !!this.userData },
		today(): string { return new Date().toISOString().substring(0, 10) },
		canChangeStatus(): boolean { return isAdmin() },
	},
	created() {
		this.refreshPeople()
	},
	watch: {
		userData: {
			immediate: true,
			handler(val: any) {
				if (val) {
					this.patientId = val.patientId || ''
					this.doctorId = val.doctorId || ''
					this.appointmentDate = val.appointmentDate || ''
					this.appointmentTime = val.appointmentTime || ''
					this.status = val.status || 'Scheduled'
					this.reason = val.reason || ''
					this.notes = val.notes || ''
					Object.keys(this.errors).forEach(k => this.errors[k] = '')
				} else {
					this.resetForm()
				}
			}
		}
	},
	methods: {
		refreshPeople() {
			this.patients = getPatients()
			this.doctors = getDoctors()
		},
		baseValidation(): Record<string,string> {
			const errs: Record<string,string> = { patientId:'', doctorId:'', appointmentDate:'', appointmentTime:'' }
			if (!this.patientId) errs.patientId = 'Patient required'
			if (!this.doctorId) errs.doctorId = 'Doctor required'
			if (!this.appointmentDate) errs.appointmentDate = 'Date required'
			else if (this.appointmentDate < this.today) errs.appointmentDate = 'Cannot be in the past'
			if (!this.appointmentTime) errs.appointmentTime = 'Time required'
			return errs
		},
		checkValid(): boolean { const errs = this.baseValidation(); return Object.values(errs).every(v => v==='') },
		validateAll() { this.errors = this.baseValidation() },
		validateField(field: string) { const errs = this.baseValidation(); this.errors[field] = errs[field] || '' },
		onInput(field: string) { this.touched[field] = true; this.validateField(field) },
		resetForm() {
			this.patientId = ''
			this.doctorId = ''
			this.appointmentDate = ''
			this.appointmentTime = ''
			this.status = 'Scheduled'
			this.reason = ''
			this.notes = ''
			Object.keys(this.errors).forEach(k => this.errors[k] = '')
			Object.keys(this.touched).forEach(k => this.touched[k] = false)
		},
		submitForm() {
			this.touched = Object.fromEntries(Object.keys(this.touched).map(k => [k,true])) as Record<string, boolean>
			this.validateAll()
			if (!this.checkValid()) return
			const payload = {
				patientId: this.patientId,
				doctorId: this.doctorId,
				appointmentDate: this.appointmentDate,
				appointmentTime: this.appointmentTime,
				status: (isAdmin() ? this.status : 'Scheduled') as AppointmentStatus,
				reason: this.reason?.trim() || undefined,
				notes: this.notes.trim(),
			}
			if (this.isEditMode && this.userData) {
				updateAppointment(this.userData.id, payload)
				this.toastSuccess('Appointment updated successfully')
				this.$emit('appointment-updated')
				this.resetForm()
			} else {
				addAppointment(payload)
				this.toastSuccess('Appointment added successfully')
				this.resetForm()
				this.$emit('appointment-added')
			}
		}
	}
}
</script>
