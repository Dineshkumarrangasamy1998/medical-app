<template>
  <div class="flex justify-between items-center flex-wrap">
    <div>
      <h1 class="text-3xl font-bold">Doctor List</h1>
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
    v-if="doctorsList && doctorsList.length"
    :headers="headers"
    :items="filteredDoctors"
    alternating
    :rows-per-page="5"
  >
    <template #item-actions="item">
      <button
        v-if="canModify(item.createdBy)"
        class="action-btn"
        @click="editDoctor(item)"
        aria-label="Edit"
      >
        <EditIcon class="w-4 h-4" />
      </button>
      <button
        v-if="canModify(item.createdBy)"
        class="action-btn danger"
        @click="deleteDoctor(item)"
        aria-label="Delete"
      >
        <TrashIcon class="w-4 h-4" />
      </button>
    </template>
  </EasyDataTable>
  <div v-else>
    <NoData
      message="No doctors found"
      description="Try adjusting your filters."
    />
  </div>
  <CommonDialog
    v-model="isDialogOpen"
    title="Doctor Details"
    :close-on-esc="true"
    :close-on-backdrop="true"
  >
    <CreateDoctor
      :user-data="selectedDoctor"
      @cancel-form="closeDialog()"
      @doctor-added="closeDialog()"
      @doctor-updated="onDoctorUpdated"
    />
  </CommonDialog>
</template>
<script lang="ts">
import CommonDialog from "../../components/CommonDialog.vue";
import NoData from "../../components/NoData.vue";
import {
  deleteDoctor,
  getDoctors,
  type StoredDoctor,
} from "../../services/doctorServices";
import { canModify } from "../../services/userServices";
import CreateDoctor from "./Create.vue";
import { EditIcon, TrashIcon } from "../../utils/icons";
import { doctorHeader } from "../../utils/data";

export default {
  name: "DoctorList",
  data(): {
    doctorsList: StoredDoctor[];
    headers: Array<{ text: string; value: string; sortable?: boolean }>;
    searchValue: string;
    isDialogOpen: boolean;
    selectedDoctor: StoredDoctor | undefined;
  } {
    return {
      doctorsList: [],
      headers: doctorHeader,
      searchValue: "",
      isDialogOpen: false,
      selectedDoctor: undefined,
    };
  },
  computed: {
    filteredDoctors(): StoredDoctor[] {
      const q = this.searchValue.trim().toLowerCase();
      if (!q) return this.doctorsList;
      return this.doctorsList.filter((d) =>
        [
          d.doctorName,
          d.doctorSpecialist,
          String(d.doctorExperience ?? ""),
          d.doctorContact,
          d.doctorEmail,
        ].some((val) => (val || "").toLowerCase().includes(q))
      );
    },
  },
  mounted() {
    this.getDoctorsDetails();
  },
  components: {
    NoData,
    CommonDialog,
    CreateDoctor,
    EditIcon,
    TrashIcon,
  },
  methods: {
    closeDialog() {
      this.isDialogOpen = false;
      this.selectedDoctor = undefined;
      this.getDoctorsDetails();
    },
    getDoctorsDetails() {
      this.doctorsList = getDoctors();
    },
    editDoctor(doctor: StoredDoctor) {
      this.selectedDoctor = doctor;
      this.isDialogOpen = true;
    },
    deleteDoctor(doctor: StoredDoctor) {
      if (!canModify(doctor.createdBy)) return;
      if (confirm("Delete this doctor?")) {
        deleteDoctor(doctor.id);
        this.selectedDoctor = undefined;
        this.getDoctorsDetails();
      }
    },
    canModify(createdBy?: string) {
      return canModify(createdBy);
    },
    onDoctorUpdated() {
      this.selectedDoctor = undefined;
      this.getDoctorsDetails();
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
