<script setup lang="ts">
import { defineEmits, ref, onMounted } from "vue";
import { useVisibilityStore } from "~/entities/useVisibilityNav/model/useVisibilityNavStore";
import s from "./Modal.module.scss";

const emit = defineEmits(["close"]);
const visibilityStore = useVisibilityStore();
const refModal = ref<HTMLDivElement | null>(null);

onMounted(() => {
  if (refModal.value) {
    visibilityStore.addExcludedRef(refModal.value);
  }
});
</script>

<template>
  <Teleport to="body">
  <div :class="s.modalOverlay" @click.self="emit('close')">
    <div :class="s.modalContent" ref="refModal">
      <div :class="s.modalHeader">
        <slot name="header"></slot>
        <button :class="s.closeBtn" @click="emit('close')">×</button>
      </div>
      <div :class="s.modalBody">
        <slot name="body"></slot>
      </div>
    </div>
  </div>
  </Teleport>
</template>
