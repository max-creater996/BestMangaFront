<script setup>
import { ref, watch, computed } from 'vue'
import s from "./CustomPicker.module.scss"

const props = defineProps({
  id: String,
  label: String,
  items: Array,
  modelValue: [Number, String, Array],
  placeholder: String,
  error: String,
  isLabelBold: Boolean,
  disabled: Boolean,
  multiple: Boolean
})

const emit = defineEmits(['update:modelValue'])

const query = ref('')
const isOpen = ref(false)
const selectedItems = ref(Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue].filter(Boolean))
const displayValue = computed(() => {
  if (props.multiple) return ''
  const selectedItem = props.items.find(item => item.id === selectedItems.value[0])
  return selectedItem ? selectedItem.name : ''
})

const filteredItems = computed(() =>
    query.value.trim()
        ? props.items.filter((item) => item.name.toLowerCase().includes(query.value.toLowerCase()))
        : props.items
)

watch(() => props.modelValue, (newValue) => {
  selectedItems.value = Array.isArray(newValue) ? newValue : [newValue].filter(Boolean)
})

const handleSearch = () => {
  if (props.disabled) return
  isOpen.value = true
  const exactMatch = props.items.find((item) => item.name.toLowerCase() === query.value.toLowerCase())
  if (exactMatch) {
    if (props.multiple) {
      if (!selectedItems.value.includes(exactMatch.id)) {
        selectedItems.value.push(exactMatch.id)
        emit('update:modelValue', selectedItems.value)
      }
    } else {
      selectedItems.value = [exactMatch.id]
      emit('update:modelValue', exactMatch.id)
    }
  }
}

const handleSelect = (item) => {
  if (props.disabled) return
  if (props.multiple) {
    if (!selectedItems.value.includes(item.id)) {
      selectedItems.value.push(item.id)
      emit('update:modelValue', selectedItems.value)
    }
  } else {
    selectedItems.value = [item.id]
    emit('update:modelValue', item.id)
  }
  query.value = ''
  isOpen.value = false
}

const removeItem = (itemId) => {
  if (props.disabled) return
  selectedItems.value = selectedItems.value.filter(id => id !== itemId)
  emit('update:modelValue', selectedItems.value)
}
</script>

<template>
  <span :class="s.root">
    <div :class="s.formGroup">
      <label :for="id" :class="isLabelBold ? s.bold : ''">{{ label }}</label>
      <input
          type="text"
          :id="id"
          :value="multiple ? query : displayValue"
          @input="e => {
            query = e.target.value;
            handleSearch();
          }"
          :placeholder="placeholder"
          :aria-invalid="!!error"
          :aria-describedby="error ? `${id}-error` : undefined"
          :class="error ? s.inputError : ''"
          :readonly="disabled"
          @focus="isOpen = true"
          autocomplete="off"
      />
      <ul v-if="isOpen && filteredItems.length" :class="s.dropdown">
        <li
            v-for="item in filteredItems"
            :key="item.id"
            @click="handleSelect(item)"
            :class="s.dropdownItem"
        >
          {{ item.name }}
        </li>
      </ul>

      <div v-if="multiple && selectedItems.length > 0" :class="s.selectedItems">
        <span v-for="itemId in selectedItems" :key="itemId" :class="s.selectedItem">
          {{ items.find(item => item.id === itemId)?.name }}
          <button 
            v-if="!disabled" 
            type="button" 
            @click="removeItem(itemId)"
            :class="s.removeButton"
          >
            ×
          </button>
        </span>
      </div>

      <p v-if="error" :id="`${id}-error`" :class="s.error">{{ error }}</p>
    </div>
  </span>
</template>



