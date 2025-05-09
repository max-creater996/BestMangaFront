<script setup lang="ts">
import s from "./SecondLayout.module.scss";
import AuthHeader from "~/widgets/AuthHeader/ui/AuthHeader.vue";
import { Toaster } from 'vue-sonner'
import { SpeedInsights } from "@vercel/speed-insights/nuxt";
</script>

<template>
  <div :class="s.root">
    <Toaster theme="dark"/>
    <AuthHeader />
    <SpeedInsights />
    <slot />  <!-- Здесь будут рендериться дочерние компоненты -->
  </div>
</template>
