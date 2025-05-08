<script setup lang="ts">
import { useUserChapterStore } from "~/entities/ProfileChapter/model/module/useUserChapterStore";
import { useRoute } from "#vue-router";
import { onMounted, ref } from "vue";
import ProfileChapterList from "~/entities/ProfileChapter/model/ui/ProfileChapterList/ProfileChapterList.vue";
import s from "./ProfileEditChapters.module.scss";

const route = useRoute();
const userChapterStore = useUserChapterStore();
const isLoading = ref(true);

onMounted(async () => {
    try {
        await userChapterStore.fetchChapters(route.params.slug as string);
    } finally {
        isLoading.value = false;
    }
});
</script>

<template>
    <div>
        <p v-if="isLoading">Загрузка...</p>
        <div v-else>
            <NuxtLink :to="`${$route.path}/add_chapter`" :class="s.addMangaButton">
                Добавить главу
            </NuxtLink>
            <ProfileChapterList />
        </div>
    </div>
</template>