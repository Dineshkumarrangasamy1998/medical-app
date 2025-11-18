<template>
  <div
    class="flex flex-col items-center justify-center text-center w-full"
    :class="wrapperHeightClass"
    role="status"
  >
    <div v-if="computedIcon" class="mb-4 text-gray-400" aria-hidden="true">
      <component :is="computedIcon" class="w-12 h-12" />
    </div>
    <p class="text-lg font-medium text-gray-700">
      <slot name="message">{{ message }}</slot>
    </p>
    <p v-if="description" class="mt-2 text-sm text-gray-500 max-w-md">
      <slot name="description">{{ description }}</slot>
    </p>
    <div class="mt-5 flex flex-wrap gap-3" v-if="hasActions">
      <slot name="actions">
        <button
          v-if="showRefresh"
          type="button"
          class="inline-flex items-center rounded bg-blue-600 px-4 py-2 text-white text-sm hover:bg-blue-700 focus:outline-none focus:ring"
          @click="$emit('refresh')"
        >
          {{ refreshLabel }}
        </button>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { EyeOffIcon } from "../utils/icons";

export default defineComponent({
  name: "NoData",
  props: {
    message: { type: String, default: "No data found" },
    description: { type: String, default: "" },
    icon: { type: [String, Object], default: "" }, // component or key
    height: { type: String, default: "min-h-[220px]" },
    showRefresh: { type: Boolean, default: false },
    refreshLabel: { type: String, default: "Reload" },
  },
  emits: ["refresh"],
  setup(props, { slots }) {
    const wrapperHeightClass = computed(() => props.height);
    const hasActions = computed(() => props.showRefresh || !!slots.actions);
    const computedIcon = computed(() => {
      if (typeof props.icon === "object") return props.icon;
      if (props.icon === "eye-off") return EyeOffIcon;
      return null;
    });
    return { wrapperHeightClass, hasActions, computedIcon };
  },
});
</script>

<style scoped></style>
