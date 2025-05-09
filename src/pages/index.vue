<template>
  <MainLayout>
    Новые главы
    <MangaList
    :manga-list="mangaStore.data && mangaStore.data"
    :is-list-view="true"
    :loading="mangaStore.loading"
    />
  </MainLayout>
</template>

<script setup lang="ts">
import { MangaList } from "~/entities/Manga/index.ts";
import { MainLayout } from "~/app/layouts";
import { onMounted } from "vue";
import {useMangaStore} from "~/entities/Manga/model/module/useMangaStore";

const mangaStore = useMangaStore();

onMounted(async () => {
  await mangaStore.fetchMangas();
});
</script>

