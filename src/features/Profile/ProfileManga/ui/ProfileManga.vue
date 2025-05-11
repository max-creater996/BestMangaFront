<script setup lang="ts">
import s from "./ProfileManga.module.scss"
import {onMounted} from "vue";
import {ProfileMangaList} from "~/entities/ProfileManga/ui";
import {useUserMangaStore} from "~/entities/ProfileManga/model/module/useUserMangaStore";

const userMangaStore = useUserMangaStore()

onMounted(async () => {
  await userMangaStore.fetchUserManga();
});
</script>

<template>
  <NuxtLink href="add_manga" :class="s.addMangaButton">
    Добавить Мангу
  </NuxtLink>
  <ProfileMangaList
      :manga-list="userMangaStore.data && userMangaStore.data"
      :is-list-view="true"
      :is-loading="userMangaStore.loading"
  />
</template>
