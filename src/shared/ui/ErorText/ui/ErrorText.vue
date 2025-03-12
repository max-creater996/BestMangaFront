<script setup lang="ts">
import s from "./ErrorText.module.scss";

defineProps<{ message: string }>();
</script>

<template>
  <p :class="s.error">{{ message }}</p>
</template>
