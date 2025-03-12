<script setup lang="ts">
import styles from "./MangaChapters.module.scss";
import { useMangaStore } from "~/entities/Manga/model/module/useMangaStore";

const mangaStore = useMangaStore();
const manga = mangaStore.manga;

// Функция для форматирования даты
const formatDate = (isoDate: string) => {
  return new Date(isoDate).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};
</script>

<template>
  <div :class="styles.chapterList">
    <h2>📖 Новые главы</h2>
    <div :class="styles.list">
      <div
          v-for="chapter in manga.chapters"
          :key="chapter.id"
          :class="styles.chapter"
      >
        <NuxtLink :to="`${manga.slug}/${chapter.chapter_number}`">
          <div class="chapter-info">
            <h3>Глава {{ chapter.chapter_number }}</h3>
            <p>{{ chapter.chapter_title }}</p>
            <p>Том {{chapter.volume}}</p>
          </div>
          <span class="date">{{ formatDate(chapter.date_time) }}</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
