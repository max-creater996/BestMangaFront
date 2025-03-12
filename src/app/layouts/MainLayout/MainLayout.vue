<script setup lang="ts">
import s from "./MainLayout.module.scss";
import {Header} from "~/widgets/Header";
</script>

<template>
  <div :class="s.root">
    <Header />
    <slot />  <!-- Здесь будут рендериться дочерние компоненты -->
  </div>
</template>
