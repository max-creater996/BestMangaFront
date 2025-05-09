<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import styles from "./ChapterPage.module.scss";
import { useRoute } from "#vue-router";

import { CommentsModal } from "~/entities/Comments";
import { useCommentStore } from "~/entities/Comments/model/module/useCommentStore";
import { useChapterStore } from "~/entities/Chapter/model/Module/useChapterStore";
import {ReaderMenu} from "~/widgets/ReaderMenu";

const route = useRoute();
const slug = route.params.slug as string;
const number = Number(route.params.number);

const commentStore = useCommentStore();
const chapterStore = useChapterStore();
await chapterStore.fetchChapter(slug, number);

const currentPage = ref(1);
const totalPages = ref(chapterStore.chapter?.pages.length || 1);
const pageRefs = ref<HTMLImageElement[]>([]);
const errorPages = ref<Record<number, boolean>>({});

const updateCurrentPage = (entries: IntersectionObserverEntry[]) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      const index = pageRefs.value.findIndex((el) => el === entry.target);
      if (index !== -1) {
        currentPage.value = index + 1;
        commentStore.setcommentPageID(chapterStore.chapter?.pages[index]?.id || null);
      }
    }
  }
};

const observer = ref<IntersectionObserver | null>(null);

onMounted(() => {
  totalPages.value = chapterStore.chapter?.pages.length || 1;

  observer.value = new IntersectionObserver(updateCurrentPage, {
    root: null,
    rootMargin: "-45% 0px",
    threshold: 0,
  });

  pageRefs.value.forEach((page) => observer.value?.observe(page));
});

onUnmounted(() => {
  observer.value?.disconnect();
});

const handleImageError = (index: number) => {
  errorPages.value[index] = true;
};

const reloadImage = (index: number) => {
  errorPages.value[index] = false;
  chapterStore.chapter.pages[index].image += "?t=" + new Date().getTime();
};
</script>

<template>
  <div :class="styles.readerContainer">
    <h1 :class="styles.chapterTitle">Глава {{ chapterStore.chapter?.chapter_title }}</h1>

    <div :class="styles.pagesContainer">
      <div v-for="(page, index) in chapterStore.chapter?.pages" :key="index" :class="styles.imageWrapper">
        <img
            v-if="!errorPages[index]"
            ref="pageRefs"
            :src="page.image"
            :alt="`Page ${index + 1}`"
            :class="styles.mangaPage"
            loading="lazy"
            :id="index + 1"
            @error="handleImageError(index)"
        />
        <button v-else @click="reloadImage(index)" :class="styles.reloadButton">
          🔄 Перезагрузить
        </button>
      </div>
    </div>

    <div :class="styles.navigationButtons">
      <NuxtLink v-if="!chapterStore.chapter?.is_last_chapter" :to="`${number + 1}`" :class="styles.nextChapterButton">
        <span>Следующая глава</span>
      </NuxtLink>
      <NuxtLink v-else :to="`/manga/${slug}`" :class="styles.backToTitleButton">
        <span>Вернуться к тайтлу</span>
      </NuxtLink>
    </div>

    <CommentsModal />

    <ReaderMenu :currentPage="currentPage" :totalPages="totalPages" />
  </div>
</template>
