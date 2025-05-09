<script setup lang="ts">
import s from "./MainLayout.module.scss";
import {Header} from "~/widgets/Header";
import { Toaster } from 'vue-sonner'
import { SpeedInsights } from "@vercel/speed-insights/nuxt";
</script>

<template>
  <div :class="s.root">
    <div :class="s.container">
      <Toaster theme="dark"/>
      <SpeedInsights />
      <Header/>
      <slot/>
    </div>
  </div>
</template>
