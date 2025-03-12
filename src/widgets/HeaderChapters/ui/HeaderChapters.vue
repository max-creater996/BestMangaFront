<script setup lang="ts">
import { useRoute } from "#vue-router";
import { useMangaStore } from "~/entities/Manga/model/module/useMangaStore";
import { ref, computed } from "vue";
import styles from "./HeaderChapters.module.scss";
import {MoveRight,MoveLeft} from "lucide-vue-next";

const mangaStore = useMangaStore();
const route = useRoute();

const chapters = ref<any[]>([]);
const isVisible = ref(false);
const isLoading = ref(false);
const isModalOpen = ref(false);
const error = ref<string | null>(null);

const currentChapter = computed(() => mangaStore.chapter?.chapter_number || false);
if (route.params.slug && route.params.number){
  isVisible.value = true;
}
const loadChapters = async () => {
  try {
    error.value = null;
    isLoading.value = true; // Перенес вверх, чтобы показать индикатор загрузки
    await mangaStore.fetcChapters(route.params.slug);
    chapters.value = mangaStore.chapters || [];
    console.log(chapters.value);
  } catch (e) {
    error.value = "Ошибка загрузки глав.";
  } finally {
    isLoading.value = false;
  }
};

const openModal = async () => {
  isModalOpen.value = true;
  if (!chapters.value.length) {
    await loadChapters();
  }
};
</script>

<template>
  <div :class="styles.container" v-if="isVisible">
    <NuxtLink :to="`/manga/${route.params.slug}`" :class="styles.backManga">Вернуться к тайтлу</NuxtLink>
    <div :class="styles.currentChapter">
      <span v-if="currentChapter" >
        <NuxtLink :to="`${mangaStore.chapter.chapter_number - 1}`"><span v-if="!mangaStore.chapter.is_first_chapter" :class="styles.arrow"><MoveLeft /></span></NuxtLink>
        <span @click="openModal">Том {{ mangaStore.chapter.volume }} Глава {{ currentChapter }}</span>
        <NuxtLink :to="`${mangaStore.chapter.chapter_number + 1}`"><span v-if="!mangaStore.chapter.is_last_chapter" :class="styles.arrow"><MoveRight /></span></NuxtLink>
      </span>
    </div>


    <Teleport to="body">
      <div v-if="isModalOpen" :class="styles.modalOverlay" @click.self="isModalOpen = false">
        <div :class="styles.modal">
          <h3>Список глав</h3>
          <div v-if="isLoading">Загрузка глав...</div>
          <div v-else-if="error" :class="styles.error">{{ error }}</div>
          <div v-else :class="styles.chapterList">
            <div v-for="chapter in chapters" :key="chapter.id" :class="styles.chapter">
              <NuxtLink :to="`${chapter.chapter_number}`">Глава {{ chapter.chapter_number }}</NuxtLink>
            </div>
          </div>
          <button :class="styles.closeBtn" @click="isModalOpen = false">Закрыть</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>


