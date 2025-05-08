<template>
  <div v-if="error" class="error-text">
    {{ error }}
  </div>
</template>

<script setup lang="ts">
defineProps<{
  error: string
}>()
</script>

<style lang="scss" scoped>
.error-text {
  color: var(--color-red);
  font-size: 14px;
  margin-top: 10px;
}
</style>