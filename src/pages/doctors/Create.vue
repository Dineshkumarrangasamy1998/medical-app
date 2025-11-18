<template>
  <div>
    <div class="mt-1">
      <form @submit.prevent="submitForm">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="space-y-1 text-sm">
            <label for="doctorName" class="block text-gray-600 required"
              >Doctor Name</label
            >
            <input
              type="text"
              id="doctorName"
              v-model="doctorName"
              @input="onInput('doctorName')"
              @blur="onInput('doctorName')"
              placeholder="Dr. Dinesh Kumar"
              class="w-full px-4 py-3 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              required
            />
            <p
              v-if="touched.doctorName && errors.doctorName"
              class="text-xs text-red-600"
            >
              {{ errors.doctorName }}
            </p>
          </div>

          <div class="space-y-1 text-sm">
            <label for="doctorSpecialist" class="block text-gray-600 required"
              >Specialist</label
            >
            <input
              type="text"
              id="doctorSpecialist"
              v-model="doctorSpecialist"
              @input="onInput('doctorSpecialist')"
              @blur="onInput('doctorSpecialist')"
              placeholder="Cardiologist"
              class="w-full px-4 py-3 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              required
            />
            <p
              v-if="touched.doctorSpecialist && errors.doctorSpecialist"
              class="text-xs text-red-600"
            >
              {{ errors.doctorSpecialist }}
            </p>
          </div>

          <div class="space-y-1 text-sm">
            <label
              for="refCode"
              class="block text-gray-600"
              :class="{ required: !isEditMode }"
              >Referral Code</label
            >
            <input
              type="text"
              id="refCode"
              v-model="refCode"
              @input="onInput('refCode')"
              @blur="onInput('refCode')"
              placeholder="DOC-REF-2025"
              class="w-full px-4 py-3 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              :disabled="isEditMode"
            />
            <p
              v-if="touched.refCode && errors.refCode"
              class="text-xs text-red-600"
            >
              {{ errors.refCode }}
            </p>
          </div>

          <div class="space-y-1 text-sm">
            <label for="doctorExperience" class="block text-gray-600 required"
              >Experience (years)</label
            >
            <input
              type="number"
              id="doctorExperience"
              v-model.number="doctorExperience"
              @input="onInput('doctorExperience')"
              @blur="onInput('doctorExperience')"
              min="0"
              max="60"
              placeholder="10"
              class="w-full px-4 py-3 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              required
            />
            <p
              v-if="touched.doctorExperience && errors.doctorExperience"
              class="text-xs text-red-600"
            >
              {{ errors.doctorExperience }}
            </p>
          </div>

          <div class="space-y-1 text-sm">
            <label for="doctorContact" class="block text-gray-600 required"
              >Contact Number</label
            >
            <input
              type="tel"
              id="doctorContact"
              v-model="doctorContact"
              @input="onInput('doctorContact')"
              @blur="onInput('doctorContact')"
              placeholder="e.g., +1 555 123 4567"
              class="w-full px-4 py-3 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              required
            />
            <p
              v-if="touched.doctorContact && errors.doctorContact"
              class="text-xs text-red-600"
            >
              {{ errors.doctorContact }}
            </p>
          </div>

          <div class="space-y-1 text-sm">
            <label for="doctorEmail" class="block text-gray-600 required"
              >Email</label
            >
            <input
              type="email"
              id="doctorEmail"
              v-model="doctorEmail"
              @input="onInput('doctorEmail')"
              @blur="onInput('doctorEmail')"
              placeholder="dineshkumar@gmail.com"
              class="w-full px-4 py-3 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              required
            />
            <p
              v-if="touched.doctorEmail && errors.doctorEmail"
              class="text-xs text-red-600"
            >
              {{ errors.doctorEmail }}
            </p>
          </div>
        </div>

        <div class="flex justify-end items-center gap-1 mt-2">
          <button
            type="button"
            class="mr-4 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            @click="$emit('cancel-form')"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="!formValid"
            :class="[
              'px-4 py-2 rounded-md text-white',
              formValid
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-blue-300 cursor-not-allowed',
            ]"
          >
            {{ isEditMode ? "Update" : "Submit" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script lang="ts">
import { addDoctor, updateDoctor } from "../../services/doctorServices";
import { toastMixin } from "../../utils/toast";
import { DOCTOR_REF_CODE } from "../../utils/constants.ts";
import {
  isRequiredText,
  hasMinLength,
  isValidEmail,
  isTenDigitPhone,
} from "../../utils/validationRules";

export default {
  name: "CreateDoctor",
  mixins: [toastMixin],
  props: {
    userData: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      doctorName: "",
      doctorSpecialist: "",
      doctorExperience: null as number | null,
      doctorContact: "",
      doctorEmail: "",
      refCode: "",
      REF_CODE: DOCTOR_REF_CODE,
      errors: {
        doctorName: "",
        doctorSpecialist: "",
        doctorExperience: "",
        doctorContact: "",
        doctorEmail: "",
        refCode: "",
      } as Record<string, string>,
      touched: {
        doctorName: false,
        doctorSpecialist: false,
        doctorExperience: false,
        doctorContact: false,
        doctorEmail: false,
        refCode: false,
      } as Record<string, boolean>,
    };
  },
  emits: ["doctor-added", "cancel-form", "doctor-updated"],
  computed: {
    formValid(): boolean {
      return this.checkValid();
    },
    isEditMode(): boolean {
      return !!this.userData;
    },
  },
  watch: {
    userData: {
      immediate: true,
      handler(val: any) {
        if (val) {
          this.doctorName = val.doctorName || "";
          this.doctorSpecialist = val.doctorSpecialist || "";
          this.doctorExperience =
            typeof val.doctorExperience === "number"
              ? val.doctorExperience
              : parseInt(val.doctorExperience || "0", 10) || 0;
          this.doctorContact = val.doctorContact || "";
          this.doctorEmail = val.doctorEmail || "";
          Object.keys(this.errors).forEach((k) => (this.errors[k] = ""));
        } else {
          this.resetForm();
        }
      },
    },
  },
  methods: {
    baseValidation(): Record<string, string> {
      const errs: Record<string, string> = {
        doctorName: "",
        doctorSpecialist: "",
        doctorExperience: "",
        doctorContact: "",
        doctorEmail: "",
        refCode: "",
      };
      if (!isRequiredText(this.doctorName)) errs.doctorName = "Name required";
      else if (!hasMinLength(this.doctorName, 2))
        errs.doctorName = "Min 2 characters";

      if (!isRequiredText(this.doctorSpecialist))
        errs.doctorSpecialist = "Specialist required";

      if (this.doctorExperience === null || isNaN(this.doctorExperience))
        errs.doctorExperience = "Experience required";
      else if (this.doctorExperience < 0)
        errs.doctorExperience = "Cannot be negative";
      else if (this.doctorExperience > 60)
        errs.doctorExperience = "Unrealistic value";

      if (!isRequiredText(this.doctorContact))
        errs.doctorContact = "Contact required";
      else if (!isTenDigitPhone(this.doctorContact))
        errs.doctorContact = "Must be 10 digits";

      if (!isRequiredText(this.doctorEmail))
        errs.doctorEmail = "Email required";
      else if (!isValidEmail(this.doctorEmail))
        errs.doctorEmail = "Invalid email";

      if (!this.isEditMode) {
        if (!this.refCode.trim()) errs.refCode = "Referral code required";
        else if (this.refCode.trim() !== this.REF_CODE)
          errs.refCode = "Invalid referral code";
      }
      return errs;
    },
    checkValid(): boolean {
      const errs = this.baseValidation();
      return Object.values(errs).every((v) => v === "");
    },
    validateAll() {
      this.errors = this.baseValidation();
    },
    validateField(field: string) {
      const errs = this.baseValidation();
      this.errors[field] = errs[field] || "";
    },
    onInput(field: string) {
      this.touched[field] = true;
      this.validateField(field);
    },
    resetForm() {
      this.doctorName = "";
      this.doctorSpecialist = "";
      this.doctorExperience = null;
      this.doctorContact = "";
      this.doctorEmail = "";
      this.refCode = "";
      Object.keys(this.errors).forEach((k) => (this.errors[k] = ""));
    },
    submitForm() {
      this.touched = Object.fromEntries(
        Object.keys(this.touched).map((k) => [k, true])
      ) as Record<string, boolean>;
      this.validateAll();
      if (!this.checkValid()) return;

      const payload = {
        doctorName: this.doctorName.trim(),
        doctorSpecialist: this.doctorSpecialist.trim(),
        doctorExperience: this.doctorExperience as number,
        doctorContact: this.doctorContact.trim(),
        doctorEmail: this.doctorEmail.trim(),
      };

      if (this.isEditMode && this.userData) {
        updateDoctor(this.userData.id, payload);
        this.toastSuccess("Doctor updated successfully");
        this.$emit("doctor-updated");
        this.resetForm();
      } else {
        addDoctor(payload);
        this.toastSuccess("Doctor added successfully");
        this.resetForm();
        this.$emit("doctor-added");
      }
    },
  },
};
</script>
