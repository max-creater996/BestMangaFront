<script setup lang="ts">
import { ref, watch } from "vue";
import s from "./CustomTextarea.module.scss";

const props = defineProps<{
  modelValue: string;
  placeholder?: string;
  autoGrow?: boolean;
  maxHeight?: string;
}>();

const emit = defineEmits(["update:modelValue"]);
const textareaRef = ref<HTMLTextAreaElement | null>(null);

const updateValue = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;
  emit("update:modelValue", target.value);
};

watch(() => props.modelValue, () => {
  if (props.autoGrow && textareaRef.value) {
    textareaRef.value.style.height = "auto";
    textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`;
  }
});
</script>

<template>
  <textarea
      ref="textareaRef"
      :class="s.textarea"
      :placeholder="placeholder"
      :value="modelValue"
      @input="updateValue"
      :style="{ maxHeight: maxHeight }"
  ></textarea>
</template>

