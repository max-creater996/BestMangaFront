<script setup>
import { computed } from 'vue';
import style from './CustomTextinput.module.scss';

const props = defineProps({
  modelValue: String,
  label: String,
  placeholder: String,
  type: {
    type: String,
    default: 'text'
  },
  id: String,
  error: String
});

const emit = defineEmits(['update:modelValue', 'blur']);

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});
</script>

<template>
  <div :class="style.customTextInput">
    <label v-if="label" :for="id">{{ label }}</label>
    <input
        :id="id"
        :type="type"
        :placeholder="placeholder"
        v-model="inputValue"
        @blur="$emit('blur', inputValue)"
        :class="{ [style.inputError]: error }"
    />
    <p v-if="error" :class="style.errorMessage">{{ error }}</p>
  </div>
</template>


