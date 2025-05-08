<script setup lang="ts">
import { useUserChapterStore } from "../../module/useUserChapterStore";
import ProdileChapterCard from "../ProfileChapterCard/ProdileChapterCard.vue";
import styles from "./ProfileChapterList.module.scss";
import { computed } from 'vue';

const UserChaptersStore = useUserChapterStore();
// Используем computed для реактивного обновления списка глав
const chapters = computed(() => UserChaptersStore.chapters);
</script>

<template>
  <div :class="styles.chapterList">
    <h2>📖 Новые главы</h2>
    <div :class="styles.list">
      <ProdileChapterCard
        v-for="chapter in chapters"
        :key="chapter.id"
        :chapter="chapter"
      />
<!--        :mangaSlug="UserChaptersStore.slug"-->

    </div>
  </div>
</template>
