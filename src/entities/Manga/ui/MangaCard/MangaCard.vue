<template>
  <div :class="s.card">
    <NuxtLink :to="`/manga/${manga.slug}`" :class="s.cardImageWrapper">
      <img :src="manga.manga_img" :alt="manga.manga_title" :class="s.cardImage" />
    </NuxtLink>
    <div :class="s.cardContent">
      <p :class="s.tag">{{manga.manga_type}}</p>
      <NuxtLink :to="`/manga/${manga.slug}`" :class="s.cardTextWrapper">
        <h3 :class="s.title">{{ manga.manga_name }}</h3>
        <p :class="s.status">{{ manga.manga_status }} | {{ manga.translation_status }}</p>
        <p :class="s.rating">👍 {{ manga.total_likes }} 👎 {{ manga.total_dislikes }}</p>
        <p :class="s.chapters">📚 Глава: {{ chapter.chapter_number }}</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import s from "./MangaCard.module.scss";

defineProps<{
  manga: {
    manga_img: string;
    slug: string;
    manga_title: string;
    manga_status: string;
    manga_type: string;
    translation_status: string;
    total_likes: number;
    total_dislikes: number;
    chapter_number: number;
    chapters_title: string;
  };
  chapter: any;
}>();
</script>
