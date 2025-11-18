<template>
  <section class="mx-auto max-w-7xl p-4">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-semibold">Upcoming Appointments</h1>
      <router-link
        v-if="rows && rows.length"
        to="/appointment"
        class="inline-flex items-center rounded bg-blue-600 px-4 py-2 text-white text-sm hover:bg-blue-700 focus:outline-none focus:ring"
        >Book appointment</router-link
      >
    </div>

    <div
      v-if="rows.length"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <article
        v-for="item in rows"
        :key="item.id"
        class="rounded-lg border bg-white shadow-sm p-4 flex flex-col gap-3"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div
              class="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-200"
            >
              <UserIcon class="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <p class="font-medium">{{ item.doctorName }}</p>
              <p class="text-xs text-gray-500">{{ item.doctorSpecialist }}</p>
            </div>
          </div>
          <span
            :class="[
              'px-2 py-1 rounded text-xs font-medium',
              statusClass(item.status),
            ]"
            >{{ item.status }}</span
          >
        </div>

        <div class="text-sm grid grid-cols-2 gap-y-1">
          <p class="text-gray-500">Patient</p>
          <p class="text-gray-800 text-right">{{ item.patientName }}</p>

          <p class="text-gray-500">Date</p>
          <p class="text-gray-800 text-right">{{ item.appointmentDate }}</p>

          <p class="text-gray-500">Time</p>
          <p class="text-gray-800 text-right">{{ item.appointmentTime }}</p>
        </div>

        <p v-if="item.notes" class="text-sm text-gray-700 border-t pt-2">
          {{ item.notes }}
        </p>

        <div class="mt-auto pt-2 flex items-center justify-end gap-2">
          <router-link
            to="/appointment"
            class="text-xs text-blue-700 hover:underline"
            >Manage</router-link
          >
        </div>
      </article>
    </div>

    <div v-else class="flex flex-col items-center justify-center py-16">
      <NoData
        message="No appointments yet"
        description="Book your first appointment."
      />
      <router-link
        to="/appointment"
        class="mt-4 inline-flex items-center rounded bg-blue-600 px-4 py-2 text-white text-sm hover:bg-blue-700 focus:outline-none focus:ring"
        >Book appointment</router-link
      >
    </div>
  </section>
</template>

<script lang="ts">
import NoData from "../../components/NoData.vue";
import {
  getAppointments,
  type StoredAppointment,
} from "../../services/appointmentServices";
import {
  getPatients,
  type StoredPatient,
} from "../../services/patientServices";
import { getDoctors, type StoredDoctor } from "../../services/doctorServices";
import { UserIcon } from "../../utils/icons";

type Row = StoredAppointment & {
  patientName: string;
  doctorName: string;
  doctorSpecialist: string;
};

export default {
  name: "Home",
  components: { NoData, UserIcon },
  data(): { rows: Row[] } {
    return { rows: [] };
  },
  mounted() {
    this.refresh();
  },
  methods: {
    refresh() {
      const appts = getAppointments();
      const patients = new Map<string, StoredPatient>(
        getPatients().map((p) => [p.id, p])
      );
      const doctors = new Map<string, StoredDoctor>(
        getDoctors().map((d) => [d.id, d])
      );
      // Sort by date/time ascending
      const sorted = [...appts].sort((a, b) =>
        (a.appointmentDate + " " + a.appointmentTime).localeCompare(
          b.appointmentDate + " " + b.appointmentTime
        )
      );
      this.rows = sorted.map((a) => ({
        ...a,
        patientName: patients.get(a.patientId)?.patientName || "—",
        doctorName: doctors.get(a.doctorId)?.doctorName || "—",
        doctorSpecialist: doctors.get(a.doctorId)?.doctorSpecialist || "—",
      }));
    },
    statusClass(status: string) {
      switch (status) {
        case "Completed":
          return "bg-green-100 text-green-800 border border-green-200";
        case "Cancelled":
          return "bg-red-100 text-red-800 border border-red-200";
        default:
          return "bg-blue-100 text-blue-800 border border-blue-200";
      }
    },
  },
};
</script>

<style scoped></style>
