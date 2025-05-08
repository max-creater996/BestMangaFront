<script setup lang="ts">
import styles from "./ProfileChapterCard.module.scss"
import { useUserChapterStore } from "~/entities/ProfileChapter/model/module/useUserChapterStore";
import { useRoute } from 'vue-router';

// Props for the chapter
const props = defineProps<{
  chapter: {
    id: number;
    chapter_number: number;
    chapter_title: string;
    volume: number;
    date_time: string;
  };
}>();

const route = useRoute();
const userChapterStore = useUserChapterStore();

// Получаем slug из URL
const mangaSlug = computed(() => {
  // Разбиваем путь на части и берем последний сегмент до знака вопроса
  const path = route.path;
  const segments = path.split('/');
  const lastSegment = segments[segments.length - 1];
  return lastSegment.split('?')[0];
});

// Function to format the date
const formatDate = (isoDate: string) => {
  return new Date(isoDate).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

// Функция для удаления главы
const handleDelete = async () => {
  if (confirm('Вы уверены, что хотите удалить эту главу?')) {
    try {
      await userChapterStore.deleteChapter(mangaSlug.value, props.chapter.chapter_number.toString());
      // После успешного удаления обновляем список глав
      await userChapterStore.fetchChapters(mangaSlug.value);
    } catch (error) {
      console.error('Error deleting chapter:', error);
    }
  }
};
</script>

<template>
  <div :class="styles.chapter">
    <NuxtLink :to="`${$route.path}/${chapter.chapter_number}`">
      <div class="chapter-info">
        <h3>Глава {{ chapter.chapter_number }}</h3>
        <p>{{ chapter.chapter_title }}</p>
        <p>Том {{chapter.volume}}</p>
      </div>
      <span class="date">{{ formatDate(chapter.date_time) }}</span>
    </NuxtLink>
    <button 
      :class="styles.deleteButton" 
      @click.prevent="handleDelete"
      :disabled="userChapterStore.loading"
    >
      {{ userChapterStore.loading ? 'Удаление...' : 'Удалить' }}
    </button>
  </div>
</template>