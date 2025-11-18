<template>
  <div class="flex justify-between items-center flex-wrap">
    <div>
      <h1 class="text-3xl font-bold">Appointments</h1>
    </div>
    <div class="justify-end flex mb-4 items-end gap-4">
      <div>
        <span>search value: </span>
        <input type="text" class="input" v-model="searchValue" />
      </div>
      <button
        type="button"
        class="inline-flex items-center rounded bg-blue-600 h-fit px-4 py-2 text-white text-sm hover:bg-blue-700 focus:outline-none focus:ring"
        @click="isDialogOpen = true"
      >
        Add new
      </button>
    </div>
  </div>

  <EasyDataTable
    v-if="rows && rows.length"
    :headers="headers"
    :items="filteredAppointments"
    alternating
    :rows-per-page="5"
  >
    <template #item-actions="item">
      <button
        v-if="canModify(item.createdBy)"
        class="action-btn"
        @click="edit(item)"
        aria-label="Edit"
      >
        <EditIcon class="w-4 h-4" />
      </button>
      <button
        v-if="canModify(item.createdBy)"
        class="action-btn danger"
        @click="remove(item)"
        aria-label="Delete"
      >
        <TrashIcon class="w-4 h-4" />
      </button>
    </template>
  </EasyDataTable>
  <div v-else>
    <NoData
      message="No appointments found"
      description="Try adjusting your filters."
    />
  </div>

  <CommonDialog
    v-model="isDialogOpen"
    title="Appointment"
    :close-on-esc="true"
    :close-on-backdrop="true"
  >
    <CreateAppointment
      :user-data="selected"
      @cancel-form="closeDialog()"
      @appointment-added="closeDialog()"
      @appointment-updated="onUpdated"
    />
  </CommonDialog>
</template>

<script lang="ts">
import CommonDialog from "../../components/CommonDialog.vue";
import NoData from "../../components/NoData.vue";
import CreateAppointment from "./CreateAppointment.vue";
import {
  deleteAppointment,
  getAppointments,
  type StoredAppointment,
} from "../../services/appointmentServices";
import { canModify } from "../../services/userServices";
import {
  getPatients,
  type StoredPatient,
} from "../../services/patientServices";
import { getDoctors, type StoredDoctor } from "../../services/doctorServices";
import { EditIcon, TrashIcon } from "../../utils/icons";
import { appointmentHeader } from "../../utils/data";

type Row = StoredAppointment & {
  patientName: string;
  doctorName: string;
  doctorSpecialist: string;
};

export default {
  name: "Appointment",
  data(): {
    rows: Row[];
    headers: Array<{ text: string; value: string; sortable?: boolean }>;
    searchValue: string;
    isDialogOpen: boolean;
    selected: StoredAppointment | undefined;
  } {
    return {
      rows: [],
      headers: appointmentHeader,
      searchValue: "",
      isDialogOpen: false,
      selected: undefined,
    };
  },
  computed: {
    filteredAppointments(): Row[] {
      const q = this.searchValue.trim().toLowerCase();
      if (!q) return this.rows;
      return this.rows.filter((r) =>
        [
          r.patientName,
          r.doctorName,
          r.doctorSpecialist,
          r.appointmentDate,
          r.appointmentTime,
          r.status,
          r.notes,
        ].some((v) => (v || "").toLowerCase().includes(q))
      );
    },
  },
  mounted() {
    this.refresh();
  },
  components: { NoData, CommonDialog, CreateAppointment, EditIcon, TrashIcon },
  methods: {
    closeDialog() {
      this.isDialogOpen = false;
      this.selected = undefined;
      this.refresh();
    },
    refresh() {
      const appointments = getAppointments();
      const patients = new Map<string, StoredPatient>(
        getPatients().map((p) => [p.id, p])
      );
      const doctors = new Map<string, StoredDoctor>(
        getDoctors().map((d) => [d.id, d])
      );
      this.rows = appointments.map((a) => ({
        ...a,
        patientName: patients.get(a.patientId)?.patientName || "—",
        doctorName: doctors.get(a.doctorId)?.doctorName || "—",
        doctorSpecialist: doctors.get(a.doctorId)?.doctorSpecialist || "—",
      }));
    },
    edit(row: Row) {
      this.selected = row;
      this.isDialogOpen = true;
    },
    remove(row: Row) {
      if (!canModify(row.createdBy)) return;
      if (confirm("Delete this appointment?")) {
        deleteAppointment(row.id);
        this.selected = undefined;
        this.refresh();
      }
    },
    canModify(createdBy?: string) {
      return canModify(createdBy);
    },
    onUpdated() {
      this.selected = undefined;
      this.refresh();
      this.closeDialog();
    },
  },
};
</script>

<style scoped>
.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;
  background: #f5f5f5;
  border: 1px solid #d9d9d9;
  cursor: pointer;
  margin-right: 6px;
}
.action-btn:hover {
  background: #e8e8e8;
}
.action-btn.danger {
  background: #ffecec;
  border-color: #f5b5b5;
}
.action-btn.danger:hover {
  background: #ffd5d6;
}
.action-btn svg {
  width: 16px;
  height: 16px;
}
.action-btn.danger svg {
  color: #c20000;
}
</style>
