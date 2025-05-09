<template>
  <div 
    :class="[s.container, { [s.listView]: isListView }]"
    @mousedown="startDragging"
    @mousemove="drag"
    @mouseup="stopDragging"
    @mouseleave="stopDragging"
  >
    <div v-if="loading" :class="s.loader">
      <div :class="s.spinner"></div>
    </div>
    <template v-else>
      <MangaCard
        v-for="manga in mangaList"
        :key="manga.manga.id"
        :manga="manga.manga"
        :chapter="manga"
      />
    </template>
  </div>
</template>

<script setup>
import { defineProps, ref } from "vue";
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
  loading: {
    type: Boolean,
    default: false,
  }
});

const isDragging = ref(false);
const startX = ref(0);
const scrollLeft = ref(0);

const startDragging = (e) => {
  if (!props.isListView) return;
  
  isDragging.value = true;
  const container = e.currentTarget;
  startX.value = e.pageX - container.offsetLeft;
  scrollLeft.value = container.scrollLeft;
  
  container.style.cursor = 'grabbing';
  container.style.userSelect = 'none';
};

const drag = (e) => {
  if (!isDragging.value) return;
  
  e.preventDefault();
  const container = e.currentTarget;
  const x = e.pageX - container.offsetLeft;
  const walk = (x - startX.value) * 2;
  container.scrollLeft = scrollLeft.value - walk;
};

const stopDragging = (e) => {
  if (!isDragging.value) return;
  
  isDragging.value = false;
  const container = e.currentTarget;
  container.style.cursor = 'grab';
  container.style.removeProperty('user-select');
};
</script>

