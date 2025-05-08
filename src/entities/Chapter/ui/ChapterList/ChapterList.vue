<script setup lang="ts">
import styles from "./ChapterList.module.scss";
import { useMangaStore } from "~/entities/Manga/model/module/useMangaStore";
import ChapterCard from "~/entities/Chapter/ui/ChapterCard/ChapterCard.vue";

const mangaStore = useMangaStore();
const manga = mangaStore.manga;
</script>

<template>
  <div :class="styles.chapterList">
    <h2>📖 Новые главы</h2>
    <div :class="styles.list">
      <ChapterCard
        v-for="chapter in manga.chapters"
        :key="chapter.id"
        :chapter="chapter"
        :mangaSlug="manga.slug"
      />
    </div>
  </div>
</template>