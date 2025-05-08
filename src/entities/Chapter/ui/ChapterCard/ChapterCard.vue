<script setup lang="ts">
import styles from "./ChapterCard.module.scss"

// Props for the chapter and manga slug
defineProps<{
  chapter: {
    id: number;
    chapter_number: number;
    chapter_title: string;
    volume: number;
    date_time: string;
  };
  mangaSlug: string;
}>();

// Function to format the date
const formatDate = (isoDate: string) => {
  return new Date(isoDate).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};
</script>

<template>
  <div :class="styles.chapter">
    <NuxtLink :to="`${mangaSlug}/${chapter.chapter_number}`">
      <div class="chapter-info">
        <h3>Глава {{ chapter.chapter_number }}</h3>
        <p>{{ chapter.chapter_title }}</p>
        <p>Том {{chapter.volume}}</p>
      </div>
      <span class="date">{{ formatDate(chapter.date_time) }}</span>
    </NuxtLink>
  </div>
</template>
