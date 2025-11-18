<template>
  <div>
    <div class="mt-1">
      <form @submit.prevent="submitForm">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="space-y-1 text-sm">
            <label for="patientName" class="block text-gray-600 required"
              >Patient Name</label
            >
            <input
              type="text"
              id="patientName"
              v-model="patientName"
              @input="onInput('patientName')"
              @blur="onInput('patientName')"
              placeholder="Dinesh Kumar"
              class="w-full px-4 py-3 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              required
            />
            <p
              v-if="touched.patientName && errors.patientName"
              class="text-xs text-red-600"
            >
              {{ errors.patientName }}
            </p>
          </div>
          <div class="space-y-1 text-sm">
            <label for="dateofbirth" class="block text-gray-600 required"
              >Date of Birth</label
            >
            <input
              type="date"
              id="dateofbirth"
              v-model="patientDateOfBirth"
              @input="onInput('patientDateOfBirth')"
              @blur="onInput('patientDateOfBirth')"
              :max="new Date().toISOString().split('T')[0]"
              class="w-full px-4 py-3 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              required
            />
            <p
              v-if="touched.patientDateOfBirth && errors.patientDateOfBirth"
              class="text-xs text-red-600"
            >
              {{ errors.patientDateOfBirth }}
            </p>
          </div>
          <div class="space-y-1 text-sm">
            <label for="gender" class="block text-gray-600 required"
              >Gender</label
            >
            <select
              id="gender"
              class="w-full px-4 py-3 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              v-model="patientGender"
              @change="onInput('patientGender')"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <p
              v-if="touched.patientGender && errors.patientGender"
              class="text-xs text-red-600"
            >
              {{ errors.patientGender }}
            </p>
          </div>
          <div class="space-y-1 text-sm">
            <label for="contact" class="block text-gray-600 required"
              >Contact Number</label
            >
            <input
              type="tel"
              id="contact"
              v-model="patientContact"
              @input="onInput('patientContact')"
              @blur="onInput('patientContact')"
              placeholder="e.g., +1 555 123 4567"
              class="w-full px-4 py-3 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              required
            />
            <p
              v-if="touched.patientContact && errors.patientContact"
              class="text-xs text-red-600"
            >
              {{ errors.patientContact }}
            </p>
          </div>
          <div class="space-y-1 text-sm">
            <label for="alternateContact" class="block text-gray-600"
              >Alternate Contact</label
            >
            <input
              type="tel"
              id="alternateContact"
              v-model="patientAlternateContact"
              @input="onInput('patientAlternateContact')"
              @blur="onInput('patientAlternateContact')"
              placeholder="Optional alternate number"
              class="w-full px-4 py-3 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
            <p
              v-if="
                touched.patientAlternateContact &&
                errors.patientAlternateContact
              "
              class="text-xs text-red-600"
            >
              {{ errors.patientAlternateContact }}
            </p>
          </div>
          <div class="space-y-1 text-sm">
            <label for="email" class="block text-gray-600 required"
              >Email</label
            >
            <input
              type="email"
              id="email"
              v-model="patientEmail"
              @input="onInput('patientEmail')"
              @blur="onInput('patientEmail')"
              placeholder="dinesh@gmail.com"
              class="w-full px-4 py-3 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              required
            />
            <p
              v-if="touched.patientEmail && errors.patientEmail"
              class="text-xs text-red-600"
            >
              {{ errors.patientEmail }}
            </p>
          </div>
          <div class="space-y-1 text-sm col-span-2">
            <label for="address" class="block text-gray-600 required"
              >Address</label
            >
            <textarea
              id="address"
              v-model="patientAddress"
              @input="onInput('patientAddress')"
              @blur="onInput('patientAddress')"
              placeholder="Street, City, State"
              class="w-full px-4 py-3 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-blue-500 input"
              required
            ></textarea>
            <p
              v-if="touched.patientAddress && errors.patientAddress"
              class="text-xs text-red-600"
            >
              {{ errors.patientAddress }}
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
import { v4 as uuidv4 } from "uuid";
import { addPatient, updatePatient } from "../../services/patientServices";
import { toastMixin } from "../../utils/toast";
import {
  isRequiredText,
  hasMinLength,
  isTenDigitPhone,
  isValidEmail,
  isNotFutureDate,
} from "../../utils/validationRules";
export default {
  name: "CreatePatient",
  mixins: [toastMixin],
  props: {
    userData: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      patientName: "",
      patientGender: "",
      patientAddress: "",
      patientContact: "",
      patientEmail: "",
      patientAlternateContact: "",
      patientDateOfBirth: "",
      uuidv4: uuidv4(),
      errors: {
        patientName: "",
        patientGender: "",
        patientAddress: "",
        patientContact: "",
        patientEmail: "",
        patientAlternateContact: "",
        patientDateOfBirth: "",
      } as Record<string, string>,
      touched: {
        patientName: false,
        patientGender: false,
        patientAddress: false,
        patientContact: false,
        patientEmail: false,
        patientAlternateContact: false,
        patientDateOfBirth: false,
      } as Record<string, boolean>,
    };
  },
  emits: ["patient-added", "cancel-form", "patient-updated", "patient-updated"],
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
        console.log("vl", val);

        if (val) {
          // Prefill fields for edit
          this.patientName = val.patientName || "";
          this.patientGender = val.patientGender || "";
          this.patientAddress = val.patientAddress || "";
          this.patientContact = val.patientContact || "";
          this.patientAlternateContact = val.patientAlternateContact || "";
          this.patientEmail = val.patientEmail || "";
          this.patientDateOfBirth = val.patientDateOfBirth || "";
          Object.keys(this.errors).forEach((k) => (this.errors[k] = ""));
        } else {
          // Fresh form for add
          this.resetForm();
        }
      },
    },
  },
  methods: {
    baseValidation(): Record<string, string> {
      const errs: Record<string, string> = {
        patientName: "",
        patientGender: "",
        patientAddress: "",
        patientContact: "",
        patientEmail: "",
        patientAlternateContact: "",
        patientDateOfBirth: "",
      };
      if (!isRequiredText(this.patientName)) errs.patientName = "Name required";
      else if (!hasMinLength(this.patientName, 2))
        errs.patientName = "Min 2 characters";

      if (!isRequiredText(this.patientDateOfBirth))
        errs.patientDateOfBirth = "DOB required";
      else if (!isNotFutureDate(this.patientDateOfBirth))
        errs.patientDateOfBirth = "Future date invalid";

      if (!isRequiredText(this.patientGender))
        errs.patientGender = "Gender required";

      if (!isRequiredText(this.patientContact))
        errs.patientContact = "Contact required";
      else if (!isTenDigitPhone(this.patientContact))
        errs.patientContact = "Must be 10 digits";

      if (
        isRequiredText(this.patientAlternateContact) &&
        !isTenDigitPhone(this.patientAlternateContact)
      )
        errs.patientAlternateContact = "Must be 10 digits";

      if (!isRequiredText(this.patientEmail))
        errs.patientEmail = "Email required";
      else if (!isValidEmail(this.patientEmail))
        errs.patientEmail = "Invalid email";

      if (!isRequiredText(this.patientAddress))
        errs.patientAddress = "Address required";
      return errs;
    },
    checkValid(): boolean {
      const errs = this.baseValidation();
      console.log("err", errs);

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
      this.patientName = "";
      this.patientGender = "";
      this.patientAddress = "";
      this.patientContact = "";
      this.patientEmail = "";
      this.patientAlternateContact = "";
      this.patientDateOfBirth = "";
      Object.keys(this.errors).forEach((k) => (this.errors[k] = ""));
      Object.keys(this.touched).forEach((k) => (this.touched[k] = false));
    },
    submitForm() {
      this.touched = Object.fromEntries(
        Object.keys(this.touched).map((k) => [k, true])
      ) as Record<string, boolean>;
      this.validateAll();
      if (!this.checkValid()) return;
      const payload = {
        patientName: this.patientName.trim(),
        patientGender: this.patientGender,
        patientAddress: this.patientAddress.trim(),
        patientContact: this.patientContact.trim(),
        patientAlternateContact: this.patientAlternateContact.trim(),
        patientEmail: this.patientEmail.trim(),
        patientDateOfBirth: this.patientDateOfBirth,
      };
      if (this.isEditMode && this.userData) {
        updatePatient(this.userData.id, payload);
        this.toastSuccess("Patient updated successfully");
        this.$emit("patient-updated");
        this.resetForm();
      } else {
        addPatient(payload);
        this.toastSuccess("Patient added successfully");
        this.resetForm();
        this.$emit("patient-added");
      }
    },
  },
};
</script>
