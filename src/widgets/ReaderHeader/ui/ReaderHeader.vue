<script setup lang="ts">
import { useUserStore } from "~/entities/user/model/module/useUserStore";
import { ref, computed, onMounted } from "vue";
import { onClickOutside } from "@vueuse/core";
import s from "./ReaderHeader.module.scss";
import { HeaderChapters } from "../../../features/HeaderChapters";
import { useVisibilityStore } from "~/entities/useVisibilityNav/model/useVisibilityNavStore";

const visibilityStore = useVisibilityStore();
const userStore = useUserStore();
const headerRef = ref<HTMLElement | null>(null);
const placeholderRef = ref<HTMLElement | null>(null);
const headerHeight = ref(0); // Запоминаем высоту хедера

onMounted(async () => {
  if (!userStore.user || Object.keys(userStore.user).length === 0) {
    await userStore.GetUser();
  }
  if (headerRef.value) {
    visibilityStore.addExcludedRef(headerRef.value);
    headerHeight.value = headerRef.value.offsetHeight; // Запоминаем высоту при монтировании
  }
});

const userName = computed(() => (userStore.user ? userStore.user.username : "Регистрация"));
const userLink = computed(() => (userStore.user ? "/profile" : "/registration"));

onClickOutside(headerRef, (event) => {
  if (!visibilityStore.excludedRefs.some(ref => ref.contains(event.target as Node))) {
    visibilityStore.toggleVisibility();
  }
});

const beforeEnter = () => {
  if (placeholderRef.value) {
    placeholderRef.value.style.display = "none"; // Скрываем плейсхолдер перед появлением хедера
  }
};

const enter = (el: HTMLElement, done: () => void) => {
  el.style.transition = "transform 0.3s ease-in-out, opacity 0.3s ease-in-out";
  el.style.transform = "translateY(-100%)";
  el.style.opacity = "0";
  requestAnimationFrame(() => {
    el.style.transform = "translateY(0)";
    el.style.opacity = "1";
    setTimeout(done, 300);
  });
};

const leave = (el: HTMLElement, done: () => void) => {
  headerHeight.value = el.offsetHeight; // Сохраняем высоту перед закрытием
  el.style.transition = "transform 0.3s ease-in-out, opacity 0.3s ease-in-out";
  el.style.transform = "translateY(-100%)";
  el.style.opacity = "0";
  setTimeout(done, 300);
};

const afterLeave = () => {
  if (placeholderRef.value) {
    placeholderRef.value.style.height = `${headerHeight.value + 8}px`; // Устанавливаем высоту заранее сохранённую
    placeholderRef.value.style.display = "block"; // Показываем плейсхолдер
  }
};
</script>

<template>
  <!-- Плейсхолдер, который занимает место исчезнувшего хедера -->
  <div ref="placeholderRef" :class="s.placeholder"></div>

  <transition name="slide" @before-enter="beforeEnter" @enter="enter" @leave="leave" @after-leave="afterLeave">
    <div v-show="visibilityStore.isVisible" ref="headerRef" :class="s.root">
      <NuxtLink to="/">
        <img src="../img/logo.png" height="120px" alt="logo" />
      </NuxtLink>

      <HeaderChapters />

      <NuxtLink :to="userLink" :class="s.authText">
        {{ userName }}
      </NuxtLink>
    </div>
  </transition>
</template>
