<template>
  <div :class="s.card">
    <NuxtLink :to="`/edit_manga/${manga.slug}`" :class="s.cardImageWrapper">
      <img :src="`${manga.manga_img || '/images/unknown.png'}`"  :alt="manga.manga_title" :class="s.cardImage" />
    </NuxtLink>
    <div :class="s.cardContent">
      <p :class="s.tag">{{manga.manga_type}}</p>
      <NuxtLink :to="`/edit_manga/${manga.slug}`" :class="s.cardTextWrapper">
        <h3 :class="s.title">
          <TruncatedText :text="manga.manga_name" :maxLength="15" />
        </h3>
        <p :class="s.status">{{ manga.manga_status }} | {{ manga.translation_status }}</p>
        <p :class="s.rating">👍 {{ manga.total_likes }} 👎 {{ manga.total_dislikes }}</p>
        <p :class="s.chapters">📚 Глав: {{ manga.total_chapters }}</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import s from "./ProfileMangaCard.module.scss";
import TruncatedText from "~/shared/ui/TruncatedText/TruncatedText.vue";

defineProps<{
  manga: {
    manga_img: string;
    slug: string;
    manga_title: string;
    manga_name: string;
    manga_status: string;
    manga_type: string;
    translation_status: string;
    total_likes: number;
    total_dislikes: number;
    chapter_number: number;
    chapters_title: string;
    total_chapters: number;
  };
}>();
</script>