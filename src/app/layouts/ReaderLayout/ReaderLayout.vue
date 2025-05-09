<script setup lang="ts">
import s from "./ReaderLayout.module.scss";
import ReaderHeader from "~/widgets/ReaderHeader/ui/ReaderHeader.vue";
import { Toaster } from 'vue-sonner'
import { SpeedInsights } from "@vercel/speed-insights/nuxt";
</script>

<template>
  <div :class="s.root">
    <Toaster theme="dark"/>
    <ReaderHeader />
    <SpeedInsights />
    <slot />  <!-- Здесь будут рендериться дочерние компоненты -->
  </div>
</template>
