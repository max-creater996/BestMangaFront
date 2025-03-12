<script setup lang="ts">
import { useUserStore } from "~/entities/user/model/module/UserStore";
import { ref, computed, onMounted, watch } from "vue";
import { onClickOutside } from "@vueuse/core";
import s from "./Header.module.scss";
import { HeaderChapters } from "~/widgets/HeaderChapters";
import { useVisibilityStore } from "~/entities/useVisibilityNav/model/useVisibilityNavStore";

const visibilityStore = useVisibilityStore();
const userStore = useUserStore();
const headerRef = ref<HTMLElement | null>(null);

onMounted(async () => {
  await userStore.GetUser();
  if (headerRef.value) {
    visibilityStore.addExcludedRef(headerRef.value);
  }
});

const userName = computed(() => (userStore.user ? userStore.user.username : "Регистрация"));
const userLink = computed(() => (userStore.user ? "/profile" : "/registration"));

onClickOutside(headerRef, () => {
  if (!visibilityStore.excludedRefs.some(ref => ref.contains(event.target as Node))) {
    visibilityStore.toggleVisibility();
  }
});

const beforeEnter = (el: HTMLElement) => {
  el.style.transform = "translateY(-100%)";
  el.style.opacity = "0";
};

const enter = (el: HTMLElement, done: () => void) => {
  el.style.transition = "transform 0.3s ease-in-out, opacity 0.3s ease-in-out";
  requestAnimationFrame(() => {
    el.style.transform = "translateY(0)";
    el.style.opacity = "1";
    setTimeout(done, 300);
  });
};

const leave = (el: HTMLElement, done: () => void) => {
  el.style.transition = "transform 0.3s ease-in-out, opacity 0.3s ease-in-out";
  el.style.transform = "translateY(-100%)";
  el.style.opacity = "0";
  setTimeout(done, 300);
};
</script>

<template>
  <transition name="slide" @before-enter="beforeEnter" @enter="enter" @leave="leave">
    <div v-show="visibilityStore.isVisible" ref="headerRef" :class="s.root">
      <NuxtLink to="/">
        <img src="../img/logo.jpg" height="120px" alt="logo" />
      </NuxtLink>

      <HeaderChapters />

      <NuxtLink :to="userLink" :class="s.authText">
        {{ userName }}
      </NuxtLink>
    </div>
  </transition>
</template>
