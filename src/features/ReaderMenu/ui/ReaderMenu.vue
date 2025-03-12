<script setup lang="ts">
import { defineProps, ref, onMounted } from "vue";
import s from "./ReaderMenu.module.scss";
import { MessageSquareMore } from "lucide-vue-next";
import { useVisibilityStore } from "~/entities/useVisibilityNav/model/useVisibilityNavStore";
import { useCommentStore } from "~/entities/Comments/model/module/useCommentStore";
import CurrentPage from "~/entities/Chapter/ui/CurrentPage/CurrentPage.vue";
import {LikeButton} from "~/entities/Chapter/ui";


const visibilityStore = useVisibilityStore();
const commentStore = useCommentStore();

const readerRef = ref<HTMLElement | null>(null);

const props = defineProps<{ currentPage: number; totalPages: number }>();

onMounted(() => {
  if (readerRef.value) {
    visibilityStore.addExcludedRef(readerRef.value);
  }
});

// Анимации для появления и скрытия меню
const beforeEnter = (el: HTMLElement) => {
  el.style.transform = "translateY(100%)";
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
  el.style.transform = "translateY(100%)";
  el.style.opacity = "0";
  setTimeout(done, 300);
};
</script>

<template>
  <transition name="slide" @before-enter="beforeEnter" @enter="enter" @leave="leave">
    <div v-show="visibilityStore.isVisible" ref="readerRef" :class="s.menu">
      <div :class="s.menuItems">
        <CurrentPage :currentPage="props.currentPage" :totalPages="props.totalPages" />
        <span :class="s.menuItem" @click="commentStore.commentBunble()">
          <MessageSquareMore />
        </span>
        <LikeButton />
      </div>
    </div>
  </transition>
</template>

<style scoped lang="scss" src="./ReaderMenu.module.scss"></style>
