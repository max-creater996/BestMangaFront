<script setup lang="ts">
import { computed } from "vue";
import { Heart } from "lucide-vue-next";
import {useChapterStore} from "~/entities/Chapter/model/Module/useChapterStore";


const chapterStore = useChapterStore();

// Форматирование количества лайков
const formattedLikes = computed(() => {
  const totalLikes = chapterStore.chapter?.total_likes || 0;
  if (totalLikes >= 1_000_000) return (totalLikes / 1_000_000).toFixed(1) + "M";
  if (totalLikes >= 1_000) return (totalLikes / 1_000).toFixed(1) + "K";
  return totalLikes.toString();
});

// Обработка нажатия на лайк
const toggleLike = async () => {
  if (!chapterStore.chapter) return;
  await chapterStore.toggleLike(chapterStore.chapter.id);
};
</script>

<template>
  <span
      :class="['like-button', chapterStore.chapter?.is_liked ? 'liked' : '']"
      @click="toggleLike"
  >
    <Heart
        :fill="chapterStore.chapter?.is_liked ? '#ff4757' : 'none'"
        :stroke="chapterStore.chapter?.is_liked ? '#ff4757' : 'currentColor'"
    />
    {{ formattedLikes }}
  </span>
</template>

<style scoped>
.like-button {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transform: translateY(-4px);
}
.liked {
  color: #ff4757;
}
</style>
