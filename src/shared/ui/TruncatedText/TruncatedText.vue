<template>
  <span>{{ truncatedText }}</span>
</template>

<script setup lang="ts">
interface Props {
  text: string;
  maxLength?: number;
  suffix?: string;
}

const props = withDefaults(defineProps<Props>(), {
  maxLength: 15,
  suffix: '...'
});

const truncatedText = computed(() => {
  if (props.text.length <= props.maxLength) {
    return props.text;
  }
  return props.text.slice(0, props.maxLength) + props.suffix;
});
</script>
