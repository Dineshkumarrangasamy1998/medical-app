<template>
  <teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-50"
      aria-modal="true"
      role="dialog"
      :aria-labelledby="titleId"
    >
      <div class="fixed inset-0 bg-black/40" @click="onBackdropClick"></div>

      <div class="fixed inset-0 flex items-center justify-center p-4">
        <div
          class="w-full max-w-2xl rounded-md bg-white shadow-lg ring-1 ring-black/10 overflow-auto max-h-[90vh]"
          role="document"
          @keydown.esc.prevent.stop="onEsc"
          tabindex="-1"
          ref="panel"
        >
          <div class="flex items-start justify-between px-4 py-3 border-b">
            <h2
              v-if="title"
              :id="titleId"
              class="text-base font-semibold text-gray-900"
            >
              {{ title }}
            </h2>
            <span v-else :id="titleId" class="sr-only">Dialog</span>
            <button
              class="ml-3 inline-flex items-center justify-center rounded-md p-1.5 text-gray-600 hover:text-black hover:bg-gray-100"
              type="button"
              aria-label="Close dialog"
              @click="close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="h-5 w-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div class="px-4 py-4">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "CommonDialog",
  props: {
    modelValue: { type: Boolean, required: true },
    title: { type: String, default: "" },
    closeOnBackdrop: { type: Boolean, default: true },
  },
  emits: ["update:modelValue", "close"],
  data() {
    return {
      titleIdInternal: "dialog-title-" + Math.random().toString(36).slice(2),
    };
  },
  computed: {
    titleId(): string {
      return this.titleIdInternal;
    },
  },
  mounted() {
    this.$nextTick(() => {
      const el = this.$refs.panel as HTMLElement | undefined;
      el?.focus();
    });
  },
  methods: {
    close() {
      this.$emit("update:modelValue", false);
      this.$emit("close");
    },
    onBackdropClick() {
      if (this.closeOnBackdrop) this.close();
    },
    onEsc() {
      this.close();
    },
  },
});
</script>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
