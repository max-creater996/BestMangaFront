<script setup lang="ts">
import styles from './CustomBoolean.module.scss'

interface Props {
  modelValue: boolean;
  label?: string;
  id?: string;
  error?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  id: '',
  error: '',
  disabled: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
}
</script>

<template>
  <div :class="styles.customBoolean">
    <div :class="styles.checkboxWrapper">
      <input
        type="checkbox"
        :id="id"
        :checked="modelValue"
        :disabled="disabled"
        @change="handleChange"
        :class="styles.checkboxInput"
      />
      <label :for="id" :class="styles.checkboxLabel">
        {{ label }}
      </label>
    </div>
    <span v-if="error" :class="styles.errorText">{{ error }}</span>
  </div>
</template>