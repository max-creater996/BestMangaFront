<script setup lang="ts">
import s from "./AuthHeader.module.scss"
</script>

<template>
  <div :class="s.root" >
    <NuxtLink to="/">
  <img src="../img/logo.png" height="120px"  alt="logo"/>
    </NuxtLink>
  </div>
</template>


