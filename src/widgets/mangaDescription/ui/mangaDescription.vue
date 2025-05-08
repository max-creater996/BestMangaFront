<script setup lang="ts">
import styles from "./mangaDescription.module.scss";
import { useMangaStore } from "~/entities/Manga/model/module/useMangaStore";
import { ref } from "vue";

const mangaStore = useMangaStore();
const manga = mangaStore.manga;

// Локальное состояние для лайков/дизлайков
const totalLikes = ref(manga.total_likes);
const totalDislikes = ref(manga.total_dislikes);
const liked = ref(manga.liked);
const disliked = ref(manga.disliked);
const likeSuccess = ref<boolean>();
const dislikeSuccess = ref<boolean>();
const toggleLike = async () => {
  if (liked.value) {
    await mangaStore.addLike(manga.id).then(() => {
      likeSuccess.value = true;
    });
    if (likeSuccess.value) {
      totalLikes.value--;
      liked.value = false;
    }
  } else {
    await mangaStore.addLike(manga.id).then(()=>{
      likeSuccess.value = true;
    });
    if (likeSuccess.value) {
      totalLikes.value++;
      liked.value = true;
      if (disliked.value) {
        totalDislikes.value--;
        disliked.value = false;
      }
    }
  }
};

const toggleDislike = async () => {
  if (disliked.value) {
    await mangaStore.addDisLike(manga.id).then(()=>{
      dislikeSuccess.value = true;
    });
    if (dislikeSuccess.value) {
      totalDislikes.value--;
      disliked.value = false;
    }
  } else {
    await mangaStore.addDisLike(manga.id).then(()=>{
      dislikeSuccess.value = true;
    });
    if (dislikeSuccess.value) {
      totalDislikes.value++;
      disliked.value = true;
      if (liked.value) {
        totalLikes.value--;
        liked.value = false;
      }
    }
  }
};
</script>

<template>
  <div :class="styles.card">
    <img
        :src="manga.manga_img || '/unknown.png'"
        alt="Manga Cover"
        :class="styles.image"
    />
    <div :class="styles.content">
      <h1>{{ manga.manga_name || "Название неизвестно" }}</h1>
      <p :class="styles.status">{{ manga.manga_status || "Неизвестно" }}</p>
      <p>👀 {{ manga.views?.toLocaleString() || 0 }} просмотров</p>

      <div :class="styles.tags">
        <span v-for="(tag, index) in manga.tags" :key="index">{{ tag }}</span>
      </div>

      <p>{{ manga.manga_title || "Описание отсутствует." }}</p>

      <div>{{manga.note}}</div>

      <!-- Блок лайков/дизлайков -->
      <div :class="styles.reactions">
        <button
            :class="[styles.likeButton, { [styles.active]: liked }]"
            @click="toggleLike"
        >
          👍 {{ totalLikes }}
        </button>
        <button
            :class="[styles.dislikeButton, { [styles.active]: disliked }]"
            @click="toggleDislike"
        >
          👎 {{ totalDislikes }}
        </button>
      </div>
    </div>
  </div>
</template>
