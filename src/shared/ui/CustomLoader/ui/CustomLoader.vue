<script setup lang="ts">
import styles from './CustomLoader.module.scss'

defineProps<{
  size?: 'small' | 'medium' | 'large'
  color?: string
}>()
</script>

<template>
  <div :class="[styles.loader, styles[size || 'medium']]">
    <div :class="styles.spinner" :style="{ borderTopColor: color || '#3498db' }"></div>
  </div>
</template>
