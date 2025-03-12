<script setup lang="ts">
import styles from './MangaPage.module.scss';
import { MangaDescription } from "~/widgets/mangaDescription";
import { MangaChapters } from "~/features/MangaChapters";
import { useMangaStore } from "~/entities/Manga/model/module/useMangaStore";
import { useRoute } from "#vue-router";
import { ref } from "vue";
import {MainLayout} from "~/app/layouts";

const route = useRoute();
const slug = route.params.slug as string;

const mangaStore = useMangaStore();
const isLoading = ref(true); // Флаг загрузки

mangaStore.fetchManga(slug).then(() => {
  isLoading.value = false; // После загрузки скрываем индикатор
}).catch(() => {
  isLoading.value = false; // В любом случае скрываем
});
</script>

<template>
  <MainLayout>
    <div :class="styles.container">
      <p v-if="isLoading" :class="styles.loading">Загрузка...</p>
      <template v-else>
        <MangaDescription />
        <MangaChapters />
      </template>
    </div>
  </MainLayout>
</template>

