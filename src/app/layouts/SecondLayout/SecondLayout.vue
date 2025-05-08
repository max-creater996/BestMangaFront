<script setup lang="ts">
import s from "./SecondLayout.module.scss";
import AuthHeader from "~/widgets/AuthHeader/ui/AuthHeader.vue";
import { Toaster } from 'vue-sonner'
</script>

<template>
  <div :class="s.root">
    <Toaster theme="dark"/>
    <AuthHeader />
    <slot />  <!-- Здесь будут рендериться дочерние компоненты -->
  </div>
</template>
