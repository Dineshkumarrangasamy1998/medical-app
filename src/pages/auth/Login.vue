<template>
  <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
    <h1 class="text-3xl font-bold mb-6">Login</h1>

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

      <div class="mb-6">
        <label class="block text-sm font-medium mb-1 required" for="password">Password</label>
        <div class="relative">
          <input
            id="password"
            v-model.trim="form.password"
            :type="showPassword ? 'text' : 'password'"
            class="w-full rounded border px-3 py-2 pr-10 focus:outline-none focus:ring"
            :class="{ 'border-red-500': v$.form.password.$error }"
            @blur="v$.form.password.$touch()"
            autocomplete="current-password"
            placeholder="Enter your password"
          />
          <button
            type="button"
            class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
            @click="showPassword = !showPassword"
            :aria-label="showPassword ? 'Hide password' : 'Show password'"
          >
            <EyeIcon v-if="!showPassword" class="h-5 w-5" />
            <EyeOffIcon v-else class="h-5 w-5" />
          </button>
        </div>
        <p v-if="v$.form.password.$error" class="mt-1 text-sm text-red-600">{{ v$.form.password.$errors[0]?.$message }}</p>
      </div>
      <div class="mb-4 flex items-center justify-end">
        Create an account?
        <router-link to="/register" class="text-blue-500 hover:underline ml-2"
          >Register</router-link
        >
      </div>

      <button
        type="submit"
        class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-60"
        :disabled="submitting"
      >
        {{ submitting ? "Signing in..." : "Login" }}
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
import { loginUser } from "../../services/userServices";
import { toastMixin } from "../../utils/toast";
import { EyeIcon, EyeOffIcon } from "../../utils/icons";

type LoginForm = {
  email: string;
  password: string;
};

export default defineComponent({
  name: "Login",
  mixins: [toastMixin],
  components: { EyeIcon, EyeOffIcon },
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      form: {
        email: "",
        password: "",
      } as LoginForm,
      submitting: false,
      showPassword: false,
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
      },
    };
  },
  methods: {
    async onSubmit() {
      this.v$.$touch();
      if (this.v$.$invalid) {
        // this.toastError("Please fix the errors and try again.");
        return;
      }

      try {
        this.submitting = true;
        await loginUser({
          email: this.form.email,
          password: this.form.password,
        });
        this.toastSuccess("Logged in successfully!");
        this.$router.push("/");
      } catch (err: any) {
        const message = err?.message || "Login failed. Check your credentials.";
        this.toastError(message);
      } finally {
        this.submitting = false;
      }
    },
  },
});
</script>
