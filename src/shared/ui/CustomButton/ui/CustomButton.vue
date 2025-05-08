<template>
  <button
    :class="[
      styles.customButton,
      styles[`customButton--${variant}`],
      { [styles['customButton--disabled']]: disabled }
    ]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import styles from './CustomButton.module.scss'

interface Props {
  variant?: 'primary' | 'secondary' | 'outline'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  disabled: false
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<style scoped>
.custom-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  border: none;
  outline: none;
}

.custom-button--primary {
  background-color: #3b82f6;
  color: white;
}

.custom-button--primary:hover:not(.custom-button--disabled) {
  background-color: #2563eb;
}

.custom-button--secondary {
  background-color: #e5e7eb;
  color: #374151;
}

.custom-button--secondary:hover:not(.custom-button--disabled) {
  background-color: #d1d5db;
}

.custom-button--outline {
  background-color: transparent;
  border: 2px solid #3b82f6;
  color: #3b82f6;
}

.custom-button--outline:hover:not(.custom-button--disabled) {
  background-color: #3b82f6;
  color: white;
}

.custom-button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style> 