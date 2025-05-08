<script setup lang="ts">
import s from "./MainLayout.module.scss";
import {Header} from "~/widgets/Header";
import { Toaster } from 'vue-sonner'
</script>

<template>
  <div :class="s.root">
    <div :class="s.container">
      <Toaster theme="dark"/>
      <Header/>
      <slot/>
    </div>
  </div>
</template>
