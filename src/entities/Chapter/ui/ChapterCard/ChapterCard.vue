<script setup lang="ts">
import styles from "./ChapterCard.module.scss"
import { ref } from 'vue'

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

// Loading state to prevent multiple clicks
const isLoading = ref(false)

// Function to format the date
const formatDate = (isoDate: string) => {
  return new Date(isoDate).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

// Function to handle click with loading state
const handleClick = () => {
  if (isLoading.value) return
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
}
</script>

<template>
  <div :class="styles.chapter">
    <NuxtLink
        :to="`${mangaSlug}/${chapter.chapter_number}`"
        @click="handleClick"
        :class="{ 'pointer-events-none': isLoading }"
    >
      <div class="chapter-info">
        <h3>Глава {{ chapter.chapter_number }}</h3>
        <p>{{ chapter.chapter_title }}</p>
        <p>Том {{chapter.volume}}</p>
      </div>
      <span class="date">{{ formatDate(chapter.date_time) }}</span>
    </NuxtLink>
  </div>
</template>

<style scoped>
.pointer-events-none {
  pointer-events: none;
  opacity: 0.7;
}
</style>
