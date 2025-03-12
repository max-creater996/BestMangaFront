<script setup lang="ts">
import s from "./SecondLayout.module.scss";
import AuthHeader from "~/widgets/AuthHeader/ui/AuthHeader.vue";

</script>

<template>
  <div :class="s.root">
    <AuthHeader />
    <slot />  <!-- Здесь будут рендериться дочерние компоненты -->
  </div>
</template>
