<script setup lang="ts">
import {ChapterForm} from "~/features/ChapterForm";
import {MainLayout} from "~/app/layouts";

const route = useRoute();
const slug = route.params.slug as string;
const chapter_number = route.params.chapter_number as string;
</script>

<template>
<MainLayout>
    <ChapterForm :slug="slug" :chapter_number="chapter_number" />
</MainLayout>
</template>
