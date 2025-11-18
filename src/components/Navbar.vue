<template>
  <header class="bg-white shadow sticky top-0 z-30">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <div class="flex items-center gap-3">
          <button
            class="sm:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            @click="toggleMobile"
            :aria-expanded="mobileOpen"
            aria-controls="primary-navigation"
            aria-label="Toggle navigation menu"
          >
            <MenuIcon v-if="!mobileOpen" class="h-6 w-6" />
            <CloseIcon v-else class="h-6 w-6" />
          </button>
          <router-link to="/" class="text-lg font-semibold whitespace-nowrap"
            ><span class="text-green-500 text-2xl">M</span>edical
            <span class="text-green-500 text-2xl">A</span>pp</router-link
          >
        </div>

        <!-- Desktop Navigation -->
        <nav
          id="primary-navigation"
          class="hidden sm:flex items-center gap-6"
          v-if="isAuthed"
        >
          <router-link
            class="text-gray-700 hover:text-black transition-colors text-sm font-medium"
            to="/doctors"
            >Doctors</router-link
          >
          <router-link
            class="text-gray-700 hover:text-black transition-colors text-sm font-medium"
            to="/patients"
            >Patients</router-link
          >
          <router-link
            class="text-gray-700 hover:text-black transition-colors text-sm font-medium"
            to="/appointment"
            >Appointment</router-link
          >

          <!-- Right side with user + actions -->
          <div class="flex items-center gap-3 pl-4 ml-4 border-l">
            <span class="flex items-center gap-2">
              <div
                class="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-200"
              >
                <UserIcon class="h-5 w-5 text-blue-700" />
              </div>
              <span
                class="text-sm text-gray-600 max-w-[160px] truncate"
                :title="currentUser?.email"
                >{{ currentUser?.email }}</span
              >
            </span>
            <button
              class="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm flex items-center gap-2"
              @click="onLogout"
            >
              <LogoutIcon class="h-4 w-4 text-red-600" />
              Logout
            </button>
          </div>
        </nav>

        <nav class="hidden sm:flex items-center gap-4" v-else>
          <router-link
            class="text-gray-700 hover:text-black transition-colors text-sm font-medium"
            to="/login"
            >Login</router-link
          >
          <router-link
            class="text-gray-700 hover:text-black transition-colors text-sm font-medium"
            to="/register"
            >Register</router-link
          >
        </nav>
      </div>
    </div>

    <!-- Mobile panel -->
    <div
      v-show="mobileOpen"
      class="sm:hidden border-t bg-white"
      @click.self="closeMobile"
    >
      <div class="px-4 pt-2 pb-4 space-y-4" :aria-hidden="!mobileOpen">
        <div v-if="isAuthed" class="flex flex-col gap-4">
          <router-link
            class="block w-full text-gray-700 hover:text-black font-medium"
            to="/doctors"
            @click="closeMobile"
            >Doctors</router-link
          >
          <router-link
            class="block w-full text-gray-700 hover:text-black font-medium"
            to="/patients"
            @click="closeMobile"
            >Patients</router-link
          >
          <router-link
            class="block w-full text-gray-700 hover:text-black font-medium"
            to="/appointment"
            @click="closeMobile"
            >Appointment</router-link
          >
          <div class="flex flex-col gap-2 pt-2 border-t">
            <button
              class="w-full px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 text-sm text-left flex items-center gap-2"
              @click="onLogout"
            >
              <LogoutIcon class="h-4 w-4 text-red-600" />
              Logout
            </button>
          </div>
        </div>
        <div v-else class="flex flex-col gap-3">
          <router-link
            class="block w-full text-gray-700 hover:text-black font-medium"
            to="/login"
            @click="closeMobile"
            >Login</router-link
          >
          <router-link
            class="block w-full text-gray-700 hover:text-black font-medium"
            to="/register"
            @click="closeMobile"
            >Register</router-link
          >
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  MenuIcon,
  CloseIcon,
  BellIcon,
  SettingsIcon,
  UserIcon,
  LogoutIcon,
} from "../utils/icons";
import {
  getCurrentUser,
  isAuthenticated,
  logout,
} from "../services/userServices";
import { toastMixin } from "../utils/toast";

export default defineComponent({
  name: "Navbar",
  mixins: [toastMixin],
  components: {
    CommonDialog: (await import("./CommonDialog.vue")).default,
    MenuIcon,
    CloseIcon,
    BellIcon,
    SettingsIcon,
    UserIcon,
    LogoutIcon,
  },
  data() {
    return {
      currentUser: getCurrentUser() as ReturnType<typeof getCurrentUser>,
      isAuthed: isAuthenticated(),
      _onAuthChanged: null as null | ((e: Event) => void),
      mobileOpen: false,
    };
  },
  created() {
    this._onAuthChanged = () => {
      this.currentUser = getCurrentUser();
      this.isAuthed = isAuthenticated();
      if (!this.isAuthed) this.mobileOpen = false;
    };
    window.addEventListener("auth:changed", this._onAuthChanged as any);
    window.addEventListener("click", this._onWindowClick as any);
    window.addEventListener("keydown", this._onKeydown as any);
  },
  beforeUnmount() {
    window.removeEventListener("auth:changed", this._onAuthChanged as any);
    window.removeEventListener("click", this._onWindowClick as any);
    window.removeEventListener("keydown", this._onKeydown as any);
  },
  methods: {
    onLogout() {
      const ok = confirm("Are you sure you want to logout?");
      if (!ok) return;
      logout();
      this.toastSuccess("Logged out");
      this.$router.push("/login");
    },
    toggleMobile() {
      this.mobileOpen = !this.mobileOpen;
    },
    closeMobile() {
      this.mobileOpen = false;
    },
  },
});
</script>

<style scoped></style>
