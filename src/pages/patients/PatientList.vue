<template>
  <div class="flex justify-between items-center flex-wrap">
    <div>
      <h1 class="text-3xl font-bold">Patient List</h1>
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
    v-if="patientsList && patientsList.length"
    :headers="headers"
    :items="filteredPatients"
    alternating
    :rows-per-page="5"
  >
    <template #item-actions="item">
      <button
        v-if="canModify(item.createdBy)"
        class="action-btn"
        @click="editPatient(item)"
        aria-label="Edit"
      >
        <EditIcon class="w-4 h-4" />
      </button>
      <button
        v-if="canModify(item.createdBy)"
        class="action-btn danger"
        @click="deletePatient(item)"
        aria-label="Delete"
      >
        <TrashIcon class="w-4 h-4" />
      </button>
    </template>
  </EasyDataTable>
  <div class="" v-else>
    <NoData
      message="No patients found"
      description="Try adjusting your filters."
    />
  </div>
  <CommonDialog
    v-model="isDialogOpen"
    title="Patient Details"
    :close-on-esc="true"
    :close-on-backdrop="true"
  >
    <CreatePatient
      :user-data="selectedPatient"
      @cancel-form="closeDialog()"
      @patient-added="closeDialog()"
      @patient-updated="onPatientUpdated"
    />
  </CommonDialog>
</template>
<script lang="ts">
import CommonDialog from "../../components/CommonDialog.vue";
import NoData from "../../components/NoData.vue";
import {
  deletePatient,
  getPatients,
  type StoredPatient,
} from "../../services/patientServices";
import { canModify } from "../../services/userServices";
import CreatePatient from "./CreatePatient.vue";
import { EditIcon, TrashIcon } from "../../utils/icons";
import { patientHeader } from "../../utils/data";

export default {
  name: "PatientList",
  data(): {
    patientsList: StoredPatient[];
    headers: Array<{ text: string; value: string; sortable?: boolean }>;
    searchValue: string;
    isDialogOpen: boolean;
    selectedPatient: StoredPatient | undefined;
  } {
    return {
      patientsList: [],
      headers: patientHeader,
      searchValue: "",
      isDialogOpen: false,
      selectedPatient: undefined,
    };
  },
  computed: {
    filteredPatients(): StoredPatient[] {
      const q = this.searchValue.trim().toLowerCase();
      if (!q) return this.patientsList;
      return this.patientsList.filter((p) => {
        return [
          p.patientName,
          p.patientEmail,
          p.patientContact,
          p.patientDateOfBirth,
          p.patientGender,
        ].some((val) => (val || "").toLowerCase().includes(q));
      });
    },
  },
  mounted() {
    this.getPatientsDetails();
  },
  components: {
    NoData,
    CommonDialog,
    CreatePatient,
    EditIcon,
    TrashIcon,
  },
  methods: {
    closeDialog() {
      this.isDialogOpen = false;
      this.selectedPatient = undefined;
      this.getPatientsDetails();
    },
    getPatientsDetails() {
      this.patientsList = getPatients();
    },
    editPatient(patient: StoredPatient) {
      this.selectedPatient = patient;
      this.isDialogOpen = true;
    },
    deletePatient(patient: StoredPatient) {
      if (!canModify(patient.createdBy)) return;
      if (confirm("Delete this patient?")) {
        deletePatient(patient.id);
        this.selectedPatient = undefined;
        this.getPatientsDetails();
      }
    },
    canModify(createdBy?: string) {
      return canModify(createdBy);
    },
    onPatientUpdated() {
      this.selectedPatient = undefined;
      this.getPatientsDetails();
      this.closeDialog();
    },
  },
};
</script>
<style scoped>
/* Action buttons */
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
