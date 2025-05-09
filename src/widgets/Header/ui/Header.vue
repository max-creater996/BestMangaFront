<script setup lang="ts">
import { useUserStore } from "~/entities/user/model/module/useUserStore";
import { computed, onMounted } from "vue";
import s from "./Header.module.scss";

const userStore = useUserStore();

onMounted(async () => {
  if (!userStore.user || Object.keys(userStore.user).length === 0) {
    await userStore.GetUser();
  }
});

const userName = computed(() => (userStore.user ? userStore.user.username : "Регистрация"));
const userLink = computed(() => (userStore.user ? "/profile" : "/registration"));
</script>

<template>
  <div :class="s.root">
    <NuxtLink to="/" :class="s.logoLink">
      <img src="../img/logo.png" :class="s.logo" alt="logo" />
    </NuxtLink>

    <NuxtLink :to="userLink" :class="s.authText">
      {{ userName }}
    </NuxtLink>
  </div>
</template>