<template>
  <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
    <h1 class="text-3xl font-bold mb-6">Register</h1>

    <form @submit.prevent="onSubmit" novalidate>
      <div class="mb-4">
        <label class="block text-sm font-medium mb-1 required" for="email">Email</label>
        <input
          id="email"
          v-model.trim="form.email"
          type="email"
          class="w-full rounded border px-3 py-2 focus:outline-none focus:ring"
          :class="{ 'border-red-500': v$.form.email.$error }"
          @blur="v$.form.email.$touch()"
          autocomplete="email"
          placeholder="you@example.com"
        />
        <p v-if="v$.form.email.$error" class="mt-1 text-sm text-red-600">
          {{ v$.form.email.$errors[0]?.$message }}
        </p>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium mb-1 required" for="password"
          >Password</label
        >
        <input
          id="password"
          v-model.trim="form.password"
          type="password"
          class="w-full rounded border px-3 py-2 focus:outline-none focus:ring"
          :class="{ 'border-red-500': v$.form.password.$error }"
          @blur="v$.form.password.$touch()"
          autocomplete="new-password"
          placeholder="Create a password (min 6 chars)"
        />
        <p v-if="v$.form.password.$error" class="mt-1 text-sm text-red-600">
          {{ v$.form.password.$errors[0]?.$message }}
        </p>
      </div>

      <div class="mb-6">
        <label class="block text-sm font-medium mb-1 required" for="confirm"
          >Confirm Password</label
        >
        <input
          id="confirm"
          v-model.trim="form.confirmPassword"
          type="password"
          class="w-full rounded border px-3 py-2 focus:outline-none focus:ring"
          :class="{ 'border-red-500': v$.form.confirmPassword.$error }"
          @blur="v$.form.confirmPassword.$touch()"
          autocomplete="new-password"
          placeholder="Re-enter your password"
        />
        <p
          v-if="v$.form.confirmPassword.$error"
          class="mt-1 text-sm text-red-600"
        >
          {{ v$.form.confirmPassword.$errors[0]?.$message }}
        </p>
      </div>
      <div class="mb-4 flex items-center justify-end">
        Already have an account?
        <router-link to="/login" class="text-blue-500 hover:underline ml-2"
          >Login</router-link
        >
      </div>

      <button
        type="submit"
        class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-60"
        :disabled="submitting"
      >
        {{ submitting ? "Registering..." : "Register" }}
      </button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import useVuelidate from "@vuelidate/core";
import {
  required,
  email as vEmail,
  minLength,
  helpers,
} from "@vuelidate/validators";
import { toastMixin } from "../../utils/toast";
import { registerUser } from "../../services/userServices";

type Form = {
  email: string;
  password: string;
  confirmPassword: string;
};

export default defineComponent({
  name: "Register",
  mixins: [toastMixin],
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      form: {
        email: "",
        password: "",
        confirmPassword: "",
      } as Form,
      submitting: false,
    };
  },
  validations() {
    return {
      form: {
        email: {
          required: helpers.withMessage("Email is required", required),
          email: helpers.withMessage("Enter a valid email", vEmail),
        },
        password: {
          required: helpers.withMessage("Password is required", required),
          minLength: helpers.withMessage("Minimum 6 characters", minLength(6)),
        },
        confirmPassword: {
          required: helpers.withMessage("Confirm your password", required),
          matchesPassword: helpers.withMessage(
            "Passwords must match",
            (value: string) => value === this.form.password
          ),
        },
      },
    };
  },
  methods: {
    async onSubmit() {
      // Touch all fields to reveal errors
      this.v$.$touch();
      if (this.v$.$invalid) {
        // this.toastError("Please fix the errors and try again.");
        return;
      }

      try {
        this.submitting = true;
        await registerUser({
          email: this.form.email,
          password: this.form.password,
        });
        this.toastSuccess("Registered successfully! Please login.");
        this.$router.push("/login");
      } catch (err: any) {
        const message =
          err?.message || "Registration failed. Please try again.";
        this.toastError(message);
      } finally {
        this.submitting = false;
      }
    },
  },
});
</script>
