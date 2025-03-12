<template>
  <div :class="[s.container, { [s.listView]: isListView }]">
    <MangaCard
        v-for="manga in mangaList"
        :key="manga.manga.id"
        :manga="manga.manga"
        :chapter="manga"
    />
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import s from "./MangaList.module.scss";
import MangaCard from "~/entities/Manga/ui/MangaCard/MangaCard.vue";

const props = defineProps({
  mangaList: {
    type: Array,
    required: true,
  },
  isListView: {
    type: Boolean,
    default: false,
  },
});
</script>
